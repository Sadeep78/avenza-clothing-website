/**
 * ====================================================================
 * AVENZA CLOTHING STORE - NAVIGATION BAR COMPONENT
 * File: frontend/src/components/Navbar.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer, Administrator, Inventory Staff, Store Manager (Global Navigation)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Sticky top navigation bar providing:
 *   1. Logo & Brand identity.
 *   2. Main section tabs (Shop, My Feedback, My Orders, Admin Dashboard, Users, Inventory).
 *   3. Search bar with instant query filtering.
 *   4. Light / Dark mode theme toggle button (Sun/Moon).
 *   5. Wishlist heart icon button with live counter badge.
 *   6. Shopping bag icon button with live counter badge.
 *   7. Account user profile dropdown menu & login/logout actions.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Heart,
  User, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Truck,
  LogOut,
  AlertTriangle
} from 'lucide-react';

export const Navbar = () => {
  const { 
    theme, 
    toggleTheme, 
    user, 
    logout, 
    cart, 
    setIsCartOpen, 
    wishlist,
    setIsWishlistOpen,
    activeTab, 
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setIsAuthModalOpen,
    systemSettings,
    showToast
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
    <header className="sticky top-0 z-40 w-full bg-white/95 text-zinc-900 border-b border-zinc-200 backdrop-blur-md dark:bg-black dark:text-white dark:border-zinc-900 transition-colors duration-300">
      
      {/* Maintenance Notice Banner */}
      {systemSettings?.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-center text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md">
          <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
          <span>
            SYSTEM MAINTENANCE MODE ACTIVE — GARMENTS CAN BE VIEWED & ADDED TO BAG, BUT PAYMENT & CHECKOUT ARE DISABLED UNTIL <strong>{systemSettings.maintenanceNoticeTime || 'September 15, 2026 at 10:00 AM (SLST)'}</strong>
          </span>
        </div>
      )}

      {/* Announcement Bar */}
      <div className="bg-zinc-100 text-zinc-800 text-[11px] font-carnage tracking-widest py-1.5 px-4 text-center flex items-center justify-between border-b border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800">
        {user?.role === 'admin' ? (
          <>
            <span className="hidden md:block text-amber-600 dark:text-amber-400 font-bold">AVENZA APPAREL • ADMINISTRATOR CONTROL CONSOLE</span>
            <span className="mx-auto md:mx-0 text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM STATUS: ALL SERVICES OPERATIONAL
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              ADMIN: {user.name}
            </span>
          </>
        ) : (
          <>
            <span className="hidden md:block text-zinc-600 dark:text-zinc-400">AVENZA CLOTHING STORE • NEW SEASON 2026</span>
            <span className="mx-auto md:mx-0 font-bold">USE PROMO CODE <strong className="text-amber-600 dark:text-amber-400">SAVE10</strong> FOR Rs. 1,000 OFF</span>
            
            <div className="flex items-center gap-2">
              {user ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {user.role.toUpperCase()}: {user.name}
                </span>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[10px] font-bold uppercase tracking-wider hover:text-amber-500 underline cursor-pointer"
                >
                  SIGN IN
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { 
              if (user?.role === 'admin') {
                setActiveTab('admin-users');
              } else if (user?.role === 'manager') {
                setActiveTab('admin-dashboard');
              } else if (user?.role === 'inventory_staff') {
                setActiveTab('admin-inventory');
              } else {
                setSelectedCategory('all'); 
                setActiveTab('shop'); 
              }
            }}
            className="cursor-pointer flex flex-col group"
          >
            <span className="font-carnage-logo text-2xl sm:text-3xl tracking-[0.25em] text-zinc-950 dark:text-white group-hover:text-amber-500 transition-colors">
              AVENZA
            </span>
            <span className="text-[9px] tracking-[0.3em] text-zinc-500 dark:text-zinc-400 font-semibold uppercase -mt-1 hidden sm:block">
              {user?.role === 'admin' 
                ? 'ADMIN CONSOLE (IAM & GOVERNANCE)' 
                : user?.role === 'manager'
                ? 'MANAGER CONSOLE (OPERATIONS)'
                : user?.role === 'inventory_staff'
                ? 'INVENTORY PORTAL'
                : 'CLOTHING STORE'}
            </span>
          </div>

          {/* Navigation Links */}
          {(user?.role === 'admin' || user?.role === 'inventory_staff' || user?.role === 'manager') ? (
            <nav className="hidden lg:flex items-center gap-6 font-carnage text-xs tracking-[0.15em]">
              {/* ADMIN NAVIGATION (Epic E1: User & System Administration) */}
              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('admin-users')}
                    className={`hover:text-amber-500 transition-colors ${
                      activeTab === 'admin-users' 
                        ? 'border-b-2 border-zinc-950 dark:border-amber-500 text-zinc-950 dark:text-amber-500 font-black' 
                        : 'text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    USERS & ACCESS (IAM)
                  </button>

                  <button
                    onClick={() => setActiveTab('admin-settings')}
                    className={`hover:text-amber-500 transition-colors ${
                      activeTab === 'admin-settings' 
                        ? 'border-b-2 border-zinc-950 dark:border-amber-500 text-zinc-950 dark:text-amber-500 font-black' 
                        : 'text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    SYSTEM SETTINGS
                  </button>

                  <button
                    onClick={() => setActiveTab('admin-audit-logs')}
                    className={`hover:text-amber-500 transition-colors ${
                      activeTab === 'admin-audit-logs' 
                        ? 'border-b-2 border-zinc-950 dark:border-amber-500 text-zinc-950 dark:text-amber-500 font-black' 
                        : 'text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    SECURITY AUDIT LOGS
                  </button>
                </>
              )}

              {/* MANAGER NAVIGATION (Epic E4: Delivery, Feedback, Reports) */}
              {user?.role === 'manager' && (
                <>
                  <button
                    onClick={() => setActiveTab('admin-dashboard')}
                    className={`hover:text-amber-500 transition-colors ${
                      activeTab === 'admin-dashboard' 
                        ? 'border-b-2 border-zinc-950 dark:border-amber-500 text-zinc-950 dark:text-amber-500 font-black' 
                        : 'text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    DASHBOARD
                  </button>

                  <button
                    onClick={() => setActiveTab('admin-orders')}
                    className={`hover:text-amber-500 transition-colors ${
                      activeTab === 'admin-orders' 
                        ? 'border-b-2 border-zinc-950 dark:border-amber-500 text-zinc-950 dark:text-amber-500 font-black' 
                        : 'text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    DELIVERY & ORDERS
                  </button>

                  <button
                    onClick={() => setActiveTab('admin-feedback')}
                    className={`hover:text-amber-500 transition-colors ${
                      activeTab === 'admin-feedback' 
                        ? 'border-b-2 border-zinc-950 dark:border-amber-500 text-zinc-950 dark:text-amber-500 font-black' 
                        : 'text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    CUSTOMER FEEDBACK
                  </button>
                </>
              )}

              {/* INVENTORY STAFF NAVIGATION */}
              {user?.role === 'inventory_staff' && (
                <button
                  onClick={() => setActiveTab('admin-inventory')}
                  className={`hover:text-amber-500 transition-colors ${
                    activeTab === 'admin-inventory' 
                      ? 'border-b-2 border-zinc-950 dark:border-amber-500 text-zinc-950 dark:text-amber-500 font-black' 
                      : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  STOCK & INVENTORY
                </button>
              )}

              <button
                onClick={() => setActiveTab('shop')}
                className={`hover:text-amber-500 transition-colors text-zinc-500 dark:text-zinc-400 ${
                  activeTab === 'shop' ? 'border-b-2 border-zinc-950 dark:border-white font-bold' : ''
                }`}
                title="Preview Customer Storefront"
              >
                STOREFRONT ↗
              </button>
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-7 font-carnage text-xs tracking-[0.18em]">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`hover:text-amber-500 transition-colors ${
                  selectedCategory === 'all' && activeTab === 'shop' 
                    ? 'border-b-2 border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-black' 
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                ALL CLOTHING
              </button>

              <button
                onClick={() => handleCategoryClick('women')}
                className={`hover:text-amber-500 transition-colors ${
                  selectedCategory === 'women' && activeTab === 'shop' 
                    ? 'border-b-2 border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-black' 
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                WOMEN
              </button>
              
              <button
                onClick={() => handleCategoryClick('men')}
                className={`hover:text-amber-500 transition-colors ${
                  selectedCategory === 'men' && activeTab === 'shop' 
                    ? 'border-b-2 border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-black' 
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                MEN
              </button>

              <button
                onClick={() => handleCategoryClick('outerwear')}
                className={`hover:text-amber-500 transition-colors ${
                  selectedCategory === 'outerwear' && activeTab === 'shop' 
                    ? 'border-b-2 border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-black' 
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                COATS & JACKETS
              </button>

              <button
                onClick={() => handleCategoryClick('kids')}
                className={`hover:text-amber-500 transition-colors ${
                  selectedCategory === 'kids' && activeTab === 'shop' 
                    ? 'border-b-2 border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-black' 
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                KIDS
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    showToast('Please sign in to view and track your orders 🚚', 'info');
                    setIsAuthModalOpen(true);
                  }
                  setActiveTab('orders');
                }}
                className={`hover:text-amber-500 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'orders' 
                    ? 'border-b-2 border-amber-500 text-amber-500 font-bold' 
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                <span>TRACK ORDER</span>
              </button>
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-5">
            {user?.role !== 'admin' && (
              <div className="relative">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 text-zinc-700 hover:text-amber-500 dark:text-white transition-colors cursor-pointer"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-72 p-2 bg-white text-zinc-900 border border-zinc-200 rounded-xl shadow-2xl z-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white">
                    <input
                      type="text"
                      placeholder="Search tees, hoodies, suits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 text-xs text-zinc-900 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-500 dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-zinc-700 hover:text-amber-500 dark:text-white transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
            </button>

            {/* User Account */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }
                }}
                className="p-1.5 text-zinc-700 hover:text-amber-500 dark:text-white transition-colors cursor-pointer"
                title={user ? user.name : 'Sign In'}
              >
                <User className="w-5 h-5" />
              </button>

              {user && isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white text-zinc-900 border border-zinc-200 p-3 shadow-2xl z-50 text-xs space-y-1 rounded-2xl dark:bg-zinc-950 dark:border-zinc-800 dark:text-white"
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">
                      {user.role === 'admin' ? 'Administrator Account' : 'Account'}
                    </p>
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">{user.email}</p>
                  </div>

                  {user.role === 'admin' ? (
                    <>
                      <button
                        onClick={() => { setActiveTab('admin-users'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg text-amber-500"
                      >
                        👥 Users & Role IAM
                      </button>
                      <button
                        onClick={() => { setActiveTab('admin-settings'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg"
                      >
                        ⚙️ System Settings & Maintenance
                      </button>
                      <button
                        onClick={() => { setActiveTab('admin-audit-logs'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg"
                      >
                        🛡️ Security Audit Logs
                      </button>
                      <button
                        onClick={() => { setActiveTab('profile'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-zinc-500 rounded-lg"
                      >
                        👤 Admin Profile
                      </button>
                    </>
                  ) : user.role === 'manager' ? (
                    <>
                      <button
                        onClick={() => { setActiveTab('admin-dashboard'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg text-amber-500"
                      >
                        📊 Store Dashboard
                      </button>
                      <button
                        onClick={() => { setActiveTab('admin-orders'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg"
                      >
                        🚚 Delivery & Orders
                      </button>
                      <button
                        onClick={() => { setActiveTab('admin-feedback'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg"
                      >
                        💬 Feedback Reviews
                      </button>
                      <button
                        onClick={() => { setActiveTab('profile'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-zinc-500 rounded-lg"
                      >
                        👤 Account Info
                      </button>
                    </>
                  ) : user.role === 'inventory_staff' ? (
                    <>
                      <button
                        onClick={() => { setActiveTab('admin-inventory'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg text-amber-500"
                      >
                        📦 Stock & Inventory
                      </button>
                      <button
                        onClick={() => { setActiveTab('profile'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-zinc-500 rounded-lg"
                      >
                        👤 Account Info
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setActiveTab('profile'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg"
                      >
                        👤 Account Info
                      </button>
                      <button
                        onClick={() => { setActiveTab('orders'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg"
                      >
                        🚚 Track Orders
                      </button>
                      <button
                        onClick={() => { setActiveTab('my-feedback'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg text-amber-500"
                      >
                        ⭐ My Reviews & Feedback
                      </button>
                      <button
                        onClick={() => { setIsWishlistOpen(true); setIsUserDropdownOpen(false); }}
                        className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-lg text-rose-500 flex items-center justify-between"
                      >
                        <span>❤️ Saved Favorites / Wishlist</span>
                        {wishlist.length > 0 && <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-[10px] font-mono font-bold">{wishlist.length}</span>}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => { logout(); setIsUserDropdownOpen(false); }}
                    className="w-full text-left p-2 text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 mt-2 font-bold flex items-center gap-1.5 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Favorites - Customer Only */}
            {(!user || user?.role === 'customer') && (
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-1.5 text-zinc-700 hover:text-rose-500 dark:text-white transition-colors cursor-pointer"
                title="View Saved Favorites / Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Shopping Bag - Customer Only */}
            {(!user || user?.role === 'customer') && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-zinc-700 hover:text-amber-500 dark:text-white transition-colors cursor-pointer"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black font-black text-[10px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-zinc-700 dark:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black space-y-3 font-carnage text-sm tracking-wider">
          {user?.role === 'admin' ? (
            <>
              <button onClick={() => { setActiveTab('admin-dashboard'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-amber-500 font-bold">📊 DASHBOARD</button>
              <button onClick={() => { setActiveTab('admin-inventory'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">📦 STOCK & INVENTORY</button>
              <button onClick={() => { setActiveTab('admin-orders'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">🚚 CUSTOMER ORDERS</button>
              <button onClick={() => { setActiveTab('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-zinc-400">VIEW STOREFRONT ↗</button>
            </>
          ) : user?.role === 'manager' ? (
            <>
              <button onClick={() => { setActiveTab('admin-dashboard'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-amber-500 font-bold">📊 DASHBOARD</button>
              <button onClick={() => { setActiveTab('admin-orders'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">🚚 DELIVERY & ORDERS</button>
              <button onClick={() => { setActiveTab('admin-feedback'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">💬 CUSTOMER FEEDBACK</button>
              <button onClick={() => { setActiveTab('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-zinc-400">VIEW STOREFRONT ↗</button>
            </>
          ) : user?.role === 'inventory_staff' ? (
            <>
              <button onClick={() => { setActiveTab('admin-inventory'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-amber-500 font-bold">📦 STOCK & INVENTORY</button>
              <button onClick={() => { setActiveTab('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-zinc-400">VIEW STOREFRONT ↗</button>
            </>
          ) : (
            <>
              <button onClick={() => { handleCategoryClick('all'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">ALL CLOTHING</button>
              <button onClick={() => { handleCategoryClick('women'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">WOMEN</button>
              <button onClick={() => { handleCategoryClick('men'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">MEN</button>
              <button onClick={() => { handleCategoryClick('outerwear'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">COATS & JACKETS</button>
              <button onClick={() => { handleCategoryClick('kids'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">KIDS</button>
              <button 
                onClick={() => { 
                  if (!user) {
                    showToast('Please sign in to view and track your orders 🚚', 'info');
                    setIsAuthModalOpen(true);
                  }
                  setActiveTab('orders'); 
                  setIsMobileMenuOpen(false); 
                }} 
                className="block w-full text-left text-amber-500 py-1 font-bold"
              >
                🚚 TRACK ORDER
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
