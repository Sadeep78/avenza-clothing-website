/**
 * ====================================================================
 * AVENZA CLOTHING STORE - PRODUCT CATALOG COMPONENT
 * File: frontend/src/components/Epic2_ProductInventory/ProductCatalog.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer / All Users (Browse apparel items, filter by size, price, & category)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Displays the main shop catalog grid with multi-filter controls:
 *   1. Category filter (Women, Men, Outerwear, Kids)
 *   2. Real-time search query matching apparel names & descriptions
 *   3. Maximum price range slider (LKR)
 *   4. Size availability filter (XS, S, M, L, XL, XXL)
 *   5. Sorting (Price low-high, high-low, top rating, newest arrivals)
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, Search, Sparkles } from 'lucide-react';

export const ProductCatalog = () => {
  // Extract catalog state and controls from global AppContext
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    priceRange,
    setPriceRange,
    selectedSizeFilter,
    setSelectedSizeFilter,
    sortBy,
    setSortBy,
    formatLKR,
    getProductRatingSummary
  } = useApp();

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = product.price <= priceRange;
    const matchesSize = selectedSizeFilter === 'all' || product.sizes.includes(selectedSizeFilter);

    return matchesCategory && matchesSearch && matchesPrice && matchesSize;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') {
      const ratingA = Number(getProductRatingSummary ? getProductRatingSummary(a.id)?.averageRating : 0) || 0;
      const ratingB = Number(getProductRatingSummary ? getProductRatingSummary(b.id)?.averageRating : 0) || 0;
      return ratingB - ratingA;
    }
    if (sortBy === 'newest') return b.isNew ? -1 : 1;
    return 0;
  });

  return (
    <div id="catalog-section" className="scroll-mt-28 space-y-6 pt-4">
      {/* Quick Category & Gender Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Garments' },
            { id: 'women', label: "Women's Collection" },
            { id: 'men', label: "Men's Collection" },
            { id: 'outerwear', label: 'Coats & Jackets' },
            { id: 'kids', label: 'Kids & Youth' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-carnage tracking-wider uppercase transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md font-black'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          Showing <span className="font-bold text-zinc-900 dark:text-white">{filteredProducts.length}</span> styles
        </div>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        <div className="flex items-center gap-2 text-zinc-800 dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider">
            Refine Collection
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Price Range Slider */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="font-semibold text-zinc-500">Max:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{formatLKR(priceRange)}</span>
            <input 
              type="range" 
              min="2000" 
              max="25000" 
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Size Filter Pills */}
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-500 mr-1">Size:</span>
            {['all', 'XS', 'S', 'M', 'L', 'XL'].map(sz => (
              <button
                key={sz}
                onClick={() => setSelectedSizeFilter(sz)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  selectedSizeFilter === sz
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-500'
                }`}
              >
                {sz.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">Featured First</option>
              <option value="price-asc" className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">Price: High to Low</option>
              <option value="rating" className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">Highest Rated</option>
              <option value="newest" className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">New Arrivals</option>
            </select>
          </div>

        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <Search className="w-12 h-12 text-zinc-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No apparel items found</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1">
            Try adjusting your search query, gender filter or price slider.
          </p>
        </div>
      )}
    </div>
  );
};
