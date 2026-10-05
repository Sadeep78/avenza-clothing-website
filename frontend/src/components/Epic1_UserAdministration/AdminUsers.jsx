/**
 * ====================================================================
 * AVENZA CLOTHING STORE - ADMIN USER & ROLE MANAGEMENT
 * File: frontend/src/components/Epic1_UserAdministration/AdminUsers.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Administrator (System Admin User Administration)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   User management console for administrators:
 *   1. Create user account modal (Name, Email, Password, Role, Status, Phone, City).
 *   2. Edit user role & details modal (`customer`, `inventory_staff`, `manager`, `admin`).
 *   3. Filter users by role and search by name/email.
 *   4. Delete user account.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Edit, Trash2, ShieldCheck, Search, Check, X, Shield, Lock, AlertCircle, Key, RefreshCw } from 'lucide-react';

export const AdminUsers = () => {
  const { usersList, addUser, updateUser, deleteUser, resetUserPassword } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordResetUser, setPasswordResetUser] = useState(null);
  const [tempPassword, setTempPassword] = useState('Avenza#2026!');
  const [forceChangeNextLogin, setForceChangeNextLogin] = useState(true);

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'customer',
    status: 'active',
    phone: '',
    address: '',
    city: 'Colombo'
  });

  const filteredUsers = usersList.filter(u => {
    const matchesQuery = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    addUser({
      name: newUserData.name,
      email: newUserData.email,
      username: newUserData.email.split('@')[0],
      password: newUserData.password || 'password123',
      role: newUserData.role,
      status: newUserData.status,
      phone: newUserData.phone || '+94 77 000 0000',
      address: newUserData.address || 'Sri Lanka',
      city: newUserData.city || 'Colombo'
    });

    setIsAddModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      password: 'password123',
      role: 'customer',
      status: 'active',
      phone: '',
      address: '',
      city: 'Colombo'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      status: editingUser.status,
      phone: editingUser.phone,
      address: editingUser.address,
      city: editingUser.city
    });

    setEditingUser(null);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3" /> Administrator
          </span>
        );
      case 'manager':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-500 border border-purple-500/30 flex items-center gap-1 w-fit">
            <Shield className="w-3 h-3" /> Store Manager
          </span>
        );
      case 'inventory_staff':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-500 border border-sky-500/30 flex items-center gap-1 w-fit">
            <Shield className="w-3 h-3" /> Inventory Staff
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 w-fit">
            Customer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl card-theme shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>User Accounts & Role Permissions Management</span>
          </div>
          <h2 className="text-2xl font-black">
            System User Management & Role Assignment
          </h2>
          <p className="text-xs text-slate-500">Create new user accounts, update customer details, and manage roles (Customer, Inventory Staff, Administrator)</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Create New User Account
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'customer', 'inventory_staff', 'manager', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer ${
                roleFilter === r 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800'
              }`}
            >
              {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl card-theme shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">User Account</th>
                <th className="py-4 px-4">Role Assignment</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4 text-center">Account Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs">{u.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {getRoleBadge(u.role)}
                  </td>

                  <td className="py-4 px-4 text-xs font-mono text-slate-600 dark:text-zinc-400">
                    {u.phone || 'N/A'}
                  </td>

                  <td className="py-4 px-4 text-xs text-slate-600 dark:text-zinc-400">
                    {u.city || 'Colombo'}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      u.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                    }`}>
                      {u.status || 'active'}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setPasswordResetUser(u);
                          setTempPassword(`Avenza#${Math.floor(1000 + Math.random() * 9000)}!`);
                        }}
                        className="p-2 rounded-xl text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
                        title="Trigger Password Reset"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                        title="Edit User Details & Role"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Deactivate / Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isAddModalOpen && (
        <div 
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-xl font-bold">Create New User Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nimal Perera"
                  value={newUserData.name}
                  onChange={e => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="nimal@avenza.com"
                    value={newUserData.email}
                    onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newUserData.password}
                    onChange={e => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Role Assignment</label>
                  <select
                    value={newUserData.role}
                    onChange={e => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-bold text-amber-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="inventory_staff">Inventory Staff</option>
                    <option value="manager">Store Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+94 77 123 4567"
                    value={newUserData.phone}
                    onChange={e => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-zinc-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER & ROLE MODAL */}
      {editingUser && (
        <div 
          onClick={() => setEditingUser(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-xl font-bold">Edit User Details & Role</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-500 mb-1">Role Assignment</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-sm font-black text-amber-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="inventory_staff">Inventory Staff</option>
                    <option value="manager">Store Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Account Status</label>
                  <select
                    value={editingUser.status || 'active'}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Shipping Address</label>
                <input
                  type="text"
                  value={editingUser.address || ''}
                  onChange={e => setEditingUser({ ...editingUser, address: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-zinc-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase cursor-pointer"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD RESET & CREDENTIAL POLICY MODAL (AVE-14) */}
      {passwordResetUser && (
        <div 
          onClick={() => setPasswordResetUser(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-5 shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-sky-500 font-bold text-xs uppercase">
                <Key className="w-4 h-4" />
                <span>Credential Security</span>
              </div>
              <button onClick={() => setPasswordResetUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black">Reset User Credentials</h3>
              <p className="text-xs text-slate-500">
                Trigger an administrative password reset for <strong className="text-slate-900 dark:text-white font-bold">{passwordResetUser.name}</strong> ({passwordResetUser.email}).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-600 dark:text-sky-400 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Enforced Security Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                Temporary passwords must contain uppercase, digits, and special characters. Users can be forced to rotate credentials upon next session authentication.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-500">
                Temporary Password
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => setTempPassword(`Avenza#${Math.floor(1000 + Math.random() * 9000)}!`)}
                  className="px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Generate Random Password"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Random</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="forceChange"
                checked={forceChangeNextLogin}
                onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
              />
              <label htmlFor="forceChange" className="text-xs text-slate-600 dark:text-zinc-300 font-medium cursor-pointer">
                Force user to change password upon next login
              </label>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPasswordResetUser(null)}
                className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-bold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetUserPassword(passwordResetUser.id, tempPassword);
                  setPasswordResetUser(null);
                }}
                className="flex-1 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs uppercase shadow-lg shadow-sky-500/20 transition cursor-pointer"
              >
                Apply Password Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
