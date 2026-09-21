import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { UserAccount } from '../types';
import {
  getStoredUsers,
  INITIAL_ADMIN_USERNAME,
  ADMIN_SECURITY_CODE,
  updateUserAccount
} from '../utils/storage';
import {
  Lock,
  User,
  Shield,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (user: UserAccount, isAdminPanelDirect?: boolean) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  theme,
  onToggleTheme
}) => {
  // Student Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin Modal / Access state
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [securityCodeInput, setSecurityCodeInput] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      const trimmedUser = username.trim().toLowerCase();
      const foundUser = users.find(
        u => u.username.toLowerCase() === trimmedUser && u.password === password
      );

      if (!foundUser) {
        setIsLoading(false);
        setErrorMessage('Invalid username or password. Please check your credentials or contact your Administrator.');
        return;
      }

      if (!foundUser.isActive) {
        setIsLoading(false);
        setErrorMessage('This account is currently deactivated. Please contact your Administrator for activation.');
        return;
      }

      // Update last active
      updateUserAccount(foundUser.id, { lastLoginAt: new Date().toISOString() });
      setIsLoading(false);
      onLoginSuccess(foundUser, false);
    }, 350);
  };

  const handleSecurityCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');

    if (securityCodeInput.trim() === ADMIN_SECURITY_CODE) {
      setAdminUnlocked(true);
      const users = getStoredUsers();
      const adminUser = users.find(
        u => u.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase()
      );
      if (adminUser) {
        setAdminPasswordInput(adminUser.password);
      }
    } else {
      setSecurityError('Incorrect security code. Access is restricted to authorized personnel.');
    }
  };

  const handleAdminDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getStoredUsers();
    const adminUser = users.find(
      u => u.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase()
    );

    if (adminUser && adminUser.password === adminPasswordInput) {
      updateUserAccount(adminUser.id, { lastLoginAt: new Date().toISOString() });
      onLoginSuccess(adminUser, true);
    } else {
      setSecurityError('Invalid Admin password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors relative">
      {/* Floating Theme Toggle in Login View */}
      <div className="fixed top-4 right-4 z-30">
        <button
          type="button"
          onClick={onToggleTheme}
          id="login-theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="px-3 py-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-md flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all active:scale-95"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-zinc-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Background ambient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-25">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/5">
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-7">
            <BrandLogo size="lg" className="mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-xs">
              Sign in with your student credentials assigned by your Administrator
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Student Login Form */}
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter your username (e.g. student1)"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Log In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer with discreet Admin Login trigger and theme toggle */}
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={onToggleTheme}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Theme: {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {/* Discreet Admin Login option as explicitly requested */}
            <button
              type="button"
              onClick={() => {
                setShowAdminGate(true);
                setSecurityCodeInput('');
                setSecurityError('');
                setAdminUnlocked(false);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

        {/* Security / Admin Unlock Dialog */}
        {showAdminGate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowAdminGate(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                    Administrator Gate
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Restricted to Administrator
                  </p>
                </div>
              </div>

              {!adminUnlocked ? (
                /* Step 1: Security Code Input */
                <form onSubmit={handleSecurityCodeSubmit} className="space-y-3.5">
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    Please enter the private security code to unlock Admin credentials:
                  </p>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="Enter security code"
                      value={securityCodeInput}
                      onChange={e => setSecurityCodeInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {securityError && (
                    <p className="text-xs text-red-500 font-medium">{securityError}</p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminGate(false)}
                      className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20"
                    >
                      Verify Code
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Unlocked Admin Credentials Revealed */
                <form onSubmit={handleAdminDirectLogin} className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Security Code Verified! Admin credentials unlocked.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-1">
                      Admin Username
                    </label>
                    <input
                      type="text"
                      disabled
                      value={INITIAL_ADMIN_USERNAME}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-1">
                      Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        required
                        value={adminPasswordInput}
                        onChange={e => setAdminPasswordInput(e.target.value)}
                        className="w-full px-3.5 py-2 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {securityError && (
                    <p className="text-xs text-red-500 font-medium">{securityError}</p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Launch Admin Dashboard</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
