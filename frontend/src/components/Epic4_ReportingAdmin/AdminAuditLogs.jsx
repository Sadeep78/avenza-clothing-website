/**
 * ====================================================================
 * AVENZA CLOTHING STORE - SYSTEM ACTIVITY LOGS & AUDIT TRAILS (AVE-16)
 * File: frontend/src/components/Epic4_ReportingAdmin/AdminAuditLogs.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Administrator (System Security & Operational Governance)
 * 
 * 🎯 USER STORY:
 *   - AVE-16: As an Administrator, I want to view system activity logs 
 *             and audit trails, so that administrative modifications, 
 *             role changes, and security events can be monitored and audited.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Clock, 
  UserCheck, 
  Key, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Activity,
  Lock
} from 'lucide-react';

export const AdminAuditLogs = () => {
  const { auditLogs = [], user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = "Timestamp,Category,Action,Target,Performed By,Severity,Details\n";
    filteredLogs.forEach(l => {
      csv += `"${l.timestamp}","${l.category}","${l.action}","${l.target}","${l.performedBy}","${l.severity}","${l.details}"\n`;
    });
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `avenza_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'SECURITY':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center gap-1 w-fit">
            <Lock className="w-3 h-3" /> Security
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Success
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-500/20 text-slate-400 border border-slate-500/30 flex items-center gap-1 w-fit">
            <Activity className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'IAM':
        return <UserCheck className="w-4 h-4 text-sky-500" />;
      case 'CREDENTIALS':
        return <Key className="w-4 h-4 text-amber-500" />;
      case 'SETTINGS':
        return <Settings className="w-4 h-4 text-purple-500" />;
      case 'MAINTENANCE':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl card-theme shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administration & System Governance</span>
          </div>
          <h2 className="text-2xl font-black">
            System Activity Logs & Security Audit Trails
          </h2>
          <p className="text-xs text-slate-500">
            Immutable audit record of user provisioning, role permission modifications, password resets, and system setting changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Print Audit Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Logged Events</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{auditLogs.length}</p>
        </div>

        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-sky-500 uppercase">IAM & Role Changes</span>
          <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
            {auditLogs.filter(l => l.category === 'IAM').length}
          </p>
        </div>

        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-500 uppercase">Credential Resets</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {auditLogs.filter(l => l.category === 'CREDENTIALS').length}
          </p>
        </div>

        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-purple-500 uppercase">System Configs</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {auditLogs.filter(l => l.category === 'SETTINGS' || l.category === 'MAINTENANCE').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, target, admin, or detail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold cursor-pointer"
          >
            <option value="all">All Audit Categories</option>
            <option value="IAM">Identity & Role Management (IAM)</option>
            <option value="CREDENTIALS">Password & Credential Recovery</option>
            <option value="SETTINGS">Store Configuration & Settings</option>
            <option value="MAINTENANCE">Maintenance Mode & Downtime</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl card-theme border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-zinc-900/80 border-b border-slate-200 dark:border-zinc-800 font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Category & Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No matching audit log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition">
                    <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.category)}
                        <div>
                          <span className="font-black text-slate-900 dark:text-white block">{log.action}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{log.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-700 dark:text-zinc-300">
                        {log.target}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-600 dark:text-zinc-300">
                        <span className="font-bold block">{log.performedBy}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.ipAddress || '192.168.1.100'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
