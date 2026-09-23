import { UserAccount, UserProgress, EnglishLevel, TestScoreHistory } from '../types';

const AUTH_TOKEN_KEY = 'ilmhub_auth_session_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function clearAuthToken(): void {
  setAuthToken(null);
}

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  [key: string]: any;
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = { success: res.ok, error: `Server error (${res.status})` };
  }

  if (!res.ok && !data.error) {
    data.error = `HTTP Error ${res.status}: ${res.statusText}`;
  }

  return data;
}

export const api = {
  // Authentication
  async loginStudent(username: string, password: string): Promise<{ success: boolean; user?: UserAccount; token?: string; error?: string }> {
    try {
      const res = await request<{ success: boolean; user?: UserAccount; token?: string; error?: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ username, password })
        }
      );
      if (res.success && res.token) {
        setAuthToken(res.token);
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed' };
    }
  },

  async loginAdmin(securityCode: string, password: string): Promise<{ success: boolean; user?: UserAccount; token?: string; error?: string }> {
    try {
      const res = await request<{ success: boolean; user?: UserAccount; token?: string; error?: string }>(
        '/api/auth/admin-login',
        {
          method: 'POST',
          body: JSON.stringify({ securityCode, password })
        }
      );
      if (res.success && res.token) {
        setAuthToken(res.token);
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed' };
    }
  },

  async getMe(): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: 'No active session' };
    }
    try {
      const res = await request<{ success: boolean; user?: UserAccount; error?: string }>('/api/auth/me');
      if (!res.success) {
        clearAuthToken();
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not verify session' };
    }
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuthToken();
    }
  },

  // Admin User Management
  async getAdminUsers(): Promise<{ success: boolean; users?: UserAccount[]; error?: string }> {
    try {
      return await request<{ success: boolean; users?: UserAccount[]; error?: string }>('/api/admin/users');
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to load students' };
    }
  },

  async createStudent(studentData: {
    username: string;
    password: string;
    fullName: string;
    email?: string;
    level: EnglishLevel;
    isActive: boolean;
    notes?: string;
  }): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      return await request<{ success: boolean; user?: UserAccount; error?: string }>(
        '/api/admin/users',
        {
          method: 'POST',
          body: JSON.stringify(studentData)
        }
      );
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create student' };
    }
  },

  async updateStudent(
    id: string,
    updates: Partial<Omit<UserAccount, 'id' | 'createdAt'>>
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      return await request<{ success: boolean; user?: UserAccount; error?: string }>(
        `/api/admin/users/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates)
        }
      );
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update student' };
    }
  },

  async resetStudentPassword(id: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      return await request<{ success: boolean; error?: string }>(
        `/api/admin/users/${id}/password`,
        {
          method: 'PUT',
          body: JSON.stringify({ password: newPassword })
        }
      );
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reset password' };
    }
  },

  async deleteStudent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      return await request<{ success: boolean; error?: string }>(
        `/api/admin/users/${id}`,
        {
          method: 'DELETE'
        }
      );
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete student' };
    }
  },

  // Student Progress & Sync
  async syncProgress(userId: string, progress: UserProgress): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      return await request<{ success: boolean; user?: UserAccount; error?: string }>(
        `/api/users/${userId}/progress`,
        {
          method: 'PUT',
          body: JSON.stringify({ progress })
        }
      );
    } catch (err: any) {
      return { success: false, error: err.message || 'Progress sync failed' };
    }
  },

  async recordTestScore(
    userId: string,
    scoreData: Omit<TestScoreHistory, 'id' | 'date'>
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      return await request<{ success: boolean; user?: UserAccount; error?: string }>(
        `/api/users/${userId}/test-score`,
        {
          method: 'POST',
          body: JSON.stringify({ scoreData })
        }
      );
    } catch (err: any) {
      return { success: false, error: err.message || 'Test score sync failed' };
    }
  },

  async updateProfile(
    userId: string,
    data: { fullName?: string; email?: string; level?: EnglishLevel; password?: string }
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      return await request<{ success: boolean; user?: UserAccount; error?: string }>(
        `/api/users/${userId}/profile`,
        {
          method: 'PUT',
          body: JSON.stringify(data)
        }
      );
    } catch (err: any) {
      return { success: false, error: err.message || 'Profile update failed' };
    }
  }
};
