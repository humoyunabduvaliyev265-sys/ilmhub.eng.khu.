import { Router, Request, Response, NextFunction } from 'express';
import { db, INITIAL_ADMIN_USERNAME } from './db';
import { UserAccount } from '../src/types';

export const apiRouter = Router();

// Middleware to extract and validate session token
export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
  authToken?: string;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required. No Bearer token provided.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const user = db.validateSession(token);

  if (!user) {
    res.status(401).json({ success: false, error: 'Session expired or account is disabled. Please log in again.' });
    return;
  }

  req.user = user;
  req.authToken = token;
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Administrative privilege required.' });
    return;
  }
  next();
}

// ----------------------------------------------------------------------
// SYSTEM / HEALTH
// ----------------------------------------------------------------------
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    database: 'central-persistent-json',
    system: 'ILMHUB ENGLISH Central Auth & DB System',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------------------------

// 1. Student Login (Multi-Device)
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password are required.' });
      return;
    }

    const { user, error } = db.verifyCredentials(username, password);
    if (!user) {
      res.status(401).json({ success: false, error: error || 'Invalid username or password' });
      return;
    }

    const token = await db.createSession(user.id);
    res.json({
      success: true,
      token,
      user
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Login failed.' });
  }
});

// 2. Admin Login (with confidential security code)
apiRouter.post('/auth/admin-login', async (req: Request, res: Response) => {
  try {
    const { securityCode, password } = req.body;
    if (!securityCode || !password) {
      res.status(400).json({ success: false, error: 'Security code and Admin password are required.' });
      return;
    }

    const { user, error } = db.verifyAdminAccess(securityCode, password);
    if (!user) {
      res.status(401).json({ success: false, error: error || 'Admin verification failed.' });
      return;
    }

    const token = await db.createSession(user.id);
    res.json({
      success: true,
      token,
      user
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Admin authentication failed.' });
  }
});

// 3. Current User Session Check
apiRouter.get('/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
});

// 4. Logout / Session Invalidation
apiRouter.post('/auth/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  if (req.authToken) {
    await db.destroySession(req.authToken);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ----------------------------------------------------------------------
// ADMIN USER MANAGEMENT (CENTRAL DATABASE)
// ----------------------------------------------------------------------

// List all registered accounts
apiRouter.get('/admin/users', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.getAllUsers(true);
  res.json({ success: true, users });
});

// Create new student
apiRouter.post('/admin/users', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password, fullName, email, level, isActive, notes } = req.body;
    const result = await db.createStudent({
      username,
      password,
      fullName,
      email,
      level: level || 'B1',
      isActive: isActive !== false,
      notes
    });

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(201).json({ success: true, user: result.user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Could not create student account.' });
  }
});

// Update student profile or enable/disable account
apiRouter.put('/admin/users/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.updateStudent(id, req.body);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, user: result.user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Could not update student account.' });
  }
});

// Reset student password
apiRouter.put('/admin/users/:id/password', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ success: false, error: 'New password is required.' });
      return;
    }

    const result = await db.resetStudentPassword(id, password);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Could not reset password.' });
  }
});

// Delete student account
apiRouter.delete('/admin/users/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.deleteStudent(id);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, message: 'Student account deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Could not delete student account.' });
  }
});

// ----------------------------------------------------------------------
// STUDENT PROGRESS SYNCHRONIZATION
// ----------------------------------------------------------------------

// Update student progress (Lessons, XP, Streak, Vocabulary, Grammar, etc.)
apiRouter.put('/users/:id/progress', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    // Ensure student only updates their own progress, unless admin
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Unauthorized to modify other student data.' });
      return;
    }

    const { progress } = req.body;
    if (!progress) {
      res.status(400).json({ success: false, error: 'Progress data is required.' });
      return;
    }

    const result = await db.updateProgress(id, progress);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, user: result.user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Progress synchronization failed.' });
  }
});

// Record test examination result
apiRouter.post('/users/:id/test-score', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    const { scoreData } = req.body;
    if (!scoreData) {
      res.status(400).json({ success: false, error: 'scoreData is required.' });
      return;
    }

    const result = await db.recordTestScore(id, scoreData);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, user: result.user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Could not record test score.' });
  }
});

// Update user self profile (e.g. from Settings)
apiRouter.put('/users/:id/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    const { fullName, email, level, password } = req.body;
    if (password) {
      await db.resetStudentPassword(id, password);
    }

    const result = await db.updateStudent(id, {
      ...(fullName ? { fullName } : {}),
      ...(email ? { email } : {}),
      ...(level ? { level } : {})
    });

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, user: result.user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Profile update failed.' });
  }
});

// Get user profile
apiRouter.get('/users/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = db.getUserById(id, req.user?.role === 'admin');
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }
  res.json({ success: true, user });
});
