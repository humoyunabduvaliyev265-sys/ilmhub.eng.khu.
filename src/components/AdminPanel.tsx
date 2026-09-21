import React, { useState } from 'react';
import { UserAccount, EnglishLevel } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  getStoredUsers,
  createUserAccount,
  updateUserAccount,
  deleteUserAccount,
  INITIAL_ADMIN_USERNAME
} from '../utils/storage';
import {
  Users,
  UserPlus,
  Search,
  Key,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Shield,
  Activity,
  Award,
  Zap,
  Flame,
  LogOut,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  SlidersHorizontal,
  Check,
  Sun,
  Moon
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onSwitchToStudentView: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onLogout,
  onSwitchToStudentView,
  theme,
  onToggleTheme
}) => {
  const [users, setUsers] = useState<UserAccount[]>(() => getStoredUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [resettingUser, setResettingUser] = useState<UserAccount | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  // Form states for Create
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLevel, setNewLevel] = useState<EnglishLevel>('B1');
  const [newIsActive, setNewIsActive] = useState(true);
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form states for Edit
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLevel, setEditLevel] = useState<EnglishLevel>('B1');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editNotes, setEditNotes] = useState('');

  // Form state for Reset Password
  const [newResetPassword, setNewResetPassword] = useState('');

  // Revealed passwords map
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  const refreshList = () => {
    setUsers(getStoredUsers());
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const res = createUserAccount({
      username: newUsername,
      password: newPassword,
      fullName: newFullName,
      email: newEmail,
      level: newLevel,
      isActive: newIsActive,
      notes: newNotes
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to create user');
      return;
    }

    refreshList();
    setShowCreateModal(false);
    showNotification(`User "${newUsername}" created successfully!`);

    // Reset form
    setNewUsername('');
    setNewPassword('');
    setNewFullName('');
    setNewEmail('');
    setNewLevel('B1');
    setNewIsActive(true);
    setNewNotes('');
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email || '');
    setEditLevel(user.level);
    setEditIsActive(user.isActive);
    setEditNotes(user.notes || '');
    setFormError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const res = updateUserAccount(editingUser.id, {
      fullName: editFullName,
      email: editEmail,
      level: editLevel,
      isActive: editIsActive,
      notes: editNotes
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to update user');
      return;
    }

    refreshList();
    setEditingUser(null);
    showNotification(`Account "${editingUser.username}" updated!`);
  };

  const handleToggleStatus = (user: UserAccount) => {
    if (user.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase()) {
      alert('Admin account status cannot be deactivated');
      return;
    }

    const updated = !user.isActive;
    updateUserAccount(user.id, { isActive: updated });
    refreshList();
    showNotification(`Account "${user.username}" is now ${updated ? 'Active' : 'Deactivated'}`);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    if (!newResetPassword.trim()) {
      setFormError('New password cannot be empty');
      return;
    }

    updateUserAccount(resettingUser.id, { password: newResetPassword.trim() });
    refreshList();
    setResettingUser(null);
    setNewResetPassword('');
    showNotification(`Password reset successfully for "${resettingUser.username}"!`);
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;

    const res = deleteUserAccount(deletingUser.id);
    if (!res.success) {
      alert(res.error || 'Failed to delete');
      return;
    }

    refreshList();
    showNotification(`User "${deletingUser.username}" has been removed`);
    setDeletingUser(null);
  };

  const togglePasswordReveal = (userId: string) => {
    setRevealedPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = levelFilter === 'ALL' || u.level === levelFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.isActive) ||
      (statusFilter === 'INACTIVE' && !u.isActive);

    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Basic stats
  const totalStudents = users.filter(u => u.role === 'student').length;
  const activeStudents = users.filter(u => u.role === 'student' && u.isActive).length;
  const totalLessons = users.reduce((acc, u) => acc + (u.progress?.completedLessons?.length || 0), 0);
  const totalTests = users.reduce((acc, u) => acc + (u.progress?.testScores?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-700">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              id="admin-theme-toggle"
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>

            <button
              type="button"
              onClick={onSwitchToStudentView}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-colors border border-blue-200 dark:border-blue-900"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Student Platform</span>
            </button>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  @{currentUser.username}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-200/60 dark:border-red-900/40"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Toast Alert */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-bottom-5">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Dashboard Title & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Student Management
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Create student accounts, set credentials, oversee learning progress, and manage access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCreateModal(true);
              setFormError('');
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Student</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {totalStudents}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Registered learner accounts</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Access</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {activeStudents}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">{totalStudents - activeStudents} deactivated</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Lessons Finished</span>
              <Activity className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {totalLessons}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Across all CEFR levels</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tests Taken</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {totalTests}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Standardized assessments</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by username, full name, or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Level:</span>
            </div>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Levels</option>
              <option value="A1">A1 Beginner</option>
              <option value="A2">A2 Elementary</option>
              <option value="B1">B1 Intermediate</option>
              <option value="B2">B2 Upper-Int.</option>
              <option value="C1">C1 Advanced</option>
              <option value="C2">C2 Proficiency</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Deactivated</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Credentials</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Activity & XP</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/70">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-400">
                      No accounts matched the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => {
                    const isAdmin = user.role === 'admin';
                    const isRevealed = revealedPasswords[user.id];

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        {/* User info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 ${
                                isAdmin
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              }`}
                            >
                              {user.fullName.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                                <span>{user.fullName}</span>
                                {isAdmin && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-zinc-400 text-xs font-mono">
                                @{user.username}
                              </div>
                              {user.notes && (
                                <div className="text-[11px] text-zinc-400 italic truncate max-w-[180px]">
                                  {user.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Password */}
                        <td className="py-3 px-4 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-600 dark:text-zinc-300">
                              {isRevealed ? user.password : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordReveal(user.id)}
                              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                              title={isRevealed ? 'Hide' : 'Reveal'}
                            >
                              {isRevealed ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Level */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                            {user.level}
                          </span>
                        </td>

                        {/* Status (Clickable Toggle) */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            disabled={isAdmin}
                            onClick={() => handleToggleStatus(user)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                              user.isActive
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                            } ${isAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            {user.isActive ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-zinc-400" />
                                <span>Deactivated</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Progress */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                                <Zap className="w-3 h-3" /> {user.progress?.xp || 0} XP
                              </span>
                              <span className="inline-flex items-center gap-1 text-orange-500 font-semibold">
                                <Flame className="w-3 h-3" /> {user.progress?.streakDays || 0}d
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              {user.progress?.completedLessons?.length || 0} lessons •{' '}
                              {user.progress?.testScores?.length || 0} tests
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            {/* Reset Password */}
                            <button
                              type="button"
                              onClick={() => {
                                setResettingUser(user);
                                setNewResetPassword('');
                                setFormError('');
                              }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                              title="Reset Password"
                            >
                              <Key className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(user)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Edit user details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete (disabled for admin) */}
                            {!isAdmin && (
                              <button
                                type="button"
                                onClick={() => setDeletingUser(user)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CREATE NEW USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                  Create New Student Account
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Assign credentials so the student can access the ILMHUB platform
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. nodir_99"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ilmhub2026"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nodirbek Rahimov"
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="student@ilmhub.uz"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    English Level
                  </label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as EnglishLevel)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A1">A1 Beginner</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate</option>
                    <option value="B2">B2 Upper-Intermediate</option>
                    <option value="C1">C1 Advanced</option>
                    <option value="C2">C2 Proficiency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                  Admin Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Target goals, group batch, or instructor notes..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="create-active"
                  checked={newIsActive}
                  onChange={e => setNewIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="create-active" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Account is immediately Active and authorized to log in
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25"
                >
                  Save & Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 text-sm"
            >
              ✕
            </button>

            <div className="mb-4">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                Edit User: @{editingUser.username}
              </h3>
              <p className="text-xs text-zinc-500">Update student profile and level details</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={e => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Assigned Level</label>
                <select
                  value={editLevel}
                  onChange={e => setEditLevel(e.target.value as EnglishLevel)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A1">A1 Beginner</option>
                  <option value="A2">A2 Elementary</option>
                  <option value="B1">B1 Intermediate</option>
                  <option value="B2">B2 Upper-Intermediate</option>
                  <option value="C1">C1 Advanced</option>
                  <option value="C2">C2 Proficiency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Instructor Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={editIsActive}
                  disabled={editingUser.role === 'admin'}
                  onChange={e => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="edit-active" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Account Active (Uncheck to suspend access)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setResettingUser(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Reset Password
                </h3>
                <p className="text-xs text-zinc-500">For @{resettingUser.username}</p>
              </div>
            </div>

            {formError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter new password"
                  value={newResetPassword}
                  onChange={e => setNewResetPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const generated = 'pass_' + Math.random().toString(36).substring(2, 8);
                    setNewResetPassword(generated);
                  }}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Generate random password
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-500/25"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-center text-base text-zinc-900 dark:text-white mb-1">
              Delete Account?
            </h3>
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mb-5">
              Are you sure you want to permanently delete{' '}
              <strong className="text-zinc-900 dark:text-white">
                @{deletingUser.username}
              </strong>{' '}
              ({deletingUser.fullName})? All learning progress will be removed.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-500/20"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
