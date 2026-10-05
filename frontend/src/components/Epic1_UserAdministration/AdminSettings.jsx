/**
 * ====================================================================
 * AVENZA CLOTHING STORE - SYSTEM SETTINGS & CONFIGURATION
 * File: frontend/src/components/Epic1_UserAdministration/AdminSettings.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Administrator (System Superuser)
 * 
 * 🎯 EPIC: E1 - User and Administration Management
 *   Purpose: Allows system administrators to configure store parameters,
 *            currency, tax rates, shipping fee thresholds, low-stock alerts,
 *            and emergency maintenance mode schedules.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, DollarSign, Truck, AlertTriangle, Save, Bell, Power } from 'lucide-react';

export const AdminSettings = () => {
  const { systemSettings, updateSettings } = useApp();

  const [formData, setFormData] = useState({
    storeName: systemSettings.storeName || 'Avenza Clothing Store',
    storeEmail: systemSettings.storeEmail || 'support@avenza.com',
    storePhone: systemSettings.storePhone || '+94 11 234 5678',
    storeAddress: systemSettings.storeAddress || 'No. 100, Galle Road, Colombo 03, Sri Lanka',
    currency: systemSettings.currency || 'LKR (Rs.)',
    taxRate: systemSettings.taxRate || '8',
    freeShippingThreshold: systemSettings.freeShippingThreshold || '15000',
    lowStockThreshold: systemSettings.lowStockThreshold || '5',
    maintenanceMode: systemSettings.maintenanceMode ?? false,
    maintenanceNoticeTime: systemSettings.maintenanceNoticeTime || 'September 12, 2026 at 06:00 PM (SLST)',
    emailNotifications: systemSettings.emailNotifications ?? true
  });

  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [selectedHour, setSelectedHour] = useState('06:00');
  const [selectedPeriod, setSelectedPeriod] = useState('PM');
  const [selectedTz, setSelectedTz] = useState('(SLST)');

  // Dynamic DATE presets starting from Today (September 12, 2026) onwards (without time)
  const generateDatePresets = () => {
    const presets = [
      { label: 'Today (September 12, 2026)', dateISO: '2026-09-12' },
      { label: 'Tomorrow (September 13, 2026)', dateISO: '2026-09-13' }
    ];
    
    // Base Date: Sept 12, 2026
    const base = new Date(2026, 8, 12);
    for (let i = 2; i <= 10; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = d.toLocaleDateString('en-US', options);
      
      presets.push({
        label: `${formattedDate}`,
        dateISO: iso
      });
    }
    return presets;
  };

  const datePresetList = generateDatePresets();

  const formatNoticeString = (dateStr, hourStr, periodStr, tzStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    if (isNaN(dateObj.getTime())) return `${dateStr} at ${hourStr} ${periodStr} ${tzStr}`;
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    return `${formattedDate} at ${hourStr} ${periodStr} ${tzStr}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl card-theme shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Operations & Platform Governance</span>
          </div>
          <h2 className="text-2xl font-black">
            Basic System & Store Settings
          </h2>
          <p className="text-xs text-slate-500">Configure global parameters: LKR financial rules, tax rates, free shipping thresholds, low stock alerts, and maintenance mode</p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save System Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile Section */}
        <div className="p-6 sm:p-8 rounded-3xl card-theme shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <Settings className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg">General Store Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Store Display Name</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Support Email</label>
              <input
                type="email"
                required
                value={formData.storeEmail}
                onChange={e => setFormData({ ...formData, storeEmail: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Support Phone Hotline</label>
              <input
                type="text"
                required
                value={formData.storePhone}
                onChange={e => setFormData({ ...formData, storePhone: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Official Physical Address</label>
              <input
                type="text"
                required
                value={formData.storeAddress}
                onChange={e => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Financial & Order Calculations Section */}
        <div className="p-6 sm:p-8 rounded-3xl card-theme shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <DollarSign className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg">Financial & Checkout Calculation Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Base Currency</label>
              <input
                type="text"
                disabled
                value={formData.currency}
                className="w-full p-3 rounded-xl bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold text-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                required
                value={formData.taxRate}
                onChange={e => setFormData({ ...formData, taxRate: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Free Shipping Threshold (LKR)</label>
              <input
                type="number"
                step="500"
                min="0"
                required
                value={formData.freeShippingThreshold}
                onChange={e => setFormData({ ...formData, freeShippingThreshold: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono text-amber-500 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Warehouse Inventory Alerts Section */}
        <div className="p-6 sm:p-8 rounded-3xl card-theme shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg">Inventory Stock Alert Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Low Stock Alert Level (Units)</label>
              <input
                type="number"
                min="1"
                required
                value={formData.lowStockThreshold}
                onChange={e => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">Triggers low stock warning highlight on inventory and dashboard when stock falls below this level.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Order Email Notifications</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, emailNotifications: !formData.emailNotifications })}
                className={`w-full p-3 rounded-xl font-extrabold text-xs uppercase flex items-center justify-center gap-2 transition-colors ${
                  formData.emailNotifications 
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' 
                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-400 border border-slate-200 dark:border-zinc-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{formData.emailNotifications ? 'Notifications Enabled' : 'Notifications Disabled'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance & Emergency Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <Power className="w-5 h-5" />
            <h3 className="font-bold text-lg">System Maintenance Mode Control</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Storefront Maintenance Mode</p>
              <p className="text-[11px] text-slate-500">Enabling maintenance mode will restrict customer payment/checkout while product browsing and cart remain active.</p>
            </div>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase transition-colors shrink-0 ${
                formData.maintenanceMode 
                  ? 'bg-rose-500 text-white shadow-lg' 
                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
              }`}
            >
              {formData.maintenanceMode ? 'Maintenance ACTIVE' : 'Normal Operation'}
            </button>
          </div>

          <div className="pt-4 border-t border-rose-500/20 space-y-4">
            
            {/* Section 1: Re-opening Date Selection (Date Only) */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-rose-200 dark:border-rose-900/40">
              <label className="block text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                1. Select Re-opening Date Option (Date Only)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Quick Date Presets
                  </label>
                  <select
                    onChange={(e) => {
                      const newISO = e.target.value;
                      if (newISO) {
                        setSelectedDate(newISO);
                        const notice = formatNoticeString(newISO, selectedHour, selectedPeriod, selectedTz);
                        setFormData(prev => ({ ...prev, maintenanceNoticeTime: notice }));
                      }
                    }}
                    value={selectedDate}
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-900/50 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="">-- Choose Date Option --</option>
                    {datePresetList.map((preset, idx) => (
                      <option key={idx} value={preset.dateISO}>{preset.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Or Select Calendar Date
                  </label>
                  <input
                    type="date"
                    min="2026-09-12"
                    value={selectedDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setSelectedDate(newDate);
                      if (newDate) {
                        const notice = formatNoticeString(newDate, selectedHour, selectedPeriod, selectedTz);
                        setFormData(prev => ({ ...prev, maintenanceNoticeTime: notice }));
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-900/50 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Re-opening Time & Timezone Configuration (Separate Section) */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-rose-200 dark:border-rose-900/40">
              <label className="block text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                2. Configure Re-opening Time & Timezone (Separate Time Controls)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Select Re-opening Time (Hour & AM/PM)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedHour}
                      onChange={(e) => {
                        const newHour = e.target.value;
                        setSelectedHour(newHour);
                        const notice = formatNoticeString(selectedDate, newHour, selectedPeriod, selectedTz);
                        setFormData(prev => ({ ...prev, maintenanceNoticeTime: notice }));
                      }}
                      className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-900/50 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      {['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'].map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => {
                        const newPeriod = e.target.value;
                        setSelectedPeriod(newPeriod);
                        const notice = formatNoticeString(selectedDate, selectedHour, newPeriod, selectedTz);
                        setFormData(prev => ({ ...prev, maintenanceNoticeTime: notice }));
                      }}
                      className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-900/50 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Select Timezone Standard
                  </label>
                  <select
                    value={selectedTz}
                    onChange={(e) => {
                      const newTz = e.target.value;
                      setSelectedTz(newTz);
                      const notice = formatNoticeString(selectedDate, selectedHour, selectedPeriod, newTz);
                      setFormData(prev => ({ ...prev, maintenanceNoticeTime: notice }));
                    }}
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-900/50 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="(SLST)">(SLST) - Sri Lanka Standard Time</option>
                    <option value="(UTC)">(UTC) - Universal Coordinated Time</option>
                    <option value="(IST)">(IST) - India Standard Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Combined Notice Display Result */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase">Combined Notice Displayed to Customers:</span>
              <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30">
                {formData.maintenanceNoticeTime || 'No date/time selected'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
