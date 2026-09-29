/**
 * ====================================================================
 * AVENZA CLOTHING STORE - CATEGORY BAR COMPONENT
 * File: frontend/src/components/CategoryBar.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - All Shoppers / Visitors
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Renders category cards showcasing shop departments:
 *   - All Clothing, Women's Clothes, Men's Clothes, Coats & Jackets, Kids & Youth.
 *   - Clicking a category filters the main shop catalog grid instantly.
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const CategoryBar = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveTab } = useApp();

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (setActiveTab) setActiveTab('shop');
    setTimeout(() => {
      const catalogElement = document.getElementById('catalog-section');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-bold block mb-1">
            CURATED DEPARTMENTS
          </span>
          <h2 className="font-carnage text-2xl sm:text-3xl tracking-wider text-zinc-900 dark:text-white uppercase">
            EXPLORE COLLECTIONS
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`font-carnage text-xs tracking-widest uppercase underline underline-offset-4 transition-colors ${
              selectedCategory === 'all'
                ? 'text-amber-500 font-black'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-amber-500'
            }`}
          >
            ALL STYLES
          </button>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`group relative overflow-hidden h-52 rounded-2xl border text-left transition-all duration-300 shadow-sm ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-xl scale-[1.02]'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-400'
              }`}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="font-carnage text-sm tracking-wider block uppercase">
                  {cat.name}
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  {cat.count} ITEMS
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
