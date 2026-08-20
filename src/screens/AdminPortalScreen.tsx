import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Lock, 
  Unlock, 
  Sparkles, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  Key, 
  GraduationCap, 
  ArrowRight,
  Eye,
  ShieldAlert,
  Sliders,
  MoreVertical,
  X,
  Save,
  Check
} from 'lucide-react';
import { UserProfile, AdminLog } from '../types';
import { defaultUsers, initialAdminLogs } from '../data/userData';

interface AdminPortalScreenProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  onUpdateUsersList: (users: UserProfile[]) => void;
  onImpersonateUser: (user: UserProfile) => void;
  onExitAdmin: () => void;
}

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({
  currentUser,
  usersList,
  onUpdateUsersList,
  onImpersonateUser,
  onExitAdmin,
}) => {
  // Admin Gate State (Single person authorized access)
  const isMasterAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@saregama.com';
  const [adminPasskey, setAdminPasskey] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(isMasterAdmin);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'pro' | 'student' | 'suspended'>('all');

  // Logs & Notifications
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(initialAdminLogs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  // Add User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPlan, setNewUserPlan] = useState('Student 4-Year Pass');
  const [newUserStorageMB, setNewUserStorageMB] = useState(32000);
  const [newUserIsPro, setNewUserIsPro] = useState(true);
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized Master Passcode for the single supervisor person
    if (adminPasskey === 'admin2026' || adminPasskey === '7788' || adminPasskey === 'saregama#admin') {
      setIsAdminUnlocked(true);
      setPasskeyError(null);
      showToast('Admin supervisor credentials verified. Welcome Master Admin.');
    } else {
      setPasskeyError('Invalid Master Admin passkey. Authorized supervisor only.');
    }
  };

  const logAdminAction = (action: string, target: string, details: string, type: AdminLog['type']) => {
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      adminName: currentUser.name || 'Admin Supervisor',
      targetUser: target,
      details,
      type
    };
    setAdminLogs([newLog, ...adminLogs]);
  };

  // Add User
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const createdUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEbPVyOIRZNcFei-hKUELpm2V6OTGQAlBCQM2DY2UbAUGjVnUwmrzIJSO0kd7B7EvxhOUym8ww0nePBnZu0406Bsl9K78dy_DKbQBDJDxGYfp1zUWdb1DO_JmCoKpX5RQBp9NX4vO_DVQf2SAFGJOL4KiEnY84Gl5mKTVE72uv_T6SCS7Je5sg4UfUy8tD_H6VGKa2D8p0sr-CX02mbad4IO6eZdthbuEOSvne-TVolo2APTtZmfbF',
      isPro: newUserIsPro,
      planName: newUserPlan,
      role: newUserRole,
      status: 'active',
      offlineStorageUsedMB: 0,
      maxStorageMB: newUserStorageMB,
      audioQuality: newUserIsPro ? 'Hi-Res Lossless (FLAC)' : 'High (320kbps)',
      downloadOnlyOnWifi: true,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      isStudentVerified: newUserPlan.toLowerCase().includes('student')
    };

    const updated = [createdUser, ...usersList];
    onUpdateUsersList(updated);
    logAdminAction('User Provisioned', createdUser.name, `Created account with plan ${createdUser.planName}`, 'user_add');
    showToast(`New user "${createdUser.name}" successfully added to Saregama.`);
    
    // Reset Form
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserOpen(false);
  };

  // Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = usersList.map((u) => (u.id === editingUser.id ? editingUser : u));
    onUpdateUsersList(updated);
    logAdminAction('Profile Modified', editingUser.name, `Updated details & plan to ${editingUser.planName}`, 'user_edit');
    showToast(`User details for ${editingUser.name} updated.`);
    setEditingUser(null);
  };

  // Toggle Suspend / Ban
  const handleToggleSuspend = (user: UserProfile) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const updated = usersList.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u));
    onUpdateUsersList(updated);
    logAdminAction(
      newStatus === 'suspended' ? 'User Suspended' : 'User Re-activated',
      user.name,
      `Changed account status to ${newStatus}`,
      'user_edit'
    );
    showToast(`User ${user.name} is now ${newStatus}.`);
  };

  // Toggle Pro
  const handleTogglePro = (user: UserProfile) => {
    const newPro = !user.isPro;
    const newPlan = newPro ? 'Pro Annual (Lossless Music)' : 'Free Tier';
    const newStorage = newPro ? 64000 : 8000;
    const updated = usersList.map((u) => 
      u.id === user.id 
        ? { ...u, isPro: newPro, planName: newPlan, maxStorageMB: newStorage } 
        : u
    );
    onUpdateUsersList(updated);
    logAdminAction(
      newPro ? 'Pro Upgraded' : 'Pro Downgraded',
      user.name,
      `Updated plan to ${newPlan}`,
      'plan_change'
    );
    showToast(`${user.name} membership changed to ${newPlan}.`);
  };

  // Delete User
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const updated = usersList.filter((u) => u.id !== userToDelete.id);
    onUpdateUsersList(updated);
    logAdminAction('User Deleted', userToDelete.name, `Removed user account from system`, 'user_delete');
    showToast(`User ${userToDelete.name} has been removed.`);
    setUserToDelete(null);
  };

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.planName.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterRole === 'pro') return u.isPro;
    if (filterRole === 'student') return u.isStudentVerified;
    if (filterRole === 'suspended') return u.status === 'suspended';
    return true;
  });

  // Aggregated Stats
  const totalUsersCount = usersList.length;
  const proUsersCount = usersList.filter((u) => u.isPro).length;
  const suspendedCount = usersList.filter((u) => u.status === 'suspended').length;
  const totalAllocatedStorageGB = Math.round(usersList.reduce((acc, u) => acc + u.maxStorageMB, 0) / 1024);

  // If Gate is Locked, show single-person Admin Passkey Verification
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-[#141c00] border border-[#ffb700]/40 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-[#ffb700]/10 border border-[#ffb700] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShieldAlert size={32} className="text-[#ffb700]" />
          </div>

          <h2 className="font-serif-heading font-extrabold text-2xl text-white">
            Restricted Admin Portal
          </h2>
          <p className="text-xs text-[#92b900] mt-2 mb-6">
            This management console is restricted exclusively to the single authorized supervisor to manage Saregama users.
          </p>

          <form onSubmit={handleUnlockAdmin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
                Master Admin Passkey
              </label>
              <div className="relative">
                <Key size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
                <input
                  id="admin-passkey-input"
                  type="password"
                  required
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  placeholder="Enter master passkey (e.g. admin2026 or 7788)"
                  className="w-full bg-[#0a1000] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-[#cafd1e] outline-none focus:border-[#ffb700] focus:ring-1 focus:ring-[#ffb700]"
                />
              </div>
            </div>

            {passkeyError && (
              <div className="p-3 bg-[#3a0d0d] border border-[#ff5b5b]/50 rounded-xl text-xs text-[#ff9999]">
                {passkeyError}
              </div>
            )}

            <button
              type="submit"
              id="admin-unlock-btn"
              className="w-full bg-[#ffb700] hover:bg-[#ffc83b] text-[#332200] font-bold text-sm rounded-xl py-3.5 transition-all shadow-lg hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              <Unlock size={17} />
              <span>Authenticate as Supervisor</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onExitAdmin}
                className="text-xs text-[#92b900] hover:text-white"
              >
                ← Return to Music Home
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 p-4 bg-[#003828] border border-[#00fde7]/50 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm text-[#00fde7] animate-fade-in-up">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Action Header */}
      <section className="bg-gradient-to-r from-[#1f1900] via-[#141c00] to-[#0a1000] border border-[#ffb700]/30 rounded-3xl p-6 sm:p-8 relative shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0a1000] border border-[#ffb700]/40 px-3.5 py-1 rounded-full text-xs font-bold text-[#ffb700] mb-2.5">
              <ShieldCheck size={14} />
              <span>Master Supervisor Authority Active</span>
            </div>
            <h1 className="font-serif-heading font-extrabold text-2xl sm:text-3xl text-white">
              Saregama User Management & Security Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#92b900] mt-1 max-w-2xl">
              Control and manage all new and existing users, grant student music passes, adjust offline storage quotas, and monitor live streaming status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-add-user-btn"
              onClick={() => setIsAddUserOpen(true)}
              className="bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-[#00fde7]/20 hover:scale-105 active:scale-95"
            >
              <UserPlus size={16} />
              <span>Add New User</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors"
            >
              Exit Portal
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 bg-[#0a1000]/80 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-[#92b900] uppercase">Total Users</div>
            <div className="text-2xl font-serif-heading font-bold text-white mt-1">{totalUsersCount}</div>
            <div className="text-[10px] text-[#00fde7] mt-0.5">New & Registered</div>
          </div>

          <div className="p-3.5 bg-[#0a1000]/80 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-[#92b900] uppercase">Pro Subscribers</div>
            <div className="text-2xl font-serif-heading font-bold text-[#00fde7] mt-1">{proUsersCount}</div>
            <div className="text-[10px] text-[#cafd1e] mt-0.5">Student & Annual</div>
          </div>

          <div className="p-3.5 bg-[#0a1000]/80 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-[#92b900] uppercase">Offline Storage Quota</div>
            <div className="text-2xl font-serif-heading font-bold text-[#ffb700] mt-1">{totalAllocatedStorageGB} GB</div>
            <div className="text-[10px] text-[#92b900] mt-0.5">Lossless Cached Pool</div>
          </div>

          <div className="p-3.5 bg-[#0a1000]/80 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-[#92b900] uppercase">Suspended / Flagged</div>
            <div className="text-2xl font-serif-heading font-bold text-[#ff5b5b] mt-1">{suspendedCount}</div>
            <div className="text-[10px] text-[#92b900] mt-0.5">Scraping / Banned</div>
          </div>
        </div>
      </section>

      {/* User Management Section */}
      <section className="bg-[#141c00] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif-heading font-bold text-xl text-white flex items-center gap-2">
              <Users size={20} className="text-[#00fde7]" />
              <span>Registered Users Directory ({filteredUsers.length})</span>
            </h2>
            <p className="text-xs text-[#92b900] mt-0.5">
              Inspect user activity, adjust plans, or impersonate sessions for live testing.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92b900]" />
              <input
                type="text"
                id="admin-search-users-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full sm:w-64 bg-[#0a1000] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-[#0a1000] p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterRole === 'all' ? 'bg-[#00fde7] text-[#00443d]' : 'text-[#92b900] hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRole('pro')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterRole === 'pro' ? 'bg-[#00fde7] text-[#00443d]' : 'text-[#92b900] hover:text-white'
                }`}
              >
                Pro
              </button>
              <button
                onClick={() => setFilterRole('student')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterRole === 'student' ? 'bg-[#00fde7] text-[#00443d]' : 'text-[#92b900] hover:text-white'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setFilterRole('suspended')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterRole === 'suspended' ? 'bg-[#ff5b5b] text-white' : 'text-[#92b900] hover:text-white'
                }`}
              >
                Suspended
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/5">
          <table className="w-full text-left text-xs text-[#cafd1e]">
            <thead className="bg-[#0a1000] text-[11px] text-[#92b900] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role & Status</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Storage Allocation</th>
                <th className="py-3 px-4">Joined / Active</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#141c00]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* User Profile Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.isStudentVerified && (
                            <GraduationCap size={13} className="text-[#00fde7]" title="Verified Student" />
                          )}
                        </div>
                        <div className="text-[11px] text-[#92b900] truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.role === 'admin'
                          ? 'bg-[#ffb700]/20 text-[#ffb700] border border-[#ffb700]/40'
                          : 'bg-[#1f2a00] text-[#00fde7]'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.status === 'active'
                          ? 'text-[#00fde7]'
                          : user.status === 'suspended'
                          ? 'text-[#ff5b5b] bg-[#3a0d0d]'
                          : 'text-[#ffb700]'
                      }`}>
                        • {user.status}
                      </span>
                    </div>
                  </td>

                  {/* Plan Tier */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{user.planName}</div>
                    <div className="text-[10px] text-[#92b900]">{user.audioQuality}</div>
                  </td>

                  {/* Offline Storage */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <HardDrive size={14} className="text-[#92b900]" />
                      <span className="font-mono text-white">
                        {Math.round(user.offlineStorageUsedMB)} MB / {(user.maxStorageMB / 1000).toFixed(0)} GB
                      </span>
                    </div>
                    <div className="w-28 h-1.5 bg-[#0a1000] rounded-full overflow-hidden mt-1 border border-white/5">
                      <div
                        className="h-full bg-[#00fde7]"
                        style={{ width: `${Math.min(100, (user.offlineStorageUsedMB / (user.maxStorageMB || 1)) * 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Joined / Last Active */}
                  <td className="py-3.5 px-4 text-[11px] text-[#92b900]">
                    <div>Joined: {user.joinedDate}</div>
                    <div className="text-white/80">{user.lastActive}</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Impersonate / Login as */}
                      <button
                        id={`admin-impersonate-${user.id}`}
                        onClick={() => onImpersonateUser(user)}
                        title="Impersonate / Switch Session to this User"
                        className="p-1.5 bg-[#192300] hover:bg-[#233000] text-[#00fde7] rounded-lg border border-white/5 hover:border-[#00fde7]/40 transition-colors"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Toggle Pro */}
                      <button
                        onClick={() => handleTogglePro(user)}
                        title={user.isPro ? 'Downgrade to Free' : 'Grant Pro Pass'}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          user.isPro
                            ? 'bg-[#192300] text-[#00fde7] border-[#00fde7]/30'
                            : 'bg-[#0a1000] text-[#92b900] border-white/5 hover:text-white'
                        }`}
                      >
                        <Sparkles size={15} />
                      </button>

                      {/* Edit User */}
                      <button
                        onClick={() => setEditingUser(user)}
                        title="Edit User Profile"
                        className="p-1.5 bg-[#192300] hover:bg-[#233000] text-[#cafd1e] rounded-lg border border-white/5 hover:border-white/20 transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* Suspend / Ban */}
                      <button
                        onClick={() => handleToggleSuspend(user)}
                        title={user.status === 'suspended' ? 'Unsuspend Account' : 'Suspend / Ban Account'}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          user.status === 'suspended'
                            ? 'bg-[#3a0d0d] text-[#ff5b5b] border-[#ff5b5b]/40'
                            : 'bg-[#192300] text-[#92b900] hover:text-[#ff5b5b] border-white/5'
                        }`}
                      >
                        {user.status === 'suspended' ? <Unlock size={15} /> : <Lock size={15} />}
                      </button>

                      {/* Delete */}
                      {user.email !== 'admin@saregama.com' && (
                        <button
                          onClick={() => setUserToDelete(user)}
                          title="Delete User"
                          className="p-1.5 bg-[#3a0d0d]/40 hover:bg-[#3a0d0d] text-[#ff9999] rounded-lg border border-transparent hover:border-[#ff5b5b]/40 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Admin Audit Logs Stream */}
      <section className="bg-[#141c00] border border-white/10 rounded-3xl p-6 sm:p-8">
        <h3 className="font-serif-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Activity size={18} className="text-[#00fde7]" />
          <span>Master Supervisor Audit Trail & System Events</span>
        </h3>

        <div className="space-y-2.5">
          {(adminLogs || []).slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-[#0a1000] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  log.type === 'plan_change' ? 'bg-[#00fde7]' : log.type === 'user_add' ? 'bg-[#cafd1e]' : 'bg-[#ffb700]'
                }`} />
                <div>
                  <span className="font-bold text-white mr-2">{log.action}:</span>
                  <span className="text-[#cafd1e]">{log.targetUser}</span>
                  <span className="text-[#92b900] ml-2 font-normal">— {log.details}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#92b900] sm:text-right shrink-0">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: ADD NEW USER */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141c00] border border-[#00fde7]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-serif-heading font-bold text-xl text-[#00fde7] flex items-center gap-2">
                <UserPlus size={20} />
                <span>Provision New User</span>
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-[#92b900] hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Meera Joshi"
                  className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="meera.joshi@university.edu"
                  className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                    Plan
                  </label>
                  <select
                    value={newUserPlan}
                    onChange={(e) => setNewUserPlan(e.target.value)}
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                  >
                    <option value="Student 4-Year Pass">Student 4-Year Pass</option>
                    <option value="Pro Annual (Lossless Music)">Pro Annual Pass</option>
                    <option value="Lifetime Pass">Lifetime VIP</option>
                    <option value="Free Tier">Free Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                    Offline Storage Quota
                  </label>
                  <select
                    value={newUserStorageMB}
                    onChange={(e) => setNewUserStorageMB(Number(e.target.value))}
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                  >
                    <option value={8000}>8 GB (Basic)</option>
                    <option value={32000}>32 GB (Student)</option>
                    <option value={64000}>64 GB (Pro)</option>
                    <option value={128000}>128 GB (Max)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                    Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'user' | 'admin')}
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Admin Supervisor</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#cafd1e]">
                    <input
                      type="checkbox"
                      checked={newUserIsPro}
                      onChange={(e) => setNewUserIsPro(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#0a1000] text-[#00fde7] accent-[#00fde7]"
                    />
                    <span>Grant Pro Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-[#cafd1e] py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141c00] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-serif-heading font-bold text-xl text-[#00fde7]">
                Edit User: {editingUser.name}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-[#92b900] hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                    Plan
                  </label>
                  <input
                    type="text"
                    value={editingUser.planName}
                    onChange={(e) => setEditingUser({ ...editingUser, planName: e.target.value })}
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cafd1e] mb-1">
                    Storage Limit (MB)
                  </label>
                  <input
                    type="number"
                    value={editingUser.maxStorageMB}
                    onChange={(e) => setEditingUser({ ...editingUser, maxStorageMB: Number(e.target.value) })}
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-[#cafd1e] py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Save size={15} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141c00] border border-[#ff5b5b]/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif-heading font-bold text-xl text-[#ff5b5b] mb-2">
              Confirm Delete User
            </h3>
            <p className="text-xs text-[#92b900] mb-5 leading-relaxed">
              Are you sure you want to permanently delete account for <strong className="text-white">{userToDelete.name}</strong> ({userToDelete.email})? This action cannot be undone.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-[#cafd1e] py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-[#ff5b5b] hover:bg-[#ff7a7a] text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
