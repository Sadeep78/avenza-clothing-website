/**
 * ====================================================================
 * AVENZA CLOTHING STORE - QUICK ADD TO CART MODAL COMPONENT
 * File: frontend/src/components/Epic1_ProductInventory/QuickAddModal.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer / All Users
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Compact modal window for fast apparel purchasing:
 *   1. Quick size selection (XS - XXL).
 *   2. Quick color swatch selection with real-time thumbnail image update.
 *   3. Quantity modifier controls (+ / -).
 *   4. Direct "Confirm Add to Cart" button and backdrop click-outside close.
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShoppingBag, Check, ShieldCheck } from 'lucide-react';

export const QuickAddModal = ({ 
  product, 
  initialSize, 
  initialColor, 
  initialQuantity, 
  onConfirm, 
  isEditMode = false, 
  isOpen, 
  onClose 
}) => {
  const { addToCart, formatLKR, cart } = useApp();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  const targetSize = String(selectedSize || (product?.sizes ? product.sizes[0] : 'M')).trim().toUpperCase();
  const selectedSizeStock = product?.sizeStocks && product.sizeStocks[targetSize] !== undefined
    ? Number(product.sizeStocks[targetSize])
    : Number(product?.stock || 0);

  const inCartForSelectedSize = isEditMode ? 0 : (cart || [])
    .filter(ci => String(ci.product.id) === String(product?.id) && 
                  String(ci.selectedSize || '').trim().toUpperCase() === targetSize)
    .reduce((s, i) => s + (i.quantity || 0), 0);

  const remainingAddableForSize = Math.max(0, selectedSizeStock - inCartForSelectedSize);
  const isSizeOutOfStock = selectedSizeStock <= 0;
  const isSizeMaxedInCart = !isSizeOutOfStock && remainingAddableForSize === 0;

  useEffect(() => {
    if (product) {
      const defaultSize = initialSize || (product.sizes ? product.sizes[0] : 'M');
      setSelectedSize(defaultSize);

      let defaultCol = initialColor;
      if (!defaultCol && product.colors && product.colors.length > 0) {
        defaultCol = product.colors[0];
      } else if (!defaultCol) {
        defaultCol = { name: 'Standard', hex: '#000000' };
      }
      setSelectedColor(defaultCol);
      setActiveImage(defaultCol.image || product.image);
      setQuantity(initialQuantity || 1);
    }
  }, [product, initialSize, initialColor, initialQuantity]);

  if (!isOpen || !product) return null;

  const handleColorSelect = (col, idx) => {
    setSelectedColor(col);
    const colorImg = col.image || (product.gallery && product.gallery[idx]) || product.image;
    if (colorImg) {
      setActiveImage(colorImg);
    }
  };

  const handleConfirm = () => {
    if (!selectedSize) return;
    if (isEditMode && onConfirm) {
      onConfirm(selectedSize, selectedColor, quantity);
    } else {
      addToCart(product, selectedSize, selectedColor, quantity);
    }
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 cursor-default"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
          <img 
            src={activeImage || product.image} 
            alt={product.name} 
            className="w-20 h-24 rounded-2xl object-cover border border-zinc-800 transition-all duration-300" 
          />
          <div>
            <span className="text-[10px] font-carnage text-amber-500 uppercase tracking-widest block">
              {isEditMode ? 'UPDATE CART ITEM (SIZE, COLOR & QTY)' : 'CHOOSE SIZE & COLOR'}
            </span>
            <h3 className="font-carnage text-lg uppercase tracking-tight text-white">
              {product.name}
            </h3>
            <p className="text-xl font-mono font-black text-amber-500 mt-1">
              {formatLKR(product.price)}
            </p>
          </div>
        </div>

        {/* 1. Size Selector with Stock Badges */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase text-zinc-400">1. Select Apparel Size:</span>
            <span className="text-amber-500 font-mono font-bold">Selected: Size {targetSize}</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.sizes && product.sizes.map(sz => {
              const szCode = String(sz).trim().toUpperCase();
              const szStock = product.sizeStocks && product.sizeStocks[szCode] !== undefined
                ? Number(product.sizeStocks[szCode])
                : Number(product.stock || 0);
              const szInCart = isEditMode ? 0 : (cart || [])
                .filter(ci => String(ci.product.id) === String(product.id) && 
                              String(ci.selectedSize || '').trim().toUpperCase() === szCode)
                .reduce((s, i) => s + (i.quantity || 0), 0);
              const szRemaining = Math.max(0, szStock - szInCart);
              const isSoldOut = szStock <= 0;
              const isSelected = targetSize === szCode;

              return (
                <button
                  key={sz}
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => {
                    setSelectedSize(szCode);
                    setQuantity(Math.min(quantity, Math.max(1, szRemaining)));
                  }}
                  className={`min-w-[60px] px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    isSoldOut
                      ? 'opacity-40 bg-zinc-900 border-dashed border-zinc-800 text-zinc-500 cursor-not-allowed line-through'
                      : isSelected
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105 border-2 border-amber-400 ring-2 ring-amber-400'
                      : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-amber-500'
                  }`}
                >
                  <span className="font-carnage text-sm">{szCode}</span>
                  <span className={`text-[9px] font-mono font-bold ${
                    isSoldOut
                      ? 'text-rose-500'
                      : isSelected
                      ? 'text-black/90 font-black'
                      : szStock <= 3
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}>
                    {isSoldOut ? 'Sold Out' : `${szStock} left`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Size Inventory Banner */}
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs mt-2">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold">Size {targetSize} Available:</span>
              <span className={`font-mono font-black ${selectedSizeStock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedSizeStock > 0 ? `${selectedSizeStock} Units` : 'Sold Out'}
              </span>
            </div>
            {inCartForSelectedSize > 0 ? (
              <span className="text-[11px] font-bold text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                {inCartForSelectedSize} in cart ({remainingAddableForSize} left to add)
              </span>
            ) : (
              <span className="text-[11px] text-zinc-500">
                Available to order
              </span>
            )}
          </div>
        </div>

        {/* 2. Color Swatch Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase text-zinc-400">2. Select Color Swatch:</span>
              <span className="text-amber-500 font-bold">{selectedColor?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              {product.colors.map((col, idx) => (
                <button
                  key={col.name}
                  onClick={() => handleColorSelect(col, idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-transform cursor-pointer ${
                    selectedColor?.name === col.name 
                      ? 'border-amber-500 bg-amber-500/10 text-white ring-2 ring-amber-500' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Quantity Controls & Confirm Button */}
        <div className="pt-4 border-t border-zinc-800 flex items-center gap-4">
          <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-1">
            <button
              type="button"
              disabled={quantity <= 1 || remainingAddableForSize === 0}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="w-10 text-center font-mono font-bold text-sm">
              {remainingAddableForSize === 0 ? 0 : quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= remainingAddableForSize || remainingAddableForSize === 0}
              onClick={() => setQuantity(Math.min(remainingAddableForSize, quantity + 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <button
            disabled={isSizeOutOfStock || isSizeMaxedInCart}
            onClick={handleConfirm}
            className={`carnage-btn flex-1 py-3.5 rounded-xl font-carnage text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
              isSizeOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : isSizeMaxedInCart
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isSizeOutOfStock
                ? `SIZE ${targetSize} SOLD OUT`
                : isSizeMaxedInCart
                ? `ALL ${selectedSizeStock} OF SIZE ${targetSize} IN CART`
                : isEditMode
                ? 'CONFIRM & REPLACE IN CART'
                : `ADD SIZE ${targetSize} TO CART (${quantity})`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
