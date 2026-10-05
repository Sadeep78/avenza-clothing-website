/**
 * ====================================================================
 * AVENZA CLOTHING STORE - MANAGER ORDER FULFILLMENT & DELIVERY DISPATCH (AVE-24, AVE-25)
 * File: frontend/src/components/Epic4_DeliveryFeedback/AdminOrders.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Store Manager / AVENZA Owner (Fulfillment, Courier Allocation, & Live Tracking)
 * 
 * 🎯 EPIC: E4 - Delivery and Feedback Management
 *   Purpose: Delivery oversight console:
 *   - Create and assign delivery records for placed orders (Standard Courier vs Express Same-Day).
 *   - Track and update delivery status of orders from dispatch through completion.
 *   - Real-time customer tracking and delivery fulfillment.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  Package, 
  Eye, 
  FileText, 
  Search, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Phone, 
  Barcode, 
  Check, 
  X,
  Filter,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { OrderTracker } from '../Epic3_CartPayment/OrderTracker';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, assignOrderDelivery, deleteOrder, clearDeliveredOrders, clearCancelledOrders, formatLKR } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [isConfirmingBulkClear, setIsConfirmingBulkClear] = useState(false);
  const [isConfirmingBulkClearCancelled, setIsConfirmingBulkClearCancelled] = useState(false);

  // Delivery Assignment Form State (AVE-24)
  const [deliveryType, setDeliveryType] = useState('Standard_Courier'); // 'Standard_Courier' | 'Express_Same_Day'
  const [courierPartner, setCourierPartner] = useState('Domex Courier Services');
  const [trackingBarcode, setTrackingBarcode] = useState('');
  const [transitHub, setTransitHub] = useState('Colombo Central Distribution Hub');
  const [riderName, setRiderName] = useState('Nuwan Bandara');
  const [riderPhone, setRiderPhone] = useState('+94 77 456 7890');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Afternoon (2:00 PM - 5:00 PM)');

  const handleOpenAssignModal = (order) => {
    setAssigningOrder(order);
    const existingDelType = order.deliveryType || (order.shippingAddress?.city?.toLowerCase().includes('colombo') ? 'Express_Same_Day' : 'Standard_Courier');
    setDeliveryType(existingDelType);
    setCourierPartner(order.courierPartner || 'Domex Courier Services');
    setTrackingBarcode(order.trackingBarcode || `BARCODE-${order.trackingNumber || order.id}`);
    setTransitHub(order.transitHub || 'Colombo Central Distribution Hub');
    setRiderName(order.riderName || 'Nuwan Bandara');
    setRiderPhone(order.riderPhone || '+94 77 456 7890');
    setDeliveryTimeSlot(order.deliveryTimeSlot || 'Afternoon (2:00 PM - 5:00 PM)');
  };

  const handleSaveDeliveryAssignment = (e) => {
    e.preventDefault();
    if (!assigningOrder) return;

    const deliveryPayload = {
      deliveryType,
      courierPartner: deliveryType === 'Standard_Courier' ? courierPartner : null,
      trackingBarcode: deliveryType === 'Standard_Courier' ? trackingBarcode : null,
      transitHub: deliveryType === 'Standard_Courier' ? transitHub : null,
      riderName: deliveryType === 'Express_Same_Day' ? riderName : null,
      riderPhone: deliveryType === 'Express_Same_Day' ? riderPhone : null,
      deliveryTimeSlot: deliveryType === 'Express_Same_Day' ? deliveryTimeSlot : null
    };

    assignOrderDelivery(assigningOrder.id, deliveryPayload);
    setAssigningOrder(null);
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesQuery = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.shippingAddress?.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.trackingNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const totalOrdersCount = orders.length;
  const dispatchedCount = orders.filter(o => o.status === 'Shipped' || o.status === 'In Transit').length;
  const expressCount = orders.filter(o => o.deliveryType === 'Express_Same_Day').length;
  const standardCount = orders.filter(o => o.deliveryType === 'Standard_Courier').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 rounded-3xl card-theme shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Order Fulfillment & Delivery Dispatch Portal</span>
          </div>
          <h2 className="text-2xl font-black">
            Order Fulfillment & Delivery Dispatch Console
          </h2>
          <p className="text-xs text-slate-500">
            Assign delivery records (Standard Courier vs. Express Same-Day), allocate transit hubs or dispatch riders, & update tracking statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter status buttons */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
            {['all', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterStatus === st 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>

          {/* Delete All Cancelled Orders Button */}
          {cancelledCount > 0 && (
            <div>
              {!isConfirmingBulkClearCancelled ? (
                <button
                  onClick={() => setIsConfirmingBulkClearCancelled(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-500/10 hover:bg-rose-500/15 text-zinc-700 dark:text-zinc-300 hover:text-rose-500 border border-zinc-300 dark:border-zinc-700 hover:border-rose-400 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Delete all cancelled orders from database (Active/pending delivery orders are protected)"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Clear Cancelled ({cancelledCount})</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-rose-500/15 border border-rose-500/30 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-rose-500 px-1.5">Delete {cancelledCount} cancelled orders?</span>
                  <button
                    onClick={() => {
                      clearCancelledOrders();
                      setIsConfirmingBulkClearCancelled(false);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsConfirmingBulkClearCancelled(false)}
                    className="px-2 py-1 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Delete All Delivered Orders Button */}
          {deliveredCount > 0 && (
            <div>
              {!isConfirmingBulkClear ? (
                <button
                  onClick={() => setIsConfirmingBulkClear(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Delete all delivered orders from database (Pending delivery orders are protected)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Delivered ({deliveredCount})</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-rose-500/15 border border-rose-500/30 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-rose-500 px-1.5">Delete {deliveredCount} delivered orders?</span>
                  <button
                    onClick={() => {
                      clearDeliveredOrders();
                      setIsConfirmingBulkClear(false);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsConfirmingBulkClear(false)}
                    className="px-2 py-1 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Orders</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalOrdersCount}</p>
        </div>

        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-sky-500 uppercase">Active Dispatches</span>
          <p className="text-2xl font-black text-sky-600 dark:text-sky-400">{dispatchedCount}</p>
        </div>

        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-500 uppercase">⚡ Express Same-Day</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{expressCount}</p>
        </div>

        <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-emerald-500 uppercase">🚚 Standard Courier</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{standardCount}</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl card-theme border border-slate-200 dark:border-zinc-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Order ID, customer name, city, or tracking code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl card-theme shadow-sm overflow-hidden border border-slate-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900/80 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Order ID & Date</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Payment Info</th>
                <th className="py-4 px-4">Delivery Allocation</th>
                <th className="py-4 px-4">Status & Tracking</th>
                <th className="py-4 px-6 text-right">Manager Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="py-4 px-6">
                      <p className="font-mono font-extrabold text-amber-500 text-sm">{order.id}</p>
                      <p className="text-[11px] text-slate-400">{order.date}</p>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{order.email}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {order.shippingAddress?.city || 'Colombo'}
                      </p>
                    </td>

                    {/* Payment Info */}
                    <td className="py-4 px-4">
                      <p className="font-mono font-black text-slate-900 dark:text-white">{formatLKR(order.totalAmount)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        (order.paymentDetails?.method === 'card' || order.paymentMethod?.toLowerCase().includes('visa') || order.paymentMethod?.toLowerCase().includes('mastercard') || order.paymentMethod?.toLowerCase().includes('card'))
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {order.paymentMethod || 'Visa/Mastercard'}
                      </span>
                    </td>

                    {/* Delivery Allocation (AVE-24) */}
                    <td className="py-4 px-4">
                      {order.deliveryType === 'Express_Same_Day' ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                            <Zap className="w-3 h-3" /> Express Same-Day
                          </span>
                          <p className="font-bold text-[11px] text-slate-800 dark:text-zinc-200">
                            {order.riderName || 'Nuwan Bandara'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {order.deliveryTimeSlot || 'Afternoon Slot'}
                          </p>
                        </div>
                      ) : order.deliveryType === 'Standard_Courier' ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center gap-1 w-fit">
                            <Truck className="w-3 h-3" /> Standard Courier
                          </span>
                          <p className="font-bold text-[11px] text-slate-800 dark:text-zinc-200">
                            {order.courierPartner || 'Domex Courier'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                            {order.transitHub || 'Colombo Hub'}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => handleOpenAssignModal(order)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 font-bold text-[11px] border border-amber-500/30 transition cursor-pointer"
                          >
                            + Assign Delivery
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status & Tracking (AVE-25) */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                          order.status === 'Delivered' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                            : order.status === 'Shipped' || order.status === 'In Transit'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        TRK: {order.trackingNumber || 'Pending'}
                      </p>
                    </td>

                    {/* Manager Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenAssignModal(order)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                          title="Assign or reassign delivery"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-500" />
                          <span>Assign Delivery</span>
                        </button>
                        
                        <button
                          onClick={() => setTrackingModalOrder(order)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black flex items-center gap-1 shadow-sm transition cursor-pointer"
                          title="Inspect live customer tracking view"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tracker</span>
                        </button>

                        {/* Order Deletion (Delivered or Cancelled Only) */}
                        {order.status === 'Delivered' || order.status === 'Cancelled' ? (
                          deletingOrderId === order.id ? (
                            <div className="flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 p-1 rounded-xl animate-in fade-in duration-150">
                              <span className="text-[10px] font-bold text-rose-500 px-1">Del?</span>
                              <button
                                onClick={() => {
                                  deleteOrder(order.id);
                                  setDeletingOrderId(null);
                                }}
                                className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer shadow-sm"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeletingOrderId(null)}
                                className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingOrderId(order.id)}
                              className="p-1.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                              title={`Delete ${order.status.toLowerCase()} order from database`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )
                        ) : (
                          <span
                            title="Protected: Active orders (Processing, Shipped, In Transit) cannot be deleted"
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-300 dark:text-zinc-700 cursor-not-allowed opacity-40 flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELIVERY ASSIGNMENT MODAL */}
      {assigningOrder && (
        <div 
          onClick={() => setAssigningOrder(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-5 shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                  Manager Dispatch Portal
                </span>
                <h3 className="text-xl font-black">Assign Delivery Record</h3>
              </div>
              <button onClick={() => setAssigningOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-amber-500">{assigningOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold">{assigningOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping Address:</span>
                <span className="text-right text-slate-600 dark:text-zinc-300 max-w-xs truncate">
                  {assigningOrder.shippingAddress?.address}, {assigningOrder.shippingAddress?.city}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveDeliveryAssignment} className="space-y-4">
              {/* Delivery Method Selection (ISA Hierarchy) */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Select Delivery Mode (ISA Specialization)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('Standard_Courier')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                      deliveryType === 'Standard_Courier'
                        ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'border-slate-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Truck className="w-4 h-4" />
                      {deliveryType === 'Standard_Courier' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-black text-xs">Standard Courier</p>
                      <p className="text-[10px] opacity-75">Domex / Islandwide network</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('Express_Same_Day')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                      deliveryType === 'Express_Same_Day'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'border-slate-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Zap className="w-4 h-4" />
                      {deliveryType === 'Express_Same_Day' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-black text-xs">Express Same-Day</p>
                      <p className="text-[10px] opacity-75">Dedicated rider dispatch</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Standard Courier Specific Form */}
              {deliveryType === 'Standard_Courier' && (
                <div className="space-y-3 p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 animate-in fade-in-50">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Courier Partner
                    </label>
                    <select
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold cursor-pointer"
                    >
                      <option value="Domex Courier Services">Domex Courier Services</option>
                      <option value="Prompt Xpress Courier">Prompt Xpress Courier</option>
                      <option value="Pronto Lanka Courier">Pronto Lanka Courier</option>
                      <option value="Certis Lanka Courier">Certis Lanka Courier</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Tracking Barcode
                      </label>
                      <input
                        type="text"
                        required
                        value={trackingBarcode}
                        onChange={(e) => setTrackingBarcode(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Transit Hub
                      </label>
                      <select
                        value={transitHub}
                        onChange={(e) => setTransitHub(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold cursor-pointer"
                      >
                        <option value="Colombo Central Distribution Hub">Colombo Central Hub</option>
                        <option value="Kandy Regional Hub">Kandy Regional Hub</option>
                        <option value="Galle Southern Hub">Galle Southern Hub</option>
                        <option value="Kurunegala Hub">Kurunegala Hub</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Express Same-Day Specific Form */}
              {deliveryType === 'Express_Same_Day' && (
                <div className="space-y-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 animate-in fade-in-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Assigned Rider Name
                      </label>
                      <input
                        type="text"
                        required
                        value={riderName}
                        onChange={(e) => setRiderName(e.target.value)}
                        placeholder="e.g. Nuwan Bandara"
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Rider Contact Phone
                      </label>
                      <input
                        type="text"
                        required
                        value={riderPhone}
                        onChange={(e) => setRiderPhone(e.target.value)}
                        placeholder="+94 77 456 7890"
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Delivery Time Slot
                    </label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold cursor-pointer"
                    >
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                      <option value="Evening (6:00 PM - 9:00 PM)">Evening (6:00 PM - 9:00 PM)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningOrder(null)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  Confirm & Dispatch Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Tracker Modal (AVE-25) */}
      {trackingModalOrder && (
        <div 
          onClick={() => setTrackingModalOrder(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 space-y-4 cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                Live Courier Tracker Inspection · {trackingModalOrder.id}
              </h3>
              <button onClick={() => setTrackingModalOrder(null)} className="text-xs font-bold text-slate-400 hover:text-amber-500">
                Close
              </button>
            </div>

            <OrderTracker orderStatus={trackingModalOrder.status} trackingNumber={trackingModalOrder.trackingNumber} />
          </div>
        </div>
      )}
    </div>
  );
};
