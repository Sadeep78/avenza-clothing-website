/**
 * ====================================================================
 * AVENZA CLOTHING STORE - HERO BANNER COMPONENT
 * File: frontend/src/components/BannerHero.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - All Shoppers / Visitors
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Main storefront promotional hero banner:
 *   1. Feature collection highlights (New Apparel Arrivals, Trending Outfits).
 *   2. Quick category jump buttons (Women's Silk & Blazers, Men's Compression & Chinos, Kids).
 *   3. Value proposition badges (Free Islandwide Delivery, 100% Premium Fabric Guarantee).
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react';

export const BannerHero = () => {
  const { setSelectedCategory, setActiveTab } = useApp();

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setActiveTab('shop');
    setTimeout(() => {
      const catalogElement = document.getElementById('catalog-section');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="relative w-full mb-12 overflow-hidden">
      {/* Top Editorial Headline Banner */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spring / Summer 2026 Runway & Lifestyle Edit</span>
        </div>

        <h1 className="font-carnage text-4xl sm:text-6xl lg:text-7xl tracking-tight text-zinc-900 dark:text-white uppercase">
          DEFINING MODERN ELEGANCE
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium tracking-wide">
          Curated luxury fashion for men and women. Crafted with premium European textiles, tailored fits, and timeless aesthetic precision.
        </p>
      </div>

      {/* Men & Women Dual Editorial Model Showcase */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* MEN'S MODEL HERO CARD */}
          <div 
            onClick={() => handleSelectCategory('men')}
            className="group relative h-[520px] sm:h-[600px] lg:h-[660px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg cursor-pointer bg-zinc-100 dark:bg-zinc-900 transition-all duration-500 hover:shadow-2xl"
          >
            {/* Background Model Image */}
            <img 
              src="/men_model_hero.jpg" 
              alt="Avenza Men's Fashion Model" 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

            {/* Top Tag */}
            <div className="absolute top-6 left-6 z-10">
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-carnage tracking-widest uppercase bg-white/90 text-black backdrop-blur-md shadow-md">
                MEN'S COLLECTION
              </span>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute bottom-6 left-6 right-6 z-10 text-white space-y-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
                AUTUMN / WINTER & ACTIVE STREETWEAR
              </span>

              <h2 className="font-carnage text-2xl sm:text-4xl tracking-tight text-white uppercase leading-tight">
                CONTEMPORARY MEN'S TAILORING
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-md line-clamp-2">
                Structured blazers, classic Oxford shirts, compression activewear & tailored stretch chinos.
              </p>

              <div className="pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('men');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs tracking-wider uppercase shadow-xl hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  <span>EXPLORE MENSWEAR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* WOMEN'S MODEL HERO CARD */}
          <div 
            onClick={() => handleSelectCategory('women')}
            className="group relative h-[520px] sm:h-[600px] lg:h-[660px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg cursor-pointer bg-zinc-100 dark:bg-zinc-900 transition-all duration-500 hover:shadow-2xl"
          >
            {/* Background Model Image */}
            <img 
              src="/women_model_hero.jpg" 
              alt="Avenza Women's Fashion Model" 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

            {/* Top Tag */}
            <div className="absolute top-6 left-6 z-10">
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-carnage tracking-widest uppercase bg-amber-400 text-black backdrop-blur-md shadow-md font-black">
                WOMEN'S RUNWAY EDIT
              </span>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute bottom-6 left-6 right-6 z-10 text-white space-y-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
                COUTURE & MINIMALIST SILHOUETTES
              </span>

              <h2 className="font-carnage text-2xl sm:text-4xl tracking-tight text-white uppercase leading-tight">
                ELEGANT WOMEN'S COUTURE
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-md line-clamp-2">
                Cashmere-blend trench coats, pure silk evening dresses, high-waist trousers & sophisticated blazers.
              </p>

              <div className="pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('women');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase shadow-xl hover:bg-white transition-colors cursor-pointer"
                >
                  <span>EXPLORE WOMENSWEAR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Brand Value Propositions Bar */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-800 dark:text-zinc-200">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Free Islandwide Delivery</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">On all orders above Rs. 15,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Original Designer Quality</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Certified premium garment craftsmanship</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Hassle-Free Exchanges</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">14-day sizing & fitting returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Secure LKR Checkout</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Visa, Mastercard & Cash on Delivery</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
