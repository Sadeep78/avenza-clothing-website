/**
 * ====================================================================
 * AVENZA CLOTHING STORE - STANDALONE PAYMENT SUCCESS WINDOW / MODAL
 * File: frontend/src/components/Epic3_CartPayment/PaymentSuccessModal.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer (Receives independent payment confirmation & invoice)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Dedicated, standalone Payment Success window separate from the
 *   shipping address / checkout modal:
 *   1. Displays celebration animation & 256-bit SSL verified badge.
 *   2. Displays full transaction receipt, order ID, and tracking code.
 *   3. Shows detailed paid breakdown for Visa, Mastercard, or COD.
 *   4. Allows instant navigation to Order History or Continue Shopping.
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, 
  ShieldCheck, 
  FileText, 
  Truck, 
  Paperclip, 
  X, 
  ShoppingBag, 
  ArrowRight,
  Printer,
  Copy,
  CheckCircle2
} from 'lucide-react';

export const PaymentSuccessModal = () => {
  const { 
    paymentSuccessOrder, 
    setPaymentSuccessOrder, 
    formatLKR, 
    setActiveTab, 
    showToast 
  } = useApp();

  if (!paymentSuccessOrder) return null;

  const order = paymentSuccessOrder;

  const isCardPayment = 
    order.paymentDetails?.method === 'card' ||
    order.paymentMethod?.toLowerCase().includes('visa') ||
    order.paymentMethod?.toLowerCase().includes('mastercard') ||
    order.paymentMethod?.toLowerCase().includes('card');

  const remainingDue = Math.max(0, (order.totalAmount || 0) - 500);

  const handleClose = () => {
    setPaymentSuccessOrder(null);
  };

  const handleGoToOrders = () => {
    setPaymentSuccessOrder(null);
    if (setActiveTab) setActiveTab('orders');
  };

  const handleCopyOrderId = () => {
    if (order.id) {
      navigator.clipboard?.writeText(order.id);
      showToast(`Order reference ${order.id} copied to clipboard! 📋`, 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 sm:p-8 cursor-default"
      >
        {/* Top Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
          title="Close payment confirmation window"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-5">
          {/* Animated 3D Success Icon */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 border-4 border-white dark:border-zinc-900">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
            </div>
          </div>

          {/* Headline & Verification Badge */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {isCardPayment ? '256-Bit SSL Payment Successful & Verified' : 'Cash on Delivery Deposit Verified'}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isCardPayment ? 'Payment Completed Successfully!' : 'Order Placed Successfully!'}
            </h2>

            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              {isCardPayment
                ? `Your transaction of ${formatLKR(order.totalAmount)} has been authenticated. An official invoice and shipment receipt have been generated.`
                : 'Your order has been confirmed with LKR 500 advance deposit slip verified. The parcel will be dispatched for doorstep delivery.'}
            </p>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-400">Order Reference:</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="font-mono font-black text-amber-500 hover:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Click to copy Order ID"
              >
                <span>{order.id}</span>
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Official Transaction Receipt Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 text-left text-xs space-y-4 border border-slate-200 dark:border-zinc-800 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Official Transaction Receipt
                </span>
              </div>
              <span className="font-black px-2.5 py-1 rounded-md text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                {isCardPayment ? 'PAID IN FULL ✓' : 'ADVANCE VERIFIED ✓'}
              </span>
            </div>

            {/* Recipient & Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-zinc-300 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Customer Recipient</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{order.customerName}</span>
                <p className="text-slate-400 text-[10px] truncate">{order.email}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Tracking Number</span>
                <span className="font-mono font-bold text-amber-500 text-xs">{order.trackingNumber}</span>
                <p className="text-slate-400 text-[10px]">{order.deliveryType === 'Express_Same_Day' ? '⚡ Express Priority Dispatch' : '📦 Standard Courier Delivery'}</p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Shipping Destination</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode ? `(${order.shippingAddress.postalCode})` : ''}
                </span>
                {order.shippingAddress?.phone && (
                  <p className="text-slate-400 text-[10px] mt-0.5">Contact: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>

            {/* Purchased Items Thumbnail Row */}
            {order.items && order.items.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold mb-2">
                  Items Purchased ({order.items.reduce((s, it) => s + (it.quantity || 1), 0)} units):
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200/70 dark:border-zinc-700/60">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-12 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-zinc-700" 
                          />
                        )}
                        <div className="overflow-hidden text-xs">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-500 text-xs shrink-0">
                        {formatLKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-bold px-2.5 py-1 rounded text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  {order.paymentMethod}
                </span>
              </div>

              {order.paymentSlip && (
                <div className="flex items-center justify-between text-[11px] py-1 border-t border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-amber-500" /> Advance Deposit Slip:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ {order.paymentSlip.fileName || 'Deposit Slip Attached'}
                  </span>
                </div>
              )}

              {isCardPayment ? (
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 dark:border-zinc-800">
                  <div>
                    <span className="font-black text-slate-800 dark:text-zinc-100 block text-xs">Total Amount Paid:</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">256-Bit SSL Bank Authenticated</span>
                  </div>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xl sm:text-2xl">
                    {formatLKR(order.totalAmount)}
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5 pt-2.5 border-t border-slate-200 dark:border-zinc-800 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Total Order Value:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formatLKR(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                    <span>Advance Deposit Paid:</span>
                    <span className="font-mono font-bold">LKR 500.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400 text-xs pt-1.5 border-t border-dashed border-slate-200 dark:border-zinc-800">
                    <span>Remaining Balance Due on Delivery:</span>
                    <span className="font-mono text-sm">{formatLKR(remainingDue)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleGoToOrders}
              className="flex-1 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-zinc-800 transition-all cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-amber-500" />
              View in Order History & Invoice
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
