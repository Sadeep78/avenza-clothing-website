/**
 * ====================================================================
 * AVENZA CLOTHING STORE - FOOTER COMPONENT
 * File: frontend/src/components/Footer.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - All Users / Visitors
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Bottom page footer section:
 *   1. Brand identity, copyright info, and islandwide delivery guarantee.
 *   2. Fast collection shortcuts (Women's, Men's, Outerwear, Kids).
 *   3. Customer service links and newsletter subscription.
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setSelectedCategory, setActiveTab } = useApp();

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setActiveTab('shop');
    setTimeout(() => {
      const catalogElement = document.getElementById('catalog-section');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <footer className="mt-20 border-t border-zinc-200 bg-zinc-100 text-zinc-800 dark:bg-black dark:text-white dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Logo & Mission */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-carnage-logo text-xl tracking-[0.25em] block text-zinc-950 dark:text-white">
              AVENZA CLOTHING STORE
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Premium apparel & fashion lifestyle clothing designed for style, comfort, and elegance.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-carnage text-xs italic tracking-wider text-zinc-950 dark:text-white mb-3">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium uppercase tracking-wider">
              <li>
                <button onClick={() => handleCategoryClick('men')} className="hover:text-amber-600 dark:hover:text-white transition-colors cursor-pointer">
                  Men's Clothing
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('women')} className="hover:text-amber-600 dark:hover:text-white transition-colors cursor-pointer">
                  Women's Clothing
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('outerwear')} className="hover:text-amber-600 dark:hover:text-white transition-colors cursor-pointer">
                  Coats & Jackets
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('kids')} className="hover:text-amber-600 dark:hover:text-white transition-colors cursor-pointer">
                  Kids & Youth
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-carnage text-xs italic tracking-wider text-zinc-950 dark:text-white mb-3">
              CUSTOMER CARE
            </h4>
            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
              <p>Hotline: +94 11 234 5678</p>
              <p>Support: support@avenza.com</p>
              <p>Location: Colombo, Sri Lanka</p>
              <p>Hours: Mon - Sat (9:00 AM - 7:00 PM)</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-carnage text-xs italic tracking-wider text-zinc-950 dark:text-white mb-3">
              JOIN THE MOVEMENT
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">Subscribe for exclusive collection drops & restock announcements.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 bg-white border border-zinc-300 text-xs text-zinc-900 placeholder:text-zinc-400 rounded-lg focus:outline-none focus:border-amber-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />
              <button className="px-4 py-2 bg-zinc-950 text-white dark:bg-white dark:text-black font-carnage text-xs tracking-wider uppercase rounded-lg hover:bg-amber-500 hover:text-black transition-colors cursor-pointer">
                JOIN
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-sans">
          <p>© 2026 Avenza Clothing Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
