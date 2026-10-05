/**
 * ====================================================================
 * AVENZA CLOTHING STORE - EXECUTIVE ADMIN ANALYTICS DASHBOARD
 * File: frontend/src/components/Epic1_UserAdministration/AdminDashboard.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Administrator / Store Manager (Store Performance & Revenue Analytics)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Analytics console displaying real-time store metrics:
 *   1. Key metric KPI cards (Total Sales Revenue in LKR, Total Orders, Active Catalog Items).
 *   2. Low-stock inventory alert banners (items with stock <= 5).
 *   3. Sales breakdown charts (Men's, Women's, Outerwear, Kids revenue distribution).
 *   4. Quick navigation shortcuts to inventory management, user control, and order fulfillment.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  BarChart2, 
  PieChart, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Filter,
  Printer,
  Download,
  FileText,
  Clock,
  Eye,
  MessageSquare
} from 'lucide-react';
import { SALES_SUMMARY } from '../../data/mockData';

export const AdminDashboard = () => {
  const { products, orders, setActiveTab, formatLKR, showToast, user, feedbacks } = useApp();

  // Date Filter State: 'today' | 'week' | 'month' | 'year' | 'specific' | 'all'
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('2026-09-12');
  const [customEndDate, setCustomEndDate] = useState('');

  // Get current date references (Simulation fixed to 2026-09-12)
  const todayStr = '2026-09-12';
  const todayDateObj = new Date(todayStr);

  // Filter orders based on active date range
  const filteredOrders = orders.filter(order => {
    if (!order.date) return dateFilter === 'all';
    const orderDateObj = new Date(order.date);
    const diffTime = todayDateObj.getTime() - orderDateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    if (dateFilter === 'today') {
      return order.date === todayStr;
    }
    if (dateFilter === 'week') {
      return diffDays >= 0 && diffDays <= 7;
    }
    if (dateFilter === 'month') {
      return order.date.startsWith('2026-09');
    }
    if (dateFilter === 'year') {
      return order.date.startsWith('2026');
    }
    if (dateFilter === 'specific') {
      if (customEndDate) {
        return order.date >= customDate && order.date <= customEndDate;
      }
      return order.date === customDate;
    }
    return true; // 'all'
  });

  // Calculate filtered sales KPIs
  const periodRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDisplayRevenue = dateFilter === 'all' 
    ? periodRevenue + SALES_SUMMARY.totalRevenue 
    : periodRevenue;

  const totalDisplayOrdersCount = dateFilter === 'all'
    ? filteredOrders.length + 140
    : filteredOrders.length;

  const lowStockItems = products.filter(p => p.stock <= 5);

  // Category sales breakdown from filtered orders
  const categoryTotals = filteredOrders.reduce((acc, order) => {
    (order.items || []).forEach(item => {
      const cat = (item.category || 'clothing').toLowerCase();
      let key = 'women';
      if (cat.includes('men') && !cat.includes('women')) key = 'men';
      else if (cat.includes('outerwear') || cat.includes('jacket') || cat.includes('coat')) key = 'outerwear';
      else if (cat.includes('kid') || cat.includes('youth')) key = 'kids';

      acc[key] = (acc[key] || 0) + (item.price * (item.quantity || 1));
    });
    return acc;
  }, { women: 0, men: 0, outerwear: 0, kids: 0 });

  const totalCategoryRevenue = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Order ID,Customer Name,Date,Status,Total Amount (LKR)\n";
    filteredOrders.forEach(o => {
      csvContent += `${o.id},"${o.customerName}",${o.date},${o.status},${o.totalAmount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `avenza_sales_report_${dateFilter}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales report exported to CSV successfully!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>AVENZA Store Management & Operations</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">{user?.role === 'manager' ? 'Store Manager Dashboard' : 'Executive Admin Dashboard'}</h2>
          <p className="text-xs text-slate-400 mt-1">
            {user?.role === 'manager' 
              ? 'Real-time apparel sales analytics, order fulfillment dispatch & customer feedback care' 
              : 'Real-time store performance, revenue analytics & system oversight'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('admin-orders')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5"
            title="Dispatch orders & courier tracking"
          >
            Delivery & Dispatch
          </button>
          <button
            onClick={() => setActiveTab('admin-feedback')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Moderate customer reviews & replies"
          >
            Feedback Moderation
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print sales summary"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* DATE FILTERING TOOLBAR (AVE-17) */}
      <div className="p-5 sm:p-6 rounded-3xl card-theme shadow-sm border border-slate-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span>Filter Sales Performance Reports by Period</span>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Active Range: <strong className="text-amber-500 font-bold uppercase">{dateFilter === 'specific' ? customDate : dateFilter}</strong> ({filteredOrders.length} orders matched)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today (Sep 12)' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month (Sep 2026)' },
            { id: 'year', label: 'This Year (2026)' },
            { id: 'specific', label: 'Specific Date / Range' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setDateFilter(btn.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer ${
                dateFilter === btn.id
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Custom Specific Date / Range Inputs */}
        {dateFilter === 'specific' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-zinc-300">Select Date:</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-zinc-300">End Date (Optional Range):</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            {customEndDate && (
              <button
                onClick={() => setCustomEndDate('')}
                className="text-xs font-bold text-rose-500 underline cursor-pointer"
              >
                Clear End Date
              </button>
            )}
          </div>
        )}
      </div>

      {/* KPI Cards Row in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Revenue */}
        <div className="p-6 rounded-3xl card-theme shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-400">Total Revenue (LKR)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-amber-500">
            {formatLKR(totalDisplayRevenue)}
          </p>
          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Selected Period ({dateFilter.toUpperCase()})
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl card-theme shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-400">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono">
            {totalDisplayOrdersCount}
          </p>
          <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {filteredOrders.length} placed in this filter
          </span>
        </div>

        {/* Active Customers */}
        <div className="p-6 rounded-3xl card-theme shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-400">Active Customers</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono">
            {Math.max(1, filteredOrders.length)}
          </p>
          <span className="text-[11px] font-bold text-sky-500 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Unique customer activity
          </span>
        </div>

        {/* Fourth KPI Card: Customer Feedback for Manager, Stock Alerts for Admin/Staff */}
        {user?.role === 'manager' ? (
          <div 
            onClick={() => setActiveTab('admin-feedback')}
            className="p-6 rounded-3xl card-theme shadow-sm space-y-2 cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Customer Feedback</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black font-mono">
              {(feedbacks || []).length} Reviews
            </p>
            <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Customer Care & Moderation
            </span>
          </div>
        ) : (
          <div className="p-6 rounded-3xl card-theme shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Stock Alerts</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black font-mono">
              {lowStockItems.length} Items
            </p>
            <span className="text-[11px] font-bold text-rose-500">
              Action required in inventory
            </span>
          </div>
        )}
      </div>

      {/* Monthly Revenue Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl card-theme shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-amber-500" />
                Monthly Revenue Growth (LKR)
              </h3>
              <p className="text-xs text-slate-400">2026 Sales breakdown in Sri Lankan Rupees</p>
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
              Q3 Growth +24.5%
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-zinc-800">
            {SALES_SUMMARY.monthlyRevenueData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Rs.{(data.revenue / 1000).toFixed(0)}k
                </span>
                <div 
                  className="w-full rounded-t-xl bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300 shadow-md"
                  style={{ height: `${(data.revenue / 800000) * 100}%` }}
                />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clothes Line Category Breakdown */}
        <div className="p-6 rounded-3xl card-theme shadow-sm space-y-4">
          <h3 className="font-extrabold flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-500" />
            Category Performance ({dateFilter.toUpperCase()})
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Women's Apparel</span>
                <span className="text-amber-500 font-mono">
                  {formatLKR(categoryTotals.women || (dateFilter === 'all' ? 820000 : 0))} ({Math.round(((categoryTotals.women || 42) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, Math.max(10, ((categoryTotals.women || 42) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100))}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Men's Apparel</span>
                <span className="text-amber-500 font-mono">
                  {formatLKR(categoryTotals.men || (dateFilter === 'all' ? 540000 : 0))} ({Math.round(((categoryTotals.men || 28) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, Math.max(10, ((categoryTotals.men || 28) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100))}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Coats & Outerwear</span>
                <span className="text-amber-500 font-mono">
                  {formatLKR(categoryTotals.outerwear || (dateFilter === 'all' ? 350000 : 0))} ({Math.round(((categoryTotals.outerwear || 18) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600" style={{ width: `${Math.min(100, Math.max(10, ((categoryTotals.outerwear || 18) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100))}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Kids & Youth</span>
                <span className="text-amber-500 font-mono">
                  {formatLKR(categoryTotals.kids || (dateFilter === 'all' ? 210000 : 0))} ({Math.round(((categoryTotals.kids || 12) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-700" style={{ width: `${Math.min(100, Math.max(10, ((categoryTotals.kids || 12) / (dateFilter === 'all' ? 100 : totalCategoryRevenue)) * 100))}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERED SALES TRANSACTIONS TABLE */}
      <div className="p-6 rounded-3xl card-theme shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Sales Transactions Report ({dateFilter.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400">Detailed itemized transaction history for the selected date range</p>
          </div>

          <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
            Period Total: {formatLKR(periodRevenue)}
          </span>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Total (LKR)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-500">{o.id}</td>
                    <td className="py-3 px-4 font-bold">{o.customerName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{o.date}</td>
                    <td className="py-3 px-4 font-bold">{o.items ? o.items.length : 1} garments</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        o.status === 'Delivered' 
                          ? 'bg-emerald-500/20 text-emerald-500' 
                          : o.status === 'Shipped' 
                          ? 'bg-sky-500/20 text-sky-500' 
                          : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                      {formatLKR(o.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveTab('admin-orders')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-[11px] flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 space-y-2 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold">No sales transactions recorded for this selected date filter</p>
            <button
              onClick={() => setDateFilter('all')}
              className="text-xs font-bold text-amber-500 underline cursor-pointer"
            >
              Reset to All Time
            </button>
          </div>
        )}
      </div>

      {/* INVENTORY STOCK & HEALTH MONITORING REPORT (Only for Admin & Inventory Staff - Removed from Manager) */}
      {user?.role !== 'manager' && (
        <div className="p-6 rounded-3xl card-theme shadow-sm space-y-5 border border-slate-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Inventory Stock & Health Monitoring Report
            </h3>
            <p className="text-xs text-slate-400">Executive inventory stock level audit to monitor warehouse valuation and identify apparel lines needing attention</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              Total Stock Valuation: {formatLKR(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
            </span>
          </div>
        </div>

        {/* Stock Status Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-emerald-500 uppercase">Healthy Stock Items</span>
              <p className="text-xl font-black">{products.filter(p => p.stock > 5).length} Products</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-amber-500 uppercase">Low Stock Alerts</span>
              <p className="text-xl font-black">{lowStockItems.length} Products</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-rose-500 uppercase">Out of Stock Items</span>
              <p className="text-xl font-black">{products.filter(p => p.stock <= 0).length} Products</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
        </div>

        {/* Stock Level Monitoring Grid for Manager */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Garment Line</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Current Stock Level</th>
                <th className="py-3 px-4">Stock Health Status</th>
                <th className="py-3 px-4 text-right">Inventory Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
              {products.map(p => {
                const isOut = p.stock <= 0;
                const isLow = p.stock > 0 && p.stock <= 5;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-11 rounded-lg object-cover border border-slate-200 dark:border-zinc-800" />
                        <div>
                          <p className="font-bold uppercase text-xs">{p.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku || p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold uppercase text-amber-500">{p.category}</td>
                    <td className="py-3 px-4 font-mono font-bold">{formatLKR(p.price)}</td>
                    <td className="py-3 px-4 font-mono font-extrabold">{p.stock} units</td>
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-500">Out of Stock</span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-500">Low Stock Alert</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-500">Healthy Stock</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatLKR(p.price * p.stock)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};
