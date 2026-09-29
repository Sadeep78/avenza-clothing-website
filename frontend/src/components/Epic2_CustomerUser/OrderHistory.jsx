/**
 * ====================================================================
 * AVENZA CLOTHING STORE - CUSTOMER ORDER HISTORY & LIVE TRACKER
 * File: frontend/src/components/Epic2_CustomerUser/OrderHistory.jsx
 * 
 * 📌 USER STORIES COVERED:
 *   - AVE-22: "Customer views past apparel orders, tracks live courier delivery progress,
 *              re-orders items into cart, and unlocks feedback submission after delivery."
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer (Views purchase history, tracks shipment, writes review upon delivery)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   1. Displays order history cards with order status badges (Processing, Shipped, Delivered).
 *   2. Live Shipment Tracker modal (`OrderTracker.jsx`).
 *   3. Re-order item button: Clicking item image/card adds item back into CartDrawer.
 *   4. Feedback trigger: "Write Review" unlocked ONLY when status is "Delivered".
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Truck, FileText, Printer, Star, ShoppingBag, Plus, Trash2, ShieldAlert, XCircle, Lock } from 'lucide-react';
import { OrderTracker } from '../Epic3_CartPayment/OrderTracker';

export const OrderHistory = () => {
  const { 
    orders, 
    user, 
    formatLKR, 
    openFeedbackModal, 
    addToCart,
    deleteOrder,
    cancelOrder,
    cancelOrderItem,
    clearDeliveredOrders,
    clearCancelledOrders,
    products,
    setIsCartOpen,
    showToast,
    setActiveTab,
    setIsAuthModalOpen
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isConfirmingBulkClear, setIsConfirmingBulkClear] = useState(false);
  const [isConfirmingBulkClearCancelled, setIsConfirmingBulkClearCancelled] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancellingItemKey, setCancellingItemKey] = useState(null);

  // When no user is logged in, do not display any orders or order details
  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-12 rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-center space-y-6 shadow-xl animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-500">Sign In Required</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Track Your Apparel Orders</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Please sign in to your account to view your purchase history, live shipment tracking, and official invoices.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs transition-all cursor-pointer"
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Filter orders for logged-in user or show all if admin
  const userOrders = !user ? [] : orders.filter(o => o.email === user?.email || o.userId === user?.id || user?.role === 'admin');
  const deliveredOrders = userOrders.filter(o => o.status === 'Delivered');
  const cancelledOrders = userOrders.filter(o => o.status === 'Cancelled');

  /**
   * Helper Handler: Add delivered order item back to customer cart
   * Target Role: Customer (AVE-22 / Order Re-order feature)
   */
  const handleAddToCartFromOrder = (item, e) => {
    if (e) e.stopPropagation();
    const match = products.find(p => p.id === item.productId || p.id === item.id || p.name === item.name);
    const prodObj = match || {
      id: item.productId || item.id || `prod-${Date.now()}`,
      name: item.name,
      price: item.price,
      image: item.image,
      stock: 25,
      category: 'Clothing'
    };

    const itemColorObj = typeof item.color === 'string' ? { name: item.color, hex: '#000000' } : (item.color || { name: 'Default', hex: '#000000' });

    addToCart(prodObj, item.size || 'M', itemColorObj, 1);
    setIsCartOpen(true);
    showToast(`"${item.name}" added back to your cart! 🛒`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl card-theme shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Customer Order History & Live Tracking</span>
          </div>
          <h2 className="text-2xl font-black">
            My Apparel Orders & Live Tracking
          </h2>
          <p className="text-xs text-slate-500">Track shipments live, write reviews upon delivery, or manage completed records</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {cancelledOrders.length > 0 && (
            <div>
              {!isConfirmingBulkClearCancelled ? (
                <button
                  onClick={() => setIsConfirmingBulkClearCancelled(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-500/10 hover:bg-rose-500/15 text-zinc-700 dark:text-zinc-300 hover:text-rose-500 border border-zinc-300 dark:border-zinc-700 hover:border-rose-400 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Delete all cancelled orders at once"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Delete All Cancelled ({cancelledOrders.length})</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-rose-500 px-2">Delete {cancelledOrders.length} cancelled orders?</span>
                  <button
                    onClick={() => {
                      clearCancelledOrders(user?.email || user?.id);
                      setIsConfirmingBulkClearCancelled(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    Yes, Delete All
                  </button>
                  <button
                    onClick={() => setIsConfirmingBulkClearCancelled(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {deliveredOrders.length > 0 && (
            <div>
              {!isConfirmingBulkClear ? (
                <button
                  onClick={() => setIsConfirmingBulkClear(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Delete all completed/delivered orders at once"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Delivered ({deliveredOrders.length})</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-rose-500 px-2">Delete {deliveredOrders.length} delivered orders?</span>
                  <button
                    onClick={() => {
                      clearDeliveredOrders();
                      setIsConfirmingBulkClear(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    Yes, Delete All
                  </button>
                  <button
                    onClick={() => setIsConfirmingBulkClear(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      {userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div 
              key={order.id}
              className="p-6 rounded-3xl card-theme shadow-sm space-y-4 hover:border-amber-500 transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base font-mono">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                      order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                      order.status === 'In Transit' ? 'bg-sky-500/20 text-sky-500 border border-sky-500/30' :
                      order.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' :
                      'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Placed on {order.date} • {order.items.length} items</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Processing Status: Customer CAN Cancel order */}
                  {order.status === 'Processing' && (
                    <>
                      {cancellingOrderId === order.id ? (
                        <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 p-1.5 rounded-xl animate-in fade-in duration-150">
                          <span className="text-[10px] font-bold text-rose-500 px-1">Cancel Order?</span>
                          <button
                            onClick={() => {
                              cancelOrder(order.id);
                              setCancellingOrderId(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer shadow-sm"
                          >
                            Yes, Cancel
                          </button>
                          <button
                            onClick={() => setCancellingOrderId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancellingOrderId(order.id)}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                          title="Cancel this order while it is still processing"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Shipped or In Transit Status: Strictly CANNOT Cancel and CANNOT Delete */}
                  {(order.status === 'Shipped' || order.status === 'In Transit') && (
                    <span 
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 shadow-sm" 
                      title="Package is handed over to courier / in transit. Order cannot be cancelled or deleted."
                    >
                      <Truck className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                      <span>In Transit (Cannot Cancel / Delete)</span>
                    </span>
                  )}

                  {/* Delivered Status: Write Review and Delete */}
                  {order.status === 'Delivered' && (
                    <>
                      <button
                        onClick={() => openFeedbackModal({
                          orderId: order.id,
                          productName: order.items.map(i => i.name).join(', ')
                        })}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 text-black border border-amber-500 font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-all cursor-pointer shadow-sm"
                        title="Rate your delivered order"
                      >
                        <Star className="w-3.5 h-3.5 fill-black text-black" />
                        Write Review
                      </button>

                      {deletingOrderId === order.id ? (
                        <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 p-1 rounded-xl animate-in fade-in duration-150">
                          <span className="text-[10px] font-bold text-rose-500 px-1">Delete?</span>
                          <button
                            onClick={() => {
                              deleteOrder(order.id);
                              setDeletingOrderId(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer shadow-sm"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingOrderId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingOrderId(order.id)}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Delete this delivered order from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Cancelled Status: Can remove cancelled record from history */}
                  {order.status === 'Cancelled' && (
                    deletingOrderId === order.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 p-1 rounded-xl animate-in fade-in duration-150">
                        <span className="text-[10px] font-bold text-rose-500 px-1">Delete Record?</span>
                        <button
                          onClick={() => {
                            deleteOrder(order.id);
                            setDeletingOrderId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer shadow-sm"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeletingOrderId(null)}
                          className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingOrderId(order.id)}
                        className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-rose-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Remove cancelled order from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Record</span>
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-500 font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer border border-amber-500/30"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Track Shipment Live
                  </button>

                  <button
                    onClick={() => setSelectedInvoice(order)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-zinc-700 hover:border-amber-500 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    LKR Invoice
                  </button>
                </div>
              </div>


              {/* Items Preview - Clicking product image or Add to Cart button re-adds item to cart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={(e) => handleAddToCartFromOrder(item, e)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500 transition-all cursor-pointer group relative"
                    title="Click cloth image to add item back to shopping cart"
                  >
                    <div className="relative overflow-hidden rounded-xl shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-14 h-16 object-cover rounded-xl group-hover:scale-110 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ShoppingBag className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate uppercase group-hover:text-amber-500 transition-colors">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Size: {item.size} • Color: {item.color}</p>
                      <p className="text-xs font-mono font-extrabold text-amber-500">{formatLKR(item.price)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Cancel Individual Cloth (Only if Order is Processing) */}
                      {order.status === 'Processing' && (
                        cancellingItemKey === `${order.id}-${item.orderItemId || item.id || idx}` ? (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            className="flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 p-1 rounded-xl animate-in fade-in duration-150"
                          >
                            <span className="text-[9px] font-bold text-rose-500 px-1">Cancel?</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelOrderItem(order.id, item.orderItemId || item.id);
                                setCancellingItemKey(null);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-bold text-[9px] hover:bg-rose-700 cursor-pointer shadow-sm"
                            >
                              Yes
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCancellingItemKey(null);
                              }}
                              className="px-1.5 py-0.5 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[9px] cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancellingItemKey(`${order.id}-${item.orderItemId || item.id || idx}`);
                            }}
                            className="px-2 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                            title="Cancel this cloth from the order"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )
                      )}

                      <button
                        onClick={(e) => handleAddToCartFromOrder(item, e)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500 text-black hover:bg-amber-400 font-extrabold text-[10px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        title="Add to Shopping Cart"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                  Tracking Code: <strong className="font-mono text-amber-500">{order.trackingNumber}</strong>
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-400 mr-2">Total Paid:</span>
                  <span className="text-lg font-black font-mono text-amber-500">
                    {formatLKR(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl card-theme">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-lg font-bold">No Order History Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Place your first activewear order to track live delivery progress.
          </p>
        </div>
      )}

      {/* Track Shipment Modal */}
      {trackingOrder && (
        <div 
          onClick={() => setTrackingOrder(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 space-y-4 cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                Live Order Tracker - {trackingOrder.id}
              </h3>
              <button onClick={() => setTrackingOrder(null)} className="text-xs font-bold text-slate-400 hover:text-amber-500 cursor-pointer">
                Close
              </button>
            </div>

            <OrderTracker orderStatus={trackingOrder.status} trackingNumber={trackingOrder.trackingNumber} />
          </div>
        </div>
      )}

      {/* Invoice Modal in LKR */}
      {selectedInvoice && (
        <div 
          onClick={() => setSelectedInvoice(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-white text-slate-900 p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] print:p-0 print:shadow-none cursor-default"
          >
            
            <div className="flex justify-between items-start border-b pb-6 border-slate-200">
              <div>
                <h2 className="text-2xl font-black tracking-wider text-slate-900">AVENZA CLOTHING STORE</h2>
                <p className="text-xs text-slate-500 font-semibold">Web-Based Clothes Management System (Sri Lanka)</p>
                <p className="text-xs text-slate-400">Official Purchase Invoice & Customer Receipt</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-amber-600">TAX INVOICE</span>
                <p className="text-xs font-mono text-slate-600">{selectedInvoice.id}</p>
                <p className="text-xs text-slate-400">Date: {selectedInvoice.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-400 uppercase">Customer Information</p>
                <p className="font-bold text-slate-800 text-sm mt-1">{selectedInvoice.customerName}</p>
                <p className="text-slate-600">{selectedInvoice.email}</p>
                <p className="text-slate-600">{selectedInvoice.shippingAddress?.address}, {selectedInvoice.shippingAddress?.city}</p>
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase">Payment & Delivery</p>
                <p className="text-slate-800 mt-1 font-semibold">Method: {selectedInvoice.paymentMethod}</p>
                <p className="text-slate-800 font-semibold">Tracking Code: {selectedInvoice.trackingNumber}</p>
                <p className="text-slate-800 font-semibold">Status: {selectedInvoice.status}</p>
                {selectedInvoice.paymentSlip && (
                  <p className="text-emerald-600 font-bold text-[11px] mt-0.5">
                    ✓ Advance Deposit Slip Attached
                  </p>
                )}
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-t border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-2">Item Name</th>
                  <th className="py-2.5 px-2">Size / Color</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-2 font-bold text-slate-800">{item.name}</td>
                    <td className="py-3 px-2 text-slate-600">{item.size} / {item.color}</td>
                    <td className="py-3 px-2 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold">{formatLKR(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center border-t border-slate-200 pt-4">
              <span className="text-xs text-slate-400">Thank you for shopping with Avenza Clothing Store!</span>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold uppercase mr-3">Total Paid (LKR):</span>
                <span className="text-2xl font-black font-mono text-slate-900">{formatLKR(selectedInvoice.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF Invoice
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
