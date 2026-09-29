/**
 * ====================================================================
 * AVENZA CLOTHING STORE - USER PROFILE & ACCOUNT DASHBOARD
 * File: frontend/src/components/Epic2_CustomerUser/UserProfile.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Logged-in User (Customer, Admin, Inventory Staff, Manager)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   User profile management view:
 *   1. Displays account holder details (Name, Email, Role badge, Phone, Address, City).
 *   2. Edit profile form with instant state update and toast confirmation.
 *   3. Quick account navigation shortcuts (My Orders, My Feedback, Wishlist).
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, MapPin, CreditCard, Shield, Check, Edit, Package } from 'lucide-react';

export const UserProfile = () => {
  const { user, updateUserProfile, setActiveTab, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: user?.name || 'Sasanka Perera',
    email: user?.email || 'customer@avenza.com',
    phone: user?.phone || '+94 77 123 4567',
    address: user?.address || 'No. 45, Flower Road, Colombo 07',
    city: user?.city || 'Colombo',
    postalCode: user?.postalCode || '00700'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img 
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
          alt={user?.name} 
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-amber-500/40"
        />
        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
              {user?.role} Account
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="text-xs text-slate-400">Member since August 2026</p>
        </div>

        <button
          onClick={() => setActiveTab(user?.role === 'admin' ? 'admin-orders' : 'orders')}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <Package className="w-4 h-4" />
          {user?.role === 'admin' ? 'Manage Customer Orders' : 'View My Orders'}
        </button>
      </div>

      {/* Details Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
            <p className="text-xs text-slate-500">Update your shipping address and contact details</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200"
          >
            <Edit className="w-3.5 h-3.5 text-amber-500" />
            {isEditing ? 'Cancel Edit' : 'Edit Info'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City / Region</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Default Shipping Address</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white disabled:opacity-75"
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
            >
              Save Profile Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
