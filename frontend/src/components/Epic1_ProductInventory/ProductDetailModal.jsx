/**
 * ====================================================================
 * AVENZA CLOTHING STORE - PRODUCT DETAIL MODAL COMPONENT
 * File: frontend/src/components/Epic1_ProductInventory/ProductDetailModal.jsx
 * 
 * 📌 USER STORY COVERED:
 *   - AVE-22: "Customer views product details, previous customer reviews, ratings,
 *              selects size and color swatches, and adds item to shopping bag."
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer / All Users
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Modal window displaying complete apparel product information:
 *   1. Full image gallery with dynamic color image swapping when swatches are clicked.
 *   2. Active color pill badge overlay showing exact color hex & name.
 *   3. Customer reviews section displaying previous verified purchaser reviews & staff replies.
 *   4. Size selector (XS - XXL) and Quantity selector.
 *   5. "Add to Cart" and "Instant Checkout" buttons.
 *   6. Backdrop click-outside modal dismissal.
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, ShoppingBag, Heart, AlertTriangle, Check, MessageSquare, ShieldCheck, CornerDownRight } from 'lucide-react';

export const ProductDetailModal = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    cart,
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setIsCartOpen, 
    formatLKR,
    feedbacks,
    openFeedbackModal,
    getProductRatingSummary,
    user
  } = useApp();

  const [activeImage, setActiveImage] = useState(selectedProduct?.image || '');
  const [selectedSize, setSelectedSize] = useState(selectedProduct?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors?.[0] || { name: 'Default', hex: '#000000' });
  const [quantity, setQuantity] = useState(1);

  // Sync state whenever selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      const firstColor = selectedProduct.colors?.[0] || { name: 'Default', hex: '#000000' };
      setSelectedColor(firstColor);
      setSelectedSize(selectedProduct.sizes?.[0] || 'M');
      setActiveImage(firstColor.image || selectedProduct.image);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  // Update cloth color and change preview image to match selected color swatch
  const handleColorSelect = (col, idx) => {
    setSelectedColor(col);
    const colorImg = col.image || (selectedProduct.gallery && selectedProduct.gallery[idx]) || selectedProduct.image;
    if (colorImg) {
      setActiveImage(colorImg);
    }
  };

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const isOutOfStock = selectedProduct.stock <= 0;
  const avail = selectedProduct.isAvailable !== undefined ? selectedProduct.isAvailable : selectedProduct.is_available;
  const isUnavailable = avail === false || avail === 0 || avail === '0';

  const targetSize = String(selectedSize || selectedProduct.sizes?.[0] || 'M').trim().toUpperCase();
  const selectedSizeStock = selectedProduct.sizeStocks && selectedProduct.sizeStocks[targetSize] !== undefined
    ? Number(selectedProduct.sizeStocks[targetSize])
    : Number(selectedProduct.stock || 0);

  // How many of this product in this selected size are ALREADY in the cart?
  const inCartForSelectedSize = (cart || [])
    .filter(ci => String(ci.product.id) === String(selectedProduct.id) && 
                  String(ci.selectedSize || '').trim().toUpperCase() === targetSize)
    .reduce((s, i) => s + (i.quantity || 0), 0);

  const remainingAddableForSize = Math.max(0, selectedSizeStock - inCartForSelectedSize);
  const isSizeOutOfStock = selectedSizeStock <= 0;
  const isSizeMaxedInCart = !isSizeOutOfStock && remainingAddableForSize === 0;

  // Rating summary & product reviews
  const summary = getProductRatingSummary(selectedProduct.id);
  const productReviews = feedbacks.filter(f => f.productId === selectedProduct.id && (f.status === 'approved' || f.customerId === user?.id));

  const handleAddToCart = () => {
    if (remainingAddableForSize <= 0) return;
    const addQty = Math.min(quantity, remainingAddableForSize);
    addToCart(selectedProduct, targetSize, selectedColor, addQty);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div 
      onClick={() => setSelectedProduct(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row cursor-default"
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="w-full md:w-1/2 p-6 bg-slate-50 dark:bg-zinc-900 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-zinc-800 mb-4 shadow-inner">
              <img 
                src={activeImage} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover transition-all duration-300" 
              />
              {isOutOfStock ? (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1 shadow-md">
                  <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : selectedProduct.stock <= 5 ? (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-black flex items-center gap-1 shadow-md animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" /> Only {selectedProduct.stock} left in stock!
                </span>
              ) : (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                  In Stock ({selectedProduct.stock} available)
                </span>
              )}
              {selectedColor && (
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-extrabold flex items-center gap-2 shadow-lg border border-white/20">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-sm" style={{ backgroundColor: selectedColor.hex }} />
                  <span>Color: {selectedColor.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {selectedProduct.gallery?.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === imgUrl ? 'border-amber-500 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section (Bottom Left - Displays previous customer reviews) */}
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                Customer Reviews ({summary.totalReviews})
              </h4>
              <span className="text-[10px] font-semibold text-slate-400">
                Verified Customer Feedback
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 dark:text-zinc-200">{rev.customerName}</span>
                      <div className="flex items-center gap-1 font-mono text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    {rev.title && <p className="font-bold text-slate-900 dark:text-white text-[11px]">"{rev.title}"</p>}
                    <p className="text-slate-600 dark:text-zinc-300">{rev.comment}</p>
                    
                    {/* Admin Reply */}
                    {rev.adminReply && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-0.5 mt-1">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3" /> Staff Response:
                        </span>
                        <p className="text-slate-700 dark:text-zinc-300 font-medium pl-4">"{rev.adminReply.message}"</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No public customer reviews yet. Be the first to share your experience!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500">
                {selectedProduct.category} Collection
              </span>
              <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{summary.totalReviews > 0 ? summary.averageRating : selectedProduct.rating}</span>
                <span className="text-slate-400 font-normal">({summary.totalReviews > 0 ? summary.totalReviews : selectedProduct.reviewsCount} reviews)</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-wide">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">SKU: {selectedProduct.sku}</p>
            </div>

            {/* Price in LKR */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-amber-500">
                {formatLKR(selectedProduct.price)}
              </span>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Color: <span className="text-amber-500 font-normal">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-2">
                {selectedProduct.colors.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleColorSelect(col, idx)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor.name === col.name ? 'ring-2 ring-amber-500 scale-110 border-white shadow-md' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={`Select ${col.name}`}
                  >
                    {selectedColor.name === col.name && (
                      <Check className={`w-3.5 h-3.5 ${col.hex === '#ffffff' || col.hex === '#fef3c7' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Size
                </label>
                <span className="text-xs font-mono font-bold text-amber-500">
                  Selected: Size {targetSize}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {selectedProduct.sizes.map((sz) => {
                  const szCode = String(sz).trim().toUpperCase();
                  const szStock = selectedProduct.sizeStocks && selectedProduct.sizeStocks[szCode] !== undefined
                    ? Number(selectedProduct.sizeStocks[szCode])
                    : Number(selectedProduct.stock || 0);
                  const szInCart = (cart || [])
                    .filter(ci => String(ci.product.id) === String(selectedProduct.id) && 
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
                      className={`min-w-[64px] px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isSoldOut
                          ? 'opacity-40 bg-slate-100 dark:bg-zinc-900 border-dashed border-slate-300 dark:border-zinc-800 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-amber-500 text-black border-amber-500 shadow-md scale-105 ring-2 ring-amber-400'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-sm font-black">{szCode}</span>
                      <span className={`text-[10px] font-mono font-bold ${
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

              {/* Dynamic Size Stock Status Banner */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500">Size {targetSize} Inventory:</span>
                  <span className={`font-mono font-black ${selectedSizeStock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {selectedSizeStock > 0 ? `${selectedSizeStock} Available` : 'Sold Out'}
                  </span>
                </div>
                {inCartForSelectedSize > 0 ? (
                  <span className="text-[11px] font-bold text-amber-500 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    {inCartForSelectedSize} in cart ({remainingAddableForSize} remaining)
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Ready to add
                  </span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Quantity
                </label>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  remainingAddableForSize === 0
                    ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                    : remainingAddableForSize <= 3 
                    ? 'text-amber-500 bg-amber-500/10 border-amber-500/20 animate-pulse' 
                    : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  {remainingAddableForSize === 0 
                    ? `All ${selectedSizeStock} units of Size ${targetSize} in cart` 
                    : `Can add up to ${remainingAddableForSize} more of Size ${targetSize}`}
                </span>
              </div>
              <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1">
                <button
                  type="button"
                  disabled={quantity <= 1 || remainingAddableForSize === 0}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 font-bold hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm font-mono">
                  {remainingAddableForSize === 0 ? 0 : quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= remainingAddableForSize || remainingAddableForSize === 0}
                  onClick={() => setQuantity(Math.min(remainingAddableForSize, quantity + 1))}
                  className="px-3 py-1 font-bold hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 dark:border-zinc-800 pt-3">
              {selectedProduct.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800 space-y-3">
            {user && user.role !== 'customer' ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-center font-extrabold text-xs uppercase tracking-wider">
                Staff Preview Mode — Purchasing & Cart operations are reserved for Customer accounts.
              </div>
            ) : isUnavailable ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-center font-bold text-sm">
                This clothing item is currently UNAVAILABLE for purchase.
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <button
                    disabled={isOutOfStock || isSizeOutOfStock || isSizeMaxedInCart}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                      isOutOfStock || isSizeOutOfStock
                        ? 'bg-slate-300 dark:bg-zinc-800 text-slate-500 cursor-not-allowed'
                        : isSizeMaxedInCart
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-500 cursor-not-allowed font-mono text-xs'
                        : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock
                      ? 'Out of Stock'
                      : isSizeOutOfStock
                      ? `Size ${targetSize} Sold Out`
                      : isSizeMaxedInCart
                      ? `All ${selectedSizeStock} of Size ${targetSize} In Cart`
                      : `ADD SIZE ${targetSize} TO CART (${quantity})`}
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isWishlisted 
                        ? 'bg-rose-600 text-white border-rose-600' 
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

