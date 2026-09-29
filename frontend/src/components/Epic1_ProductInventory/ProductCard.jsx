/**
 * ====================================================================
 * AVENZA CLOTHING STORE - PRODUCT CARD COMPONENT
 * File: frontend/src/components/Epic1_ProductInventory/ProductCard.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer / All Users (View cloth card, switch color swatches, toggle wishlist)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Renders individual clothing product cards on the shop grid with:
 *   1. Image thumbnail with interactive color swatch preview dots.
 *   2. Wishlist heart toggle button.
 *   3. Sale discount badge (-% OFF), New Arrival badge, and Availability badge.
 *   4. Price formatted in LKR (Rs. X.XX).
 *   5. Click handler opening the Product Detail Modal with the chosen color active.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Star, Heart } from 'lucide-react';

const FALLBACK_CLOTHES_IMAGE = 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80';

export const ProductCard = ({ product }) => {
  const { 
    setSelectedProduct, 
    toggleWishlist, 
    wishlist, 
    formatLKR,
    user
  } = useApp();

  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(product.colors?.[0] || null);
  const [activeImage, setActiveImage] = useState(product.colors?.[0]?.image || product.image);

  const isWishlisted = wishlist.includes(product.id);
  const avail = product.isAvailable !== undefined ? product.isAvailable : product.is_available;
  const isUnavailable = avail === false || avail === 0 || avail === '0';
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_CLOTHES_IMAGE;
  };

  const handleOpenAddToCart = () => {
    const productWithColor = {
      ...product,
      colors: activeColor 
        ? [activeColor, ...product.colors.filter(c => c.name !== activeColor.name)]
        : product.colors
    };
    setSelectedProduct(productWithColor);
  };

  return (
    <div 
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cloth Image Thumbnail - Clicking opens the Add To Cart options */}
      <div 
        onClick={handleOpenAddToCart}
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer select-none"
        title="Click cloth to choose size & add to cart"
      >
        <img
          src={activeImage || product.image || FALLBACK_CLOTHES_IMAGE}
          alt={product.name}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-108' : 'scale-100'
          }`}
        />

        {/* Dark subtle overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isUnavailable ? (
            <span className="px-2.5 py-1 rounded text-[10px] font-carnage tracking-wider bg-rose-600 text-white shadow-lg font-black">
              UNAVAILABLE
            </span>
          ) : (
            <>
              {product.isNew && (
                <span className="px-2.5 py-1 rounded text-[10px] font-carnage tracking-wider bg-amber-500 text-black shadow-lg font-black">
                  NEW ARRIVAL
                </span>
              )}

              {discountPercent > 0 && (
                <span className="px-2.5 py-1 rounded text-[10px] font-carnage tracking-wider bg-rose-600 text-white shadow-lg font-bold">
                  -{discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full z-20 transition-all duration-300 cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-600 text-white scale-110 shadow-lg' 
              : 'bg-white/80 dark:bg-black/60 backdrop-blur-md text-zinc-900 dark:text-white hover:bg-rose-600 hover:text-white shadow-sm'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Active Color Pill Badge */}
        {activeColor && (
          <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1.5 border border-white/20 shadow-md group-hover:opacity-0 transition-opacity">
            <span className="w-2.5 h-2.5 rounded-full border border-white/80" style={{ backgroundColor: activeColor.hex }} />
            <span>{activeColor.name}</span>
          </div>
        )}

        {/* Add to Cart Overlay on Image Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex justify-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className={`w-full py-2.5 px-3 rounded-xl font-carnage text-xs flex items-center justify-center gap-2 shadow-2xl tracking-wider font-black ${
            isUnavailable 
              ? 'bg-rose-600 text-white cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-400 text-black'
          }`}>
            <ShoppingBag className="w-4 h-4 text-current" />
            <span>
              {user && user.role !== 'customer'
                ? 'CLICK TO VIEW DETAILS'
                : isUnavailable 
                ? 'ITEM UNAVAILABLE' 
                : isOutOfStock 
                ? 'OUT OF STOCK' 
                : 'CLICK TO ADD TO CART'}
            </span>
          </div>
        </div>
      </div>

      {/* Product Information Body */}
      <div 
        onClick={handleOpenAddToCart}
        className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 cursor-pointer"
        title="Click cloth to choose size & add to cart"
      >
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
            <span className="uppercase font-carnage text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-carnage text-sm sm:text-base line-clamp-1 text-zinc-900 dark:text-white hover:text-amber-500 transition-colors">
            {product.name}
          </h3>

          {/* Interactive Color Swatch Dots on Card */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1.5">
              {product.colors.map((col, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColor(col);
                    setActiveImage(col.image || product.gallery?.[idx] || product.image);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-zinc-700 transition-transform cursor-pointer ${
                    activeColor?.name === col.name ? 'scale-125 ring-2 ring-amber-500 shadow-sm' : 'hover:scale-110 opacity-70'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={`Preview ${col.name}`}
                />
              ))}
              <span className="text-[10px] text-slate-400 font-mono ml-1">{activeColor?.name}</span>
            </div>
          )}

          {/* Pricing in LKR */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
              {formatLKR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through font-mono">
                {formatLKR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Sizes and Stock Status Bar */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="text-zinc-400 uppercase font-bold">Sizes:</span>
            <span className="text-zinc-700 dark:text-zinc-300">{product.sizes?.slice(0, 4).join(', ')}{product.sizes?.length > 4 ? '...' : ''}</span>
          </div>

          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded font-black uppercase text-[10px] bg-rose-500/15 text-rose-500 border border-rose-500/30">Out of Stock</span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded font-black uppercase text-[10px] bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse">Low Stock</span>
          ) : (
            <span className="px-2 py-0.5 rounded font-black uppercase text-[10px] bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">In Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};
