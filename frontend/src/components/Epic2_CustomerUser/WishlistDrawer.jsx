/**
 * ====================================================================
 * AVENZA CLOTHING STORE - WISHLIST / FAVORITES DRAWER COMPONENT
 * File: frontend/src/components/Epic2_CustomerUser/WishlistDrawer.jsx
 * 
 * 📌 USER STORY COVERED:
 *   - Favorites & Saved Wishlist Management
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer (Views, manages, and transfers saved favorites to shopping cart)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Slide-over favorites drawer displaying customer's saved clothing items:
 *   1. List of saved products with thumbnail, name, category, & LKR price.
 *   2. Stock status badge (In Stock / Out of Stock).
 *   3. "Add to Cart" individual button and "Move All Items to Cart" batch action.
 *   4. Delete/Remove from wishlist button.
 *   5. Backdrop click-outside dismissal.
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    products, 
    addToCart, 
    setIsCartOpen, 
    formatLKR,
    showToast,
    setSelectedProduct
  } = useApp();

  if (!isWishlistOpen) return null;

  // Resolve full product objects for all favorited IDs
  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  /**
   * Transfer single favorited item to cart
   * Target Role: Customer
   */
  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || { name: 'Default', hex: '#000000' }, 1);
    showToast(`"${product.name}" added to your cart! 🛒`, 'success');
  };

  /**
   * Transfer all favorited items to shopping cart
   * Target Role: Customer
   */
  const handleAddAllToCart = () => {
    favoritedProducts.forEach(product => {
      if (product.stock > 0 && product.isAvailable !== false) {
        addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || { name: 'Default', hex: '#000000' }, 1);
      }
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast(`All available favorite items moved to shopping cart! 🛒`, 'success');
  };

  return (
    <div 
      onClick={() => setIsWishlistOpen(false)}
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between cursor-default"
        >
          
          {/* DRAWER HEADER */}
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                  My Saved Favorites ({favoritedProducts.length})
                </h3>
                <p className="text-[11px] text-slate-400">Items you've heart-saved for later</p>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Close Wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FAVORITES ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favoritedProducts.length > 0 ? (
              favoritedProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isUnavailable = product.isAvailable === false;

                return (
                  <div 
                    key={product.id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 relative group transition-all hover:border-rose-500/50"
                  >
                    {/* Thumbnail Image */}
                    <div 
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setSelectedProduct(product);
                      }}
                      className="w-20 h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0 cursor-pointer"
                      title="View product details"
                    >
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase text-rose-500">
                            {product.category}
                          </span>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setSelectedProduct(product);
                          }}
                          className="font-bold text-xs truncate uppercase hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <p className="text-xs font-mono font-extrabold text-amber-500 mt-1">
                          {formatLKR(product.price)}
                        </p>
                      </div>

                      {/* Add to Cart Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-zinc-800">
                        {isUnavailable ? (
                          <span className="text-[10px] text-rose-500 font-bold">UNAVAILABLE</span>
                        ) : isOutOfStock ? (
                          <span className="text-[10px] text-slate-400 font-bold">OUT OF STOCK</span>
                        ) : (
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Add to Cart
                          </button>
                        )}

                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty Wishlist Graphic */
              <div className="text-center py-20 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto animate-pulse">
                  <Heart className="w-8 h-8 fill-rose-500" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Your Wishlist is Empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Click the heart icon on any clothing item in our store to save your favorite apparel here!
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  Explore Apparel Catalog
                </button>
              </div>
            )}
          </div>

          {/* DRAWER FOOTER ACTION */}
          {favoritedProducts.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 space-y-3">
              <button
                onClick={handleAddAllToCart}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Move All ({favoritedProducts.length}) to Shopping Cart
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
