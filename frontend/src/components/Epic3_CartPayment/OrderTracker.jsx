/**
 * ====================================================================
 * AVENZA CLOTHING STORE - LIVE ORDER SHIPMENT TRACKER
 * File: frontend/src/components/Epic3_CartPayment/OrderTracker.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer & Administrator (Monitor shipment fulfillment states)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Visual timeline tracker displaying real-time package delivery stages:
 *   1. Step 1: Order Placed (Payment Approved)
 *   2. Step 2: Tailoring & Packing (Quality Check)
 *   3. Step 3: Dispatched / In Transit (Courier Assigned)
 *   4. Step 4: Delivered (Received by Customer)
 * ====================================================================
 */

import React from 'react';
import { Check, Clock, PackageCheck, Truck, Home, MapPin, XCircle } from 'lucide-react';

export const OrderTracker = ({ orderStatus = 'Processing', trackingNumber = 'TRK-SL-9948201' }) => {
  const steps = [
    { id: 'Processing', label: 'Processing', icon: PackageCheck, desc: 'Tailoring & Packing' },
    { id: 'Shipped', label: 'Shipped', icon: Truck, desc: 'Handed to Courier' },
    { id: 'In Transit', label: 'In Transit', icon: MapPin, desc: 'Out for Delivery' },
    { id: 'Delivered', label: 'Delivered', icon: Home, desc: 'Received by Customer' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending':
      case 'Processing': return 0;
      case 'Shipped': return 1;
      case 'In Transit': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(orderStatus);
  const isCancelled = orderStatus === 'Cancelled';

  return (
    <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Live Tracking Number</span>
          <p className="text-sm font-mono font-extrabold text-amber-500">{trackingNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
          isCancelled
            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
            : orderStatus === 'Delivered'
            ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
            : 'bg-amber-500/20 text-amber-500'
        }`}>
          Status: {orderStatus}
        </span>
      </div>

      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
          <XCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Order Cancelled</p>
            <p className="text-rose-400/90 text-[11px]">This order was cancelled while in processing. Items were returned to inventory and delivery was stopped.</p>
          </div>
        </div>
      ) : (
        /* Progress timeline */
        <div className="relative flex items-center justify-between">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-300 dark:bg-slate-700 z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 z-0 transition-all duration-500" 
            style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
          />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                isDone 
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-amber-500' : 'text-slate-500'}`}>
                {step.label}
              </span>
              <span className="text-[9px] text-slate-400 hidden sm:block">{step.desc}</span>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
