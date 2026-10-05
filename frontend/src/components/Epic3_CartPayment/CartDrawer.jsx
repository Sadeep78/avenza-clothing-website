/**
 * ====================================================================
 * AVENZA CLOTHING STORE - SHOPPING BAG DRAWER COMPONENT
 * File: frontend/src/components/Epic3_CartPayment/CartDrawer.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer / All Shoppers
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Slide-over shopping bag drawer displaying current cart items:
 *   1. Item list with exact color picture, name, selected size, and color name.
 *   2. Quantity modifier (+ / -) and item delete button.
 *   3. Promo code input field (AVENZA10, FESTIVE15, VIP20).
 *   4. Price breakdown (Subtotal, Discount, Shipping, Tax, Total in LKR).
 *   5. "Proceed to Checkout" button opening `CheckoutModal.jsx`.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, Plus, Minus, Lock, Edit3 } from 'lucide-react';
import { QuickAddModal } from '../Epic2_ProductInventory/QuickAddModal';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    clearCart,
    updateCartQuantity, 
    replaceCartItem,
    removeFromCart, 
    cartSubtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    cartTotal,
    promoCode,
    applyPromoCode,
    formatLKR,
    systemSettings,
    showToast,
    user,
    setIsAuthModalOpen,
    setPendingCheckout
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  if (!isCartOpen) return null;

  return (
    <div 
      onClick={() => setIsCartOpen(false)}
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between cursor-default"
        >
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-wide">Shopping Bag</h2>
                <p className="text-xs text-slate-400">{cart.length} item{cart.length === 1 ? '' : 's'} in cart</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                !isConfirmingClear ? (
                  <button
                    onClick={() => setIsConfirmingClear(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-black border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Remove all clothes from shopping bag at once"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                    <button
                      onClick={() => {
                        clearCart();
                        setIsConfirmingClear(false);
                        showToast('All clothes removed from shopping bag 🗑️', 'info');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                      title="Confirm deleting all items"
                    >
                      Delete All
                    </button>
                    <button
                      onClick={() => setIsConfirmingClear(false)}
                      className="px-2 py-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )
              )}

              <button
                onClick={() => {
                  setIsConfirmingClear(false);
                  setIsCartOpen(false);
                }}
                className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Scroll area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 relative group"
                >
                  {/* Clickable Product Image opening Size & Color selection interface */}
                  <div
                    onClick={() => setEditingItemIndex(index)}
                    className="relative w-20 h-24 rounded-xl overflow-hidden cursor-pointer group/img shrink-0 border border-slate-200 dark:border-zinc-800"
                    title="Click image to change size, color, or quantity"
                  >
                    <img 
                      src={item.selectedColor?.image || item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-black text-amber-400 text-center p-1 leading-tight uppercase">
                      <Edit3 className="w-4 h-4 mb-0.5" />
                      <span>Change Size/Color</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start pr-6">
                      <h4 
                        onClick={() => setEditingItemIndex(index)}
                        className="text-xs font-bold uppercase line-clamp-1 cursor-pointer hover:text-amber-500 transition-colors"
                        title="Click to edit size or color"
                      >
                        {item.product.name}
                      </h4>
                    </div>

                    {/* Size and Color representation with edit shortcut */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                      <span>Size: <strong className="text-amber-500 font-extrabold">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-slate-800 dark:text-zinc-200 font-semibold">{item.selectedColor.name}</strong></span>
                      <button
                        onClick={() => setEditingItemIndex(index)}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-[10px] text-amber-500 font-bold border border-amber-500/30 transition-colors cursor-pointer ml-1"
                        title="Click image to change size or color"
                      >
                        <Edit3 className="w-2.5 h-2.5" /> Edit Options
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg bg-slate-200 dark:bg-zinc-800 p-0.5">
                        <button
                          onClick={() => updateCartQuantity(index, -1)}
                          className="p-1 hover:text-amber-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-extrabold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(index, 1)}
                          className="p-1 hover:text-amber-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black font-mono text-amber-500">
                        {formatLKR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-sm font-bold">Your shopping bag is empty</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary in LKR */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 space-y-4">
              
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Coupon (SAVE10 or WELCOME15)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono uppercase"
                  />
                </div>
                <button
                  onClick={() => applyPromoCode(inputCode)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Apply
                </button>
              </div>

              {/* Price Breakdown in LKR */}
              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold">{formatLKR(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Promo Discount ({promoCode})</span>
                    <span className="font-mono">-{formatLKR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery (Islandwide)</span>
                  <span className="font-mono text-emerald-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (VAT)</span>
                  <span className="font-mono text-slate-400">Included</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-zinc-800 text-sm font-black text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-amber-500 text-base">{formatLKR(cartTotal)}</span>
                </div>
              </div>

              {systemSettings?.maintenanceMode && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                    <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>System Maintenance Active</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-snug">
                    Payment & checkout services are temporarily paused for maintenance. Store re-opens for orders on:
                  </p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white text-xs bg-amber-500/20 px-2 py-1 rounded-lg inline-block">
                    {systemSettings.maintenanceNoticeTime || 'September 15, 2026 at 10:00 AM (SLST)'}
                  </p>
                </div>
              )}

              {!user && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In Required to Checkout</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                      You can add clothes as a guest, but need to sign in to continue with checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setPendingCheckout(true);
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-transform active:scale-95 cursor-pointer shrink-0 shadow-sm"
                  >
                    Sign In
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  if (systemSettings?.maintenanceMode) {
                    showToast(`System is under maintenance. Payment and checkout re-open on: ${systemSettings.maintenanceNoticeTime || 'scheduled update'} ⚠️`, 'warning');
                    return;
                  }
                  if (!user) {
                    showToast('Please sign in or create an account to proceed with checkout! 🛍️', 'info');
                    setPendingCheckout(true);
                    setIsCartOpen(false);
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                disabled={systemSettings?.maintenanceMode}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform ${
                  systemSettings?.maintenanceMode
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed shadow-none border border-slate-300 dark:border-zinc-700'
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20 active:scale-95 cursor-pointer'
                }`}
              >
                {systemSettings?.maintenanceMode ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Checkout Unavailable (Maintenance Active)</span>
                  </>
                ) : !user ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Edit Options Modal (Size, Color & Quantity selection interface for replacing cart item) */}
      {editingItemIndex !== null && cart[editingItemIndex] && (
        <QuickAddModal
          product={cart[editingItemIndex].product}
          initialSize={cart[editingItemIndex].selectedSize}
          initialColor={cart[editingItemIndex].selectedColor}
          initialQuantity={cart[editingItemIndex].quantity}
          isEditMode={true}
          isOpen={editingItemIndex !== null}
          onClose={() => setEditingItemIndex(null)}
          onConfirm={(newSize, newColor, newQuantity) => {
            replaceCartItem(editingItemIndex, newSize, newColor, newQuantity);
            setEditingItemIndex(null);
          }}
        />
      )}
    </div>
  );
};
