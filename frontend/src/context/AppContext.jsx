import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, MOCK_USERS, INITIAL_ORDERS, CATEGORIES, INITIAL_SETTINGS } from '../data/mockData';
import { apiService } from '../services/api';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// Central LKR currency formatter
export const formatLKR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0.00';
  return `Rs. ${Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper to guarantee every product has clean per-size stocks (S, M, L, XL, XXL)
export const ensureProductSizeStocks = (p) => {
  if (!p) return p;
  const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'];
  const defaultDist = { 'XS': 6, 'S': 12, 'M': 15, 'L': 10, 'XL': 8, 'XXL': 5 };
  const currentMap = { ...(p.sizeStocks || {}) };
  sizes.forEach(sz => {
    const cleanSz = String(sz).trim().toUpperCase();
    if (currentMap[cleanSz] === undefined) {
      currentMap[cleanSz] = defaultDist[cleanSz] !== undefined ? defaultDist[cleanSz] : Math.max(1, Math.floor((p.stock || 20) / sizes.length));
    } else {
      currentMap[cleanSz] = Number(currentMap[cleanSz]);
    }
  });
  const totalStock = Object.values(currentMap).reduce((a, b) => a + Number(b), 0);
  return {
    ...p,
    sizes,
    sizeStocks: currentMap,
    stock: totalStock || Number(p.stock || 0),
    isAvailable: (totalStock > 0 || Number(p.stock || 0) > 0) && p.isAvailable !== false
  };
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('avenza_theme_mode');
    return saved || 'light';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('avenza_user') || localStorage.getItem('achinis_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name) {
        parsed.name = parsed.name.replace(/\s*\([^)]*\)/g, '').trim();
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(35000);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('avenza_cart') || localStorage.getItem('achinis_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('avenza_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Initialize with full 22-item catalog, ensuring all styles are loaded immediately
  const [products, setProducts] = useState(() => {
    return INITIAL_PRODUCTS.map(p => ensureProductSizeStocks({ ...p, isAvailable: p.isAvailable ?? true }));
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('avenza_orders') || localStorage.getItem('achinis_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem('avenza_registered_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  // Master Users List combining default mock users + registered users (AVE-06, AVE-07, AVE-08)
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('avenza_all_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_USERS;
  });

  // System Settings state (AVE-10)
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('avenza_system_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SETTINGS;
  });

  // Customer Feedbacks & Ratings State (AVE-22, AVE-25)
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('avenza_feedbacks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'fb-101',
        customerId: 'user-cust-01',
        customerName: 'Sasanka Perera',
        customerEmail: 'customer@avenza.com',
        productId: 'prod-m1',
        productName: 'Apex Pro Performance Compression Tee',
        orderId: 'ACH-99420',
        rating: 5,
        title: 'Outstanding Quality & Fit!',
        comment: 'The compression tee fabric is extremely breathable and comfortable during high-intensity gym sessions. Highly recommended!',
        status: 'approved',
        adminReply: {
          message: 'Thank you Sasanka! We take pride in delivering top-tier performance activewear.',
          repliedAt: '2026-08-12T10:30:00Z',
          repliedBy: 'Project Admin'
        },
        createdAt: '2026-08-11T14:20:00.000Z',
        updatedAt: '2026-08-12T10:30:00.000Z'
      },
      {
        id: 'fb-102',
        customerId: 'user-cust-02',
        customerName: 'Nipuni Fernando',
        customerEmail: 'nipuni@gmail.com',
        productId: 'prod-w1',
        productName: 'Silk Cascade Midi Wrap Dress',
        orderId: null,
        rating: 4,
        title: 'Elegant silk dress',
        comment: 'Fit was almost perfect. The emerald green color shines beautifully under evening lights.',
        status: 'approved',
        adminReply: null,
        createdAt: '2026-08-10T09:15:00.000Z',
        updatedAt: '2026-08-10T09:15:00.000Z'
      }
    ];
  });

  // System Activity Logs & Audit Trails (AVE-16)
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('avenza_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'log-101',
        timestamp: '2026-09-20 10:15:30',
        category: 'MAINTENANCE',
        action: 'Maintenance Mode Toggled',
        target: 'System Operational Status',
        performedBy: 'Sasanka P.B.S (admin)',
        severity: 'WARNING',
        details: 'Maintenance mode updated; customer checkout operations set to normal active status.',
        ipAddress: '192.168.1.105'
      },
      {
        id: 'log-102',
        timestamp: '2026-09-20 09:42:10',
        category: 'CREDENTIALS',
        action: 'Password Policy Reset',
        target: 'Kamal Silva (staff@avenza.com)',
        performedBy: 'Sasanka P.B.S (admin)',
        severity: 'SECURITY',
        details: 'Administrator generated one-time temporary recovery password for staff account.',
        ipAddress: '192.168.1.105'
      },
      {
        id: 'log-103',
        timestamp: '2026-09-20 08:30:45',
        category: 'IAM',
        action: 'Internal User Onboarding',
        target: 'Nimali Jayasinghe (manager@avenza.com)',
        performedBy: 'Sasanka P.B.S (admin)',
        severity: 'SUCCESS',
        details: 'Assigned role: Store Manager with delivery dispatch and customer feedback permissions.',
        ipAddress: '192.168.1.105'
      },
      {
        id: 'log-104',
        timestamp: '2026-09-19 22:15:00',
        category: 'SETTINGS',
        action: 'System Parameters Modified',
        target: 'Store Currency & Tax Settings',
        performedBy: 'Sasanka P.B.S (admin)',
        severity: 'INFO',
        details: 'Verified financial parameters: Currency LKR, Tax 8%, COD Advance LKR 500.',
        ipAddress: '192.168.1.105'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('avenza_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {}
  }, [auditLogs]);

  // Feedback Modal Configuration State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null); // { type: 'product'|'order'|'edit', id, name, initialData }

  // Standalone Payment Success Modal State
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState(null);

  const [toast, setToast] = useState(null);


  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('avenza_theme_mode', theme);
    localStorage.setItem('avenza_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('avenza_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('avenza_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('avenza_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('avenza_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('avenza_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('avenza_registered_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    localStorage.setItem('avenza_all_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('avenza_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('avenza_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Load products, feedbacks & orders from backend SQL API on mount
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const dbProducts = await apiService.getProducts();
        if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
          const merged = dbProducts.map(dp => {
            const initP = INITIAL_PRODUCTS.find(p => p.id === dp.id) || {};
            return ensureProductSizeStocks({
              ...initP,
              ...dp,
              price: Number(dp.price ?? initP.price ?? 5000),
              stock: Number(dp.stock ?? initP.stock ?? 10),
              sizeStocks: dp.sizeStocks || initP.sizeStocks,
              sizes: dp.sizes && dp.sizes.length > 0 ? dp.sizes : (initP.sizes || ['S', 'M', 'L']),
              colors: dp.colors && dp.colors.length > 0 ? dp.colors : (initP.colors || [{ name: 'Default', hex: '#000000' }]),
              image: dp.image || initP.image,
              gallery: initP.gallery || (dp.image ? [dp.image] : []),
              isAvailable: dp.stock <= 0 ? false : (dp.isAvailable !== undefined ? Boolean(dp.isAvailable) : true),
              category: dp.category || initP.category || 'men',
              name: dp.name || initP.name
            });
          });
          setProducts(merged);
        }
      } catch (err) {
        console.warn('Could not sync products from SQL Server:', err);
      }
    };
    const fetchApiFeedbacks = async () => {
      const data = await apiService.getFeedbacks();
      if (data && Array.isArray(data) && data.length > 0) {
        setFeedbacks(data);
      }
    };
    const fetchApiOrders = async () => {
      const data = await apiService.getOrders();
      if (data && Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    };
    const fetchApiUsers = async () => {
      try {
        const dbUsers = await apiService.getUsers();
        if (dbUsers && Array.isArray(dbUsers) && dbUsers.length > 0) {
          setUsersList(dbUsers);
        }
      } catch (e) {}
    };
    fetchApiProducts();
    fetchApiFeedbacks();
    fetchApiOrders();
    fetchApiUsers();
  }, []);

  // Open feedback modal with specified config
  const openFeedbackModal = (config) => {
    if (!user) {
      showToast('Please sign in to submit feedback or ratings 🔒', 'warning');
      setIsAuthModalOpen(true);
      return;
    }
    setFeedbackTarget(config);
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setFeedbackTarget(null);
  };

  // Submit feedback helper (Validates that customer has a Delivered order)
  const submitCustomerFeedback = async (payload) => {
    // Validate Delivered Order Condition (Target Role: Customer)
    if (user?.role !== 'admin') {
      const hasDeliveredOrder = orders.some(o => 
        (o.email === user?.email || o.userId === user?.id) &&
        o.status === 'Delivered' &&
        (!payload.orderId || o.id === payload.orderId)
      );

      if (!hasDeliveredOrder) {
        showToast('Reviews can only be submitted after receiving your order (Order status must be "Delivered") 🚚', 'warning');
        return;
      }
    }

    const newEntry = {
      id: `fb-${Date.now()}`,
      customerId: user?.id || 'guest-01',
      customerName: user?.name || 'Valued Customer',
      customerEmail: user?.email || 'customer@avenza.com',
      productId: payload.productId || null,
      productName: payload.productName || null,
      orderId: payload.orderId || null,
      rating: Number(payload.rating),
      title: (payload.title || '').trim(),
      comment: payload.comment.trim(),
      status: 'approved',
      adminReply: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFeedbacks(prev => [newEntry, ...prev]);
    closeFeedbackModal();
    showToast('Thank you! Your review for your delivered order has been submitted successfully ⭐', 'success');

    // Sync backend
    await apiService.submitFeedback(newEntry);
  };

  // Edit feedback helper (with 7-day restriction check)
  const editCustomerFeedback = async (feedbackId, updatedData) => {
    const target = feedbacks.find(f => f.id === feedbackId);
    if (!target) return;

    const createdDate = new Date(target.createdAt);
    const daysDiff = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
    if (daysDiff > 7) {
      showToast('Feedback cannot be edited after 7 days from submission date ⏳', 'error');
      return;
    }

    setFeedbacks(prev => prev.map(f => {
      if (f.id === feedbackId) {
        return {
          ...f,
          rating: Number(updatedData.rating),
          title: (updatedData.title || '').trim(),
          comment: updatedData.comment.trim(),
          updatedAt: new Date().toISOString()
        };
      }
      return f;
    }));

    closeFeedbackModal();
    showToast('Your feedback has been updated successfully ✏️', 'success');

    await apiService.updateFeedback(feedbackId, {
      ...updatedData,
      customerId: user?.id
    });
  };

  // Delete feedback helper
  const deleteCustomerFeedback = async (feedbackId) => {
    setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
    showToast('Feedback deleted successfully', 'info');
    await apiService.deleteFeedback(feedbackId);
  };

  // Moderate feedback status (AVE-25)
  const changeFeedbackStatus = async (feedbackId, newStatus) => {
    setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, status: newStatus, updatedAt: new Date().toISOString() } : f));
    showToast(`Feedback status updated to: ${newStatus.toUpperCase()}`, 'success');
    await apiService.updateFeedbackStatus(feedbackId, newStatus);
  };

  // Manager response helper (AVE-27)
  const respondToFeedback = async (feedbackId, replyMessage) => {
    const authorName = user?.role === 'manager' 
      ? `${user?.name || 'Store Manager'} (AVENZA Operations)` 
      : (user?.name || 'Store Manager');

    const replyObj = {
      message: replyMessage.trim(),
      repliedAt: new Date().toISOString(),
      repliedBy: authorName
    };

    setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, adminReply: replyObj, updatedAt: new Date().toISOString() } : f));
    showToast('Official Store Manager response published publicly 💬', 'success');

    if (addAuditLog) {
      addAuditLog(
        'Feedback Replied by Manager',
        'FEEDBACK',
        `Review ID ${feedbackId}`,
        `Published official reply as ${authorName}: "${replyMessage.slice(0, 50)}..."`,
        'INFO'
      );
    }

    await apiService.replyToFeedback(feedbackId, replyMessage, authorName);
  };

  // Calculate Product Rating Summary helper (Based 100% on real customer reviews)
  const getProductRatingSummary = (productId) => {
    const approvedReviews = feedbacks.filter(f => f.productId === productId && (f.status === 'approved' || f.customerId === user?.id));
    if (approvedReviews.length === 0) {
      return { averageRating: '0.0', totalReviews: 0, countByStar: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const totalScore = approvedReviews.reduce((sum, f) => sum + f.rating, 0);
    const average = (totalScore / approvedReviews.length).toFixed(1);

    const countByStar = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach(f => {
      if (countByStar[f.rating] !== undefined) countByStar[f.rating]++;
    });

    return {
      averageRating: average,
      totalReviews: approvedReviews.length,
      countByStar
    };
  };


  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(`Switched to ${next.toUpperCase()} mode 🌗`, 'info');
      return next;
    });
  };

  const login = (identifier, password) => {
    const rawId = (identifier || '').trim();
    const cleanId = rawId.toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      return { success: false, error: 'Please enter your email or username.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your password.' };
    }

    if (!cleanId.includes('@')) {
      if (!/^[a-zA-Z]+$/.test(rawId)) {
        return { 
          success: false, 
          error: 'Username can only contain letters (A-Z, a-z). Slashes like "\\" and symbols are not allowed.' 
        };
      }
    }

    // 1. MASTER USERS LIST & DATABASE CHECK (Prioritizes updated/reset passwords)
    const matchedAccount = usersList.find(
      acc => (acc.email && acc.email.toLowerCase() === cleanId) || 
             (acc.username && acc.username.toLowerCase() === cleanId) ||
             (cleanId === 'admin' && acc.email === 'admin@avenza.com') ||
             (cleanId === 'manager' && acc.email === 'manager@avenza.com') ||
             (cleanId === 'staff' && acc.email === 'staff@avenza.com') ||
             (cleanId === 'customer' && acc.email === 'customer@avenza.com')
    );

    if (matchedAccount) {
      if (matchedAccount.status === 'inactive') {
        return { success: false, error: 'Account is deactivated. Please contact Administrator.' };
      }

      const isExactPasswordMatch = matchedAccount.password && matchedAccount.password === cleanPass;
      const isDefaultFallbackMatch = (
        (cleanId.includes('admin') && (cleanPass === 'admin123' || cleanPass === 'password123')) ||
        (cleanId.includes('staff') && (cleanPass === 'staff123' || cleanPass === 'password123')) ||
        (cleanId.includes('manager') && (cleanPass === 'manager123' || cleanPass === 'password123')) ||
        (cleanId.includes('customer') && (cleanPass === 'password123' || cleanPass === 'customer123')) ||
        (cleanPass === 'password123')
      );

      if (isExactPasswordMatch || isDefaultFallbackMatch) {
        setUser(matchedAccount);
        setIsAuthModalOpen(false);
        setActiveTab(
          matchedAccount.role === 'admin' || matchedAccount.role === 'manager' 
            ? 'admin-dashboard' 
            : matchedAccount.role === 'inventory_staff' 
            ? 'admin-inventory' 
            : 'shop'
        );
        showToast(`Welcome back, ${matchedAccount.name}! 🛍️`, 'success');
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect password. If your password was reset by an Admin, please use the temporary password.' };
      }
    }

    // 2. FALLBACK DEFAULT ACCOUNTS (If not found in usersList)
    if (cleanId === 'admin' || cleanId === 'admin@avenza.com') {
      if (cleanPass === 'admin123' || cleanPass === 'password123') {
        const adminUser = {
          id: 'user-admin-01',
          name: 'Sasanka P.B.S',
          email: 'admin@avenza.com',
          username: 'admin',
          role: 'admin',
          status: 'active',
          phone: '+94 71 987 6543',
          address: 'SLIIT Campus, New Kandy Rd, Malabe'
        };
        setUser(adminUser);
        setIsAuthModalOpen(false);
        setActiveTab('admin-dashboard');
        showToast('Logged in as Administrator (Full Admin Access) 🛠️', 'success');
        return { success: true };
      }
    }

    if (cleanId === 'staff' || cleanId === 'staff@avenza.com') {
      if (cleanPass === 'staff123' || cleanPass === 'password123') {
        const staffUser = {
          id: 'user-staff-01',
          name: 'Kamal Silva',
          email: 'staff@avenza.com',
          username: 'staff',
          role: 'inventory_staff',
          status: 'active',
          phone: '+94 72 345 6789',
          address: 'Main Warehouse, Galle Road, Dehiwala'
        };
        setUser(staffUser);
        setIsAuthModalOpen(false);
        setActiveTab('admin-inventory');
        showToast('Logged in as Inventory Staff 📦', 'success');
        return { success: true };
      }
    }

    if (cleanId === 'manager' || cleanId === 'manager@avenza.com') {
      if (cleanPass === 'manager123' || cleanPass === 'password123') {
        const managerUser = {
          id: 'user-mgr-01',
          name: 'Nimali Jayasinghe',
          email: 'manager@avenza.com',
          username: 'manager',
          role: 'manager',
          status: 'active',
          phone: '+94 76 543 2109',
          address: 'Corporate HQ, Duplication Rd, Colombo 03'
        };
        setUser(managerUser);
        setIsAuthModalOpen(false);
        setActiveTab('admin-dashboard');
        showToast('Logged in as Store Manager 📊', 'success');
        return { success: true };
      }
    }

    if (cleanId === 'customer@avenza.com' || cleanId === 'customer') {
      if (cleanPass === 'password123' || cleanPass === 'customer123') {
        const customerUser = {
          id: 'user-cust-01',
          name: 'Sasanka Perera',
          email: 'customer@avenza.com',
          username: 'customer',
          role: 'customer',
          status: 'active',
          phone: '+94 77 123 4567',
          address: 'No. 45, Flower Road, Colombo 07'
        };
        setUser(customerUser);
        setIsAuthModalOpen(false);
        setActiveTab('shop');
        showToast('Welcome back, Sasanka Perera! 🛍️', 'success');
        return { success: true };
      }
    }

    return { 
      success: false, 
      error: 'User not found. Please verify your email/username or register as a new customer.' 
    };
  };

  const register = async (name, email, phone, password) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Full name must be at least 2 characters.' };
    }
    if (!/^[a-zA-Z\s]+$/.test(cleanName)) {
      return { success: false, error: 'Full name must contain only letters and spaces.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    if (!cleanPhone) {
      return { success: false, error: 'Phone number is required.' };
    }
    const phoneDigits = cleanPhone.replace(/[\s\-\+\(\)]/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15 || !/^\+?[0-9\s\-\(\)]+$/.test(cleanPhone)) {
      return { success: false, error: 'Please enter a valid phone number (e.g. +94 77 123 4567 or 0771234567).' };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (cleanEmail === 'admin' || cleanEmail === 'admin@avenza.com') {
      return { success: false, error: 'Cannot register with administrator email address.' };
    }

    const existingEmail = usersList.find(acc => acc.email && acc.email.toLowerCase().trim() === cleanEmail);
    if (existingEmail) {
      return { success: false, error: 'This email is already registered. Please use another email or sign in.' };
    }

    const existingPhone = usersList.find(acc => {
      if (!acc.phone) return false;
      const p1 = acc.phone.replace(/[\s\-\+\(\)]/g, '');
      return p1 === phoneDigits;
    });
    if (existingPhone) {
      return { success: false, error: 'An account with this phone number already exists. Please use a unique phone number.' };
    }

    const newUserPayload = {
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: 'customer',
      status: 'active',
      phone: cleanPhone,
      address: '',
      city: '',
      postalCode: '',
      savedAddresses: []
    };

    let insertedId = `user-${Date.now()}`;

    try {
      const apiRes = await apiService.createUser(newUserPayload);
      if (apiRes && apiRes.error) {
        return { 
          success: false, 
          error: apiRes.error || 'This email is already registered. Please use another email or sign in.' 
        };
      }
      if (apiRes && apiRes.id) {
        insertedId = apiRes.id;
      }
    } catch (err) {
      console.warn('Backend MySQL user creation warning:', err);
    }

    const newUser = {
      id: insertedId,
      ...newUserPayload,
      username: cleanEmail.split('@')[0]
    };

    setRegisteredAccounts(prev => [...prev, newUser]);
    setUsersList(prev => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    setActiveTab('shop');
    showToast(`Account successfully created for ${newUser.name}! 🛍️`, 'success');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setActiveTab('shop');
    showToast('Logged out successfully', 'info');
  };

  // Profile update (AVE-02)
  const updateUserProfile = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    setUsersList(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedFields } : u));
    showToast('Profile details updated successfully!', 'success');
  };

  // Audit Logging Helper (AVE-16)
  const addAuditLog = (action, category, target, details, severity = 'INFO') => {
    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timestampStr,
      category,
      action,
      target: target || 'System Entity',
      performedBy: user ? `${user.name} (${user.role})` : 'Administrator (System)',
      severity,
      details: details || 'Administrative event logged successfully.',
      ipAddress: '192.168.1.105'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Admin User Management functions (AVE-09, AVE-10, AVE-11, AVE-12, AVE-14)
  const addUser = (userData) => {
    const createdUser = {
      ...userData,
      id: `user-${Date.now()}`,
      status: userData.status || 'active'
    };
    setUsersList(prev => [createdUser, ...prev]);
    apiService.createUser(createdUser);
    addAuditLog(
      'User Account Created',
      'IAM',
      `${createdUser.name} (${createdUser.role})`,
      `Onboarded new account with role "${createdUser.role}", status "${createdUser.status}".`,
      'SUCCESS'
    );
    showToast(`User account created for ${createdUser.name} (${createdUser.role})!`, 'success');
  };

  const updateUser = (userId, updatedFields) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, ...updatedFields }));
    }
    apiService.updateUser(userId, updatedFields);
    addAuditLog(
      'User Details / Role Updated',
      'IAM',
      `${updatedFields.name || `User ID: ${userId}`}`,
      `Role: "${updatedFields.role || 'unchanged'}", Status: "${updatedFields.status || 'unchanged'}".`,
      'INFO'
    );
    showToast('User account and role updated successfully!', 'success');
  };

  const deleteUser = (userId) => {
    const targetUser = usersList.find(u => u.id === userId);
    setUsersList(prev => prev.filter(u => u.id !== userId));
    apiService.deleteUser(userId);
    addAuditLog(
      'User Account Deactivated / Removed',
      'IAM',
      targetUser ? `${targetUser.name} (${targetUser.email})` : `User ID: ${userId}`,
      'Account was permanently removed from active system access.',
      'WARNING'
    );
    showToast('User account deleted', 'info');
  };

  // Password Reset & Credential Policy (AVE-14)
  const resetUserPassword = async (userId, newPassword) => {
    const targetUser = usersList.find(u => u.id === userId || String(u.id) === String(userId) || (u.email && u.email.toLowerCase() === String(userId).toLowerCase()));
    const targetEmail = targetUser?.email || (typeof userId === 'string' && userId.includes('@') ? userId : null);

    setUsersList(prev => prev.map(u => {
      if (u.id === userId || String(u.id) === String(userId) || (targetEmail && u.email?.toLowerCase() === targetEmail.toLowerCase())) {
        return { ...u, password: newPassword };
      }
      return u;
    }));

    setRegisteredAccounts(prev => prev.map(u => {
      if (u.id === userId || String(u.id) === String(userId) || (targetEmail && u.email?.toLowerCase() === targetEmail.toLowerCase())) {
        return { ...u, password: newPassword };
      }
      return u;
    }));

    try {
      const apiUserId = targetUser?.id || userId;
      await apiService.resetPassword(apiUserId, newPassword);
      console.log(`✅ Password reset for user ${apiUserId} (${targetEmail}) synced to database.`);
    } catch (err) {
      console.warn('Could not sync password reset to database:', err);
    }

    addAuditLog(
      'Password Reset & Credential Enforcement',
      'CREDENTIALS',
      targetUser ? `${targetUser.name} (${targetUser.email})` : `User ID: ${userId}`,
      `Administrator generated recovery credentials. Password set to: "${newPassword}".`,
      'SECURITY'
    );
    showToast(`Password reset successfully for ${targetUser?.name || 'User'}! Temporary password: ${newPassword}`, 'success');
  };

  // Settings function (AVE-13, AVE-15)
  const updateSettings = (newSettings) => {
    const isMaintenanceToggled = newSettings.maintenanceMode !== systemSettings.maintenanceMode;
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    apiService.updateSettings(newSettings);
    addAuditLog(
      isMaintenanceToggled ? 'Maintenance Mode Toggled' : 'System Parameters Configured',
      isMaintenanceToggled ? 'MAINTENANCE' : 'SETTINGS',
      'Global Store Settings',
      isMaintenanceToggled 
        ? `Maintenance mode status set to ${newSettings.maintenanceMode ? 'ENABLED (Checkout blocked)' : 'DISABLED (Normal operations)'}. Notice: ${newSettings.maintenanceNoticeTime}`
        : `Store Name: "${newSettings.storeName}", Tax: ${newSettings.taxRate}%, Currency: ${newSettings.currency}.`,
      isMaintenanceToggled ? 'WARNING' : 'INFO'
    );
    showToast('System settings saved successfully!', 'success');
  };

  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    if (!product) return;

    const avail = product.isAvailable !== undefined ? product.isAvailable : product.is_available;
    const isUnavailable = avail === false || avail === 0 || avail === '0';

    if (isUnavailable) {
      showToast('Item is currently unavailable for purchase!', 'error');
      return;
    }
    if (product.stock <= 0) {
      showToast('Item is currently out of stock!', 'error');
      return;
    }

    const getColorName = (col) => {
      if (!col) return '';
      if (typeof col === 'object') return col.name || '';
      return String(col);
    };

    const targetColorName = getColorName(selectedColor);
    const targetSize = String(selectedSize || (product.sizes ? product.sizes[0] : 'M')).trim().toUpperCase();

    // Size-specific available stock
    const sizeStock = product.sizeStocks && product.sizeStocks[targetSize] !== undefined
      ? Number(product.sizeStocks[targetSize])
      : Number(product.stock || 0);

    if (sizeStock <= 0) {
      showToast(`Size ${targetSize} of "${product.name}" is completely out of stock!`, 'warning');
      return;
    }

    setCart(prevCart => {
      // Calculate how many of this EXACT size are ALREADY in the cart
      const currentInCartForSize = prevCart
        .filter(item => String(item.product.id) === String(product.id) && 
                        String(item.selectedSize || '').trim().toUpperCase() === targetSize)
        .reduce((sum, item) => sum + (item.quantity || 0), 0);

      const remainingAvailable = Math.max(0, sizeStock - currentInCartForSize);

      if (quantity > remainingAvailable) {
        if (remainingAvailable === 0) {
          showToast(`You already have all ${sizeStock} available units of size ${targetSize} in your cart!`, 'warning');
        } else {
          showToast(`Cannot add ${quantity}. Only ${remainingAvailable} more unit(s) available in size ${targetSize} (Total: ${sizeStock}, In Cart: ${currentInCartForSize}).`, 'warning');
        }
        return prevCart;
      }

      const existingIndex = prevCart.findIndex(
        item => String(item.product.id) === String(product.id) && 
                String(item.selectedSize || '').trim().toUpperCase() === targetSize && 
                getColorName(item.selectedColor) === targetColorName
      );

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity || 1;
        const newQty = currentQty + quantity;

        showToast(`Updated "${product.name}" (${targetSize}) quantity in cart to ${newQty}!`, 'success');

        return prevCart.map((item, idx) => 
          idx === existingIndex ? { ...item, quantity: newQty } : item
        );
      } else {
        showToast(`Added "${product.name}" (${targetSize}) to cart! (Qty: ${quantity})`, 'success');
        return [...prevCart, { product, selectedSize: targetSize, selectedColor, quantity }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const replaceCartItem = (index, selectedSize, selectedColor, quantity) => {
    if (!selectedSize || !selectedColor) return;
    const targetSize = String(selectedSize).trim().toUpperCase();

    setCart(prevCart => {
      if (index < 0 || index >= prevCart.length) return prevCart;
      const currentItem = prevCart[index];
      const sizeStock = currentItem.product.sizeStocks && currentItem.product.sizeStocks[targetSize] !== undefined
        ? Number(currentItem.product.sizeStocks[targetSize])
        : Number(currentItem.product.stock || 0);

      const otherSameSizeQty = prevCart
        .filter((item, i) => i !== index && 
                             String(item.product.id) === String(currentItem.product.id) && 
                             String(item.selectedSize || '').trim().toUpperCase() === targetSize)
        .reduce((sum, item) => sum + (item.quantity || 0), 0);

      const maxAddable = Math.max(1, sizeStock - otherSameSizeQty);
      const safeQty = Math.min(quantity, maxAddable);

      return prevCart.map((item, i) => 
        i === index 
          ? { ...item, selectedSize: targetSize, selectedColor, quantity: safeQty } 
          : item
      );
    });
    showToast('Cart item updated with new size & color choices! 🛍️', 'success');
  };

  const updateCartQuantity = (index, delta) => {
    setCart(prev => {
      if (index < 0 || index >= prev.length) return prev;
      const currentItem = prev[index];
      const targetSize = String(currentItem.selectedSize || 'M').trim().toUpperCase();
      const newQty = currentItem.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }

      const sizeStock = currentItem.product.sizeStocks && currentItem.product.sizeStocks[targetSize] !== undefined
        ? Number(currentItem.product.sizeStocks[targetSize])
        : Number(currentItem.product.stock || 0);

      const otherSameSizeQty = prev
        .filter((item, i) => i !== index && 
                             String(item.product.id) === String(currentItem.product.id) && 
                             String(item.selectedSize || '').trim().toUpperCase() === targetSize)
        .reduce((sum, item) => sum + (item.quantity || 0), 0);

      if (newQty + otherSameSizeQty > sizeStock) {
        const allowed = Math.max(0, sizeStock - otherSameSizeQty);
        showToast(`Only ${sizeStock} units available for size ${targetSize}. Maximum you can have in cart is ${allowed}.`, 'warning');
        return prev;
      }

      return prev.map((item, i) => 
        i === index ? { ...item, quantity: newQty } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setPromoCode('');
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SAVE10') {
      setAppliedDiscount(1000);
      setPromoCode(cleanCode);
      showToast('Promo code SAVE10 applied! (Rs. 1,000 OFF)', 'success');
    } else if (cleanCode === 'WELCOME15') {
      setAppliedDiscount(15);
      setPromoCode(cleanCode);
      showToast('Promo code WELCOME15 applied! (15% OFF)', 'success');
    } else {
      showToast('Invalid promo code. Try SAVE10 or WELCOME15', 'error');
    }
  };

  // Pricing: Retail apparel in Sri Lanka is VAT-inclusive. Standard delivery is FREE.
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscount === 15 ? (cartSubtotal * 0.15) : appliedDiscount;
  const shippingCost = 0.00; // Free standard shipping islandwide
  const taxAmount = 0.00;     // Taxes already included in retail item price
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('avenza_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('avenza_categories', JSON.stringify(categoriesList));
  }, [categoriesList]);

  const addCategory = (newCat) => {
    if (!newCat) return null;
    const cleanName = newCat.trim();
    const cleanId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const existing = categoriesList.find(c => c.id === cleanId || c.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      return existing.id;
    }
    const catObj = { id: cleanId, name: cleanName, count: 0 };
    setCategoriesList(prev => [...prev, catObj]);
    showToast(`New category "${cleanName}" registered! 🏷️`, 'success');
    return cleanId;
  };

  const placeOrder = (shippingDetails, paymentDetails, deliveryMethod = 'standard') => {
    if (cart.length === 0) return null;

    const chosenDeliveryType = deliveryMethod === 'express' ? 'Express_Same_Day' : 'Standard_Courier';
    const deliveryFee = deliveryMethod === 'express' ? 500.00 : 0.00;
    const finalTotalAmount = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

    const newOrder = {
      id: `AVENZA-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user ? user.id : 'guest',
      customerName: shippingDetails.fullName || (user ? user.name : 'Guest Customer'),
      email: shippingDetails.email || (user ? user.email : 'customer@avenza.com'),
      date: new Date().toISOString().split('T')[0],
      totalAmount: finalTotalAmount,
      status: 'Processing',
      trackingNumber: `TRK-AVENZA-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryType: chosenDeliveryType,
      courierPartner: chosenDeliveryType === 'Standard_Courier' ? 'Domex Courier Services' : null,
      trackingBarcode: chosenDeliveryType === 'Standard_Courier' ? `BARCODE-TRK-AVENZA-${Math.floor(1000000 + Math.random() * 9000000)}` : null,
      transitHub: chosenDeliveryType === 'Standard_Courier' ? 'Colombo Central Distribution Hub' : null,
      riderName: chosenDeliveryType === 'Express_Same_Day' ? 'Nuwan Bandara' : null,
      riderPhone: chosenDeliveryType === 'Express_Same_Day' ? '+94 77 456 7890' : null,
      deliveryTimeSlot: chosenDeliveryType === 'Express_Same_Day' ? 'Afternoon (2:00 PM - 5:00 PM)' : null,
      shippingAddress: {
        address: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        phone: shippingDetails.phone
      },
      paymentMethod: paymentDetails.method === 'card' 
        ? `${paymentDetails.cardBrand || 'Visa'} (•••• ${paymentDetails.last4 || '9981'})` 
        : 'Cash on Delivery',
      paymentDetails: {
        method: paymentDetails.method,
        cardBrand: paymentDetails.cardBrand || 'Visa',
        last4: paymentDetails.last4 || '9981',
        cardName: paymentDetails.cardName,
        paymentSlip: paymentDetails.paymentSlip || null
      },
      paymentSlip: paymentDetails.paymentSlip || null,
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
        image: item.product.image
      }))
    };

    apiService.placeOrder(newOrder).then(res => {
      if (res && res.success) {
        console.log('Order persisted to SQL database server!');
      }
    });

    // Auto-save customer shipping address for future orders
    if (shippingDetails && shippingDetails.address && shippingDetails.saveAddress !== false) {
      const cleanAddr = String(shippingDetails.address || '').trim();
      const cleanCity = String(shippingDetails.city || '').trim();
      const cleanPostal = String(shippingDetails.postalCode || '').trim();
      const cleanPhone = String(shippingDetails.phone || '').trim();
      const cleanFullName = String(shippingDetails.fullName || (user ? user.name : 'Customer')).trim();
      const cleanEmail = String(shippingDetails.email || (user ? user.email : '')).trim().toLowerCase();

      if (cleanAddr) {
        const addressObj = {
          id: `addr-${Date.now()}`,
          fullName: cleanFullName,
          email: cleanEmail,
          phone: cleanPhone,
          address: cleanAddr,
          city: cleanCity,
          postalCode: cleanPostal,
          isDefault: true
        };

        const storageEmailKey = cleanEmail || (user ? user.email : 'guest');
        const storageKey = `avenza_saved_addresses_${storageEmailKey.toLowerCase()}`;
        let existingList = [];
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) existingList = JSON.parse(stored);
        } catch (e) {}

        const dupIndex = existingList.findIndex(a => 
          a.address.toLowerCase().trim() === cleanAddr.toLowerCase() &&
          a.city.toLowerCase().trim() === cleanCity.toLowerCase()
        );
        let updatedList;
        if (dupIndex >= 0) {
          updatedList = existingList.map((a, idx) => ({ ...a, isDefault: idx === dupIndex }));
        } else {
          updatedList = [addressObj, ...existingList.map(a => ({ ...a, isDefault: false }))];
        }

        try {
          localStorage.setItem(storageKey, JSON.stringify(updatedList));
          localStorage.setItem('avenza_last_shipping_address', JSON.stringify(addressObj));
        } catch (e) {}

        if (user) {
          const updatedUser = {
            ...user,
            phone: cleanPhone || user.phone,
            address: cleanAddr,
            city: cleanCity,
            postalCode: cleanPostal || user.postalCode,
            savedAddresses: updatedList
          };
          setUser(updatedUser);
          setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
          try {
            localStorage.setItem('avenza_user', JSON.stringify(updatedUser));
          } catch (e) {}

          apiService.saveShippingAddress(user.id, {
            address: cleanAddr,
            city: cleanCity,
            postalCode: cleanPostal,
            phone: cleanPhone
          });
        }
      }
    }

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItemsForProduct = cart.filter(ci => String(ci.product.id) === String(p.id));
        if (cartItemsForProduct.length > 0) {
          const newSizeStocks = { ...(p.sizeStocks || {}) };
          let totalPurchased = 0;
          cartItemsForProduct.forEach(ci => {
            const sz = String(ci.selectedSize || 'M').trim().toUpperCase();
            const curSzStock = newSizeStocks[sz] !== undefined ? newSizeStocks[sz] : (p.stock || 5);
            newSizeStocks[sz] = Math.max(0, curSzStock - ci.quantity);
            totalPurchased += ci.quantity;
          });
          const newTotalStock = Math.max(0, p.stock - totalPurchased);
          const isNowAvail = newTotalStock > 0;
          apiService.updateStock(p.id, newTotalStock);
          if (!isNowAvail) {
            apiService.toggleProductAvailability(p.id, false);
          }
          return { ...p, stock: newTotalStock, isAvailable: isNowAvail, sizeStocks: newSizeStocks };
        }
        return p;
      });
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.log('Confetti error:', e);
    }

    showToast(`Order ${newOrder.id} placed & saved to database! 🎉`, 'success');
    return newOrder;
  };

  const addProduct = (newProdData) => {
    const createdProduct = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 0.0,
      reviewsCount: 0,
      isAvailable: newProdData.isAvailable ?? true,
      sku: `ACH-${newProdData.category.toUpperCase().slice(0,2)}-${Math.floor(100 + Math.random() * 900)}`
    };
    setProducts(prev => [createdProduct, ...prev]);
    showToast(`Product "${createdProduct.name}" added to inventory!`, 'success');
  };

  const updateProductStock = (productId, newStock) => {
    const stockVal = Math.max(0, parseInt(newStock) || 0);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: stockVal } : p));
    apiService.updateStock(productId, stockVal);
    showToast('Inventory stock updated in database', 'success');
  };

  // Full product details update (AVE-13)
  const updateProductDetails = (productId, updatedData) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedData } : p));
    apiService.updateProduct(productId, updatedData);
    showToast(`Product details for "${updatedData.name}" updated successfully!`, 'success');
  };

  // Toggle product availability (AVE-14)
  const toggleProductAvailability = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStatus = !p.isAvailable;
        apiService.toggleProductAvailability(productId, nextStatus);
        showToast(`Product "${p.name}" status set to ${nextStatus ? 'AVAILABLE' : 'UNAVAILABLE'}`, nextStatus ? 'success' : 'warning');
        return { ...p, isAvailable: nextStatus };
      }
      return p;
    }));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted from inventory', 'info');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    apiService.updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} status updated to: ${newStatus}`, 'success');
  };

  // Manager Delivery Dispatch Assignment (AVE-24, Standard Courier vs Express Same-Day)
  const assignOrderDelivery = (orderId, deliveryData) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          delivery: deliveryData,
          deliveryType: deliveryData.deliveryType,
          courierPartner: deliveryData.courierPartner,
          trackingBarcode: deliveryData.trackingBarcode,
          transitHub: deliveryData.transitHub,
          riderName: deliveryData.riderName,
          riderPhone: deliveryData.riderPhone,
          deliveryTimeSlot: deliveryData.deliveryTimeSlot,
          status: o.status === 'Processing' ? 'Shipped' : o.status
        };
      }
      return o;
    }));
    apiService.assignDelivery(orderId, deliveryData);
    addAuditLog(
      'Delivery Assigned by Manager',
      'OPERATIONS',
      `Order ${orderId}`,
      `Assigned ${deliveryData.deliveryType === 'Standard_Courier' ? `Standard Courier (${deliveryData.courierPartner})` : `Express Same-Day (${deliveryData.riderName})`}. Barcode/Slot: ${deliveryData.trackingBarcode || deliveryData.deliveryTimeSlot}.`,
      'INFO'
    );
    showToast(`Delivery successfully assigned for Order ${orderId}! 🚚`, 'success');
  };

  // Cancel Order (Customer or Manager: ONLY allowed if status is 'Processing')
  const cancelOrder = async (orderId) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.status !== 'Processing') {
      showToast(`Cannot cancel order ${orderId}. Order is already "${targetOrder.status}" (in transit or completed).`, 'warning');
      return;
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
    try {
      const res = await apiService.cancelOrder(orderId);
      if (res && res.error) {
        showToast(res.error, 'error');
        return;
      }
      // Refresh inventory products from backend to reflect restocked units
      const updatedProducts = await apiService.getProducts();
      if (updatedProducts) setProducts(updatedProducts);
    } catch (e) {}

    addAuditLog(
      'Order Cancelled',
      'ORDERS',
      `Order ${orderId}`,
      `Order ${orderId} was cancelled while in Processing status. Items restocked into inventory.`,
      'WARNING'
    );
    showToast(`Order ${orderId} has been cancelled and items restocked 🔄`, 'info');
  };

  // Cancel Individual Item from Order (Only if Processing)
  const cancelOrderItem = async (orderId, orderItemId) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.status !== 'Processing') {
      showToast(`Cannot cancel item. Order ${orderId} is currently "${targetOrder.status}" (in transit or completed).`, 'warning');
      return;
    }

    const targetItem = targetOrder.items.find(it => (it.orderItemId && it.orderItemId === orderItemId) || it.id === orderItemId);
    const itemName = targetItem ? targetItem.name : 'Cloth';

    try {
      const res = await apiService.cancelOrderItem(orderId, orderItemId);
      if (res && res.error) {
        showToast(res.error, 'error');
        return;
      }

      if (res && res.orderCancelled) {
        // Last item cancelled -> whole order became Cancelled
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled', totalAmount: 0, items: [] } : o));
        showToast(`All clothes cancelled from Order ${orderId}. Order is now Cancelled 🔄`, 'info');
      } else {
        // Updated remaining items and new total
        setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            const updatedItems = o.items.filter(it => (it.orderItemId ? it.orderItemId !== orderItemId : it.id !== orderItemId));
            const newTotal = res?.newTotal !== undefined ? res.newTotal : updatedItems.reduce((s, it) => s + (it.price * it.quantity), 0);
            return {
              ...o,
              items: updatedItems,
              totalAmount: newTotal
            };
          }
          return o;
        }));
        showToast(`"${itemName}" removed from order and restocked into inventory 🔄`, 'success');
      }

      // Refresh inventory products from backend to show new stock counts
      const updatedProducts = await apiService.getProducts();
      if (updatedProducts) setProducts(updatedProducts);

      addAuditLog(
        'Order Item Cancelled',
        'ORDERS',
        `Order ${orderId}`,
        `Item "${itemName}" was cancelled from Order ${orderId} and restocked.`,
        'INFO'
      );
    } catch (e) {
      showToast('Failed to cancel item from order', 'error');
    }
  };

  // Delete individual Delivered or Cancelled Order (Cannot delete orders pending delivery)
  const deleteOrder = async (orderId) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.status !== 'Delivered' && targetOrder.status !== 'Cancelled') {
      showToast(`Cannot delete order ${orderId}. Order is currently "${targetOrder.status}" and pending delivery! Only completed or cancelled orders can be removed.`, 'warning');
      return;
    }

    setOrders(prev => prev.filter(o => o.id !== orderId));
    try {
      await apiService.deleteOrder(orderId);
    } catch (e) {}
    showToast(`Order ${orderId} (${targetOrder.status}) removed from history 🗑️`, 'info');
  };

  // Bulk clear ALL Delivered Orders (Active in-transit/processing orders strictly preserved)
  const clearDeliveredOrders = async () => {
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
    if (deliveredCount === 0) {
      showToast('No completed/delivered orders found to clear', 'info');
      return;
    }

    setOrders(prev => prev.filter(o => o.status !== 'Delivered'));
    try {
      await apiService.clearDeliveredOrders();
    } catch (e) {}
    showToast(`Removed all ${deliveredCount} delivered orders. Pending delivery orders preserved! 🗑️`, 'success');
  };

  // Bulk clear ALL Cancelled Orders (Active in-transit/processing orders strictly preserved)
  const clearCancelledOrders = async (emailOrUserId = null) => {
    let cancelledOrdersToClear;
    if (emailOrUserId) {
      const filterKey = emailOrUserId.toString().toLowerCase().trim();
      cancelledOrdersToClear = orders.filter(o => 
        o.status === 'Cancelled' && (
          (o.userId && o.userId.toString().toLowerCase() === filterKey) ||
          (o.customer?.email && o.customer.email.toLowerCase().trim() === filterKey)
        )
      );
    } else {
      cancelledOrdersToClear = orders.filter(o => o.status === 'Cancelled');
    }

    const cancelledCount = cancelledOrdersToClear.length;
    if (cancelledCount === 0) {
      showToast('No cancelled orders found to clear', 'info');
      return;
    }

    const idsToDelete = new Set(cancelledOrdersToClear.map(o => o.id));
    setOrders(prev => prev.filter(o => !idsToDelete.has(o.id)));
    try {
      if (emailOrUserId) {
        await apiService.clearCancelledOrders({ email: emailOrUserId, userId: emailOrUserId });
      } else {
        await apiService.clearCancelledOrders();
      }
    } catch (e) {}
    showToast(`Removed all ${cancelledCount} cancelled orders. Active orders preserved! 🗑️`, 'success');
  };

  // Helper to fetch saved addresses for a customer
  const getSavedAddresses = (email) => {
    const storageKey = `avenza_saved_addresses_${(email || user?.email || 'guest').toLowerCase().trim()}`;
    let list = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) list = JSON.parse(stored);
    } catch (e) {}
    if (list.length > 0) return list;
    if (user && user.address && user.address.trim() && user.address !== 'No. 12, Main Street') {
      return [{
        id: 'addr-default',
        fullName: user.name || 'Customer',
        email: user.email,
        phone: user.phone || '',
        address: user.address,
        city: user.city || 'Colombo',
        postalCode: user.postalCode || '00700',
        isDefault: true
      }];
    }
    return [];
  };

  // Helper to explicitly save a shipping address
  const saveCustomerAddress = async (shippingDetails) => {
    if (!shippingDetails || !shippingDetails.address) return;
    const cleanAddr = String(shippingDetails.address || '').trim();
    const cleanCity = String(shippingDetails.city || '').trim();
    const cleanPostal = String(shippingDetails.postalCode || '').trim();
    const cleanPhone = String(shippingDetails.phone || '').trim();
    const cleanFullName = String(shippingDetails.fullName || (user ? user.name : 'Customer')).trim();
    const cleanEmail = String(shippingDetails.email || (user ? user.email : '')).trim().toLowerCase();

    if (!cleanAddr) return;

    const addressObj = {
      id: `addr-${Date.now()}`,
      fullName: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      address: cleanAddr,
      city: cleanCity,
      postalCode: cleanPostal,
      isDefault: true
    };

    const storageEmailKey = cleanEmail || (user ? user.email : 'guest');
    const storageKey = `avenza_saved_addresses_${storageEmailKey.toLowerCase()}`;
    let existingList = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) existingList = JSON.parse(stored);
    } catch (e) {}

    const dupIndex = existingList.findIndex(a => 
      a.address.toLowerCase().trim() === cleanAddr.toLowerCase() &&
      a.city.toLowerCase().trim() === cleanCity.toLowerCase()
    );
    let updatedList;
    if (dupIndex >= 0) {
      updatedList = existingList.map((a, idx) => ({ ...a, isDefault: idx === dupIndex }));
    } else {
      updatedList = [addressObj, ...existingList.map(a => ({ ...a, isDefault: false }))];
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      localStorage.setItem('avenza_last_shipping_address', JSON.stringify(addressObj));
    } catch (e) {}

    if (user) {
      const updatedUser = {
        ...user,
        phone: cleanPhone || user.phone,
        address: cleanAddr,
        city: cleanCity,
        postalCode: cleanPostal || user.postalCode,
        savedAddresses: updatedList
      };
      setUser(updatedUser);
      setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      try {
        localStorage.setItem('avenza_user', JSON.stringify(updatedUser));
      } catch (e) {}

      try {
        await apiService.saveShippingAddress(user.id, {
          address: cleanAddr,
          city: cleanCity,
          postalCode: cleanPostal,
          phone: cleanPhone
        });
      } catch (e) {}
    }
  };

  // Helper to update an existing saved shipping address
  const updateCustomerAddress = async (addressIdOrIndex, newDetails) => {
    if (!newDetails) return;
    const cleanAddr = String(newDetails.address || '').trim();
    const cleanCity = String(newDetails.city || '').trim();
    const cleanPostal = String(newDetails.postalCode || '').trim();
    const cleanPhone = String(newDetails.phone || '').trim();
    const cleanFullName = String(newDetails.fullName || (user ? user.name : 'Customer')).trim();
    const cleanEmail = String(newDetails.email || (user ? user.email : '')).trim().toLowerCase();

    const storageEmailKey = cleanEmail || (user ? user.email : 'guest');
    const storageKey = `avenza_saved_addresses_${storageEmailKey.toLowerCase()}`;
    let existingList = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) existingList = JSON.parse(stored);
    } catch (e) {}

    let updatedList = [];
    if (existingList.length > 0) {
      updatedList = existingList.map((addr, idx) => {
        if (addr.id === addressIdOrIndex || idx === addressIdOrIndex) {
          return {
            ...addr,
            fullName: cleanFullName,
            email: cleanEmail,
            phone: cleanPhone,
            address: cleanAddr,
            city: cleanCity,
            postalCode: cleanPostal
          };
        }
        return addr;
      });
    } else {
      updatedList = [{
        id: typeof addressIdOrIndex === 'string' ? addressIdOrIndex : 'addr-default',
        fullName: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddr,
        city: cleanCity,
        postalCode: cleanPostal,
        isDefault: true
      }];
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      localStorage.setItem('avenza_last_shipping_address', JSON.stringify({
        fullName: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddr,
        city: cleanCity,
        postalCode: cleanPostal
      }));
    } catch (e) {}

    if (user) {
      const updatedUser = {
        ...user,
        phone: cleanPhone || user.phone,
        address: cleanAddr,
        city: cleanCity,
        postalCode: cleanPostal || user.postalCode,
        savedAddresses: updatedList
      };
      setUser(updatedUser);
      setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      try {
        localStorage.setItem('avenza_user', JSON.stringify(updatedUser));
      } catch (e) {}

      try {
        await apiService.saveShippingAddress(user.id, {
          address: cleanAddr,
          city: cleanCity,
          postalCode: cleanPostal,
          phone: cleanPhone
        });
      } catch (e) {}
    }

    showToast('Saved shipping address updated successfully! 📍', 'success');
    return updatedList;
  };

  // --------------------------------------------------------------------
  // SAVED CREDIT / DEBIT CARDS MANAGEMENT
  // --------------------------------------------------------------------
  const getSavedCards = (email) => {
    const storageKey = `avenza_saved_cards_${(email || user?.email || 'guest').toLowerCase().trim()}`;
    let list = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) list = JSON.parse(stored);
    } catch (e) {}
    if (list && list.length > 0) return list;

    // Default fallback demo cards if none saved yet
    const fallbackCards = [
      {
        id: 'card-default-visa',
        cardNumber: '4111 1111 1111 1111',
        cardName: (user?.name || 'Sasanka Perera').replace(/\s*\([^)]*\)/g, '').trim(),
        expiry: '08/28',
        cvv: '882',
        cardBrand: 'visa',
        last4: '1111',
        isDefault: true
      },
      {
        id: 'card-default-mc',
        cardNumber: '5555 5555 5555 4444',
        cardName: (user?.name || 'Sasanka Perera').replace(/\s*\([^)]*\)/g, '').trim(),
        expiry: '12/28',
        cvv: '542',
        cardBrand: 'mastercard',
        last4: '4444',
        isDefault: false
      }
    ];

    try {
      localStorage.setItem(storageKey, JSON.stringify(fallbackCards));
    } catch (e) {}
    return fallbackCards;
  };

  const saveCustomerCard = (cardDetails, email) => {
    if (!cardDetails || !cardDetails.cardNumber) return;
    const storageKey = `avenza_saved_cards_${(email || user?.email || 'guest').toLowerCase().trim()}`;
    let existing = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) existing = JSON.parse(stored);
    } catch (e) {}

    const digitsOnly = cardDetails.cardNumber.replace(/\D/g, '');
    const last4 = digitsOnly.slice(-4);
    const cardBrand = cardDetails.cardBrand || (cardDetails.cardNumber.startsWith('4') ? 'visa' : 'mastercard');

    const newCard = {
      id: `card-${Date.now()}`,
      cardNumber: cardDetails.cardNumber,
      cardName: cardDetails.cardName || (user?.name || 'Cardholder'),
      expiry: cardDetails.expiry,
      cvv: cardDetails.cvv,
      cardBrand,
      last4,
      isDefault: existing.length === 0
    };

    const dupIdx = existing.findIndex(c => c.cardNumber.replace(/\s/g, '') === cardDetails.cardNumber.replace(/\s/g, ''));
    let updated;
    if (dupIdx >= 0) {
      updated = existing.map((c, i) => i === dupIdx ? { ...c, ...newCard, id: c.id } : c);
    } else {
      updated = [...existing, newCard];
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    return updated;
  };

  const updateCustomerCard = (cardIdOrIndex, newDetails, email) => {
    if (!newDetails) return;
    const storageKey = `avenza_saved_cards_${(email || user?.email || 'guest').toLowerCase().trim()}`;
    let existing = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) existing = JSON.parse(stored);
    } catch (e) {}

    const digitsOnly = (newDetails.cardNumber || '').replace(/\D/g, '');
    const last4 = digitsOnly.slice(-4);
    const cardBrand = newDetails.cardBrand || (newDetails.cardNumber?.startsWith('4') ? 'visa' : 'mastercard');

    const updated = existing.map((c, idx) => {
      if (c.id === cardIdOrIndex || idx === cardIdOrIndex) {
        return {
          ...c,
          cardNumber: newDetails.cardNumber || c.cardNumber,
          cardName: newDetails.cardName || c.cardName,
          expiry: newDetails.expiry || c.expiry,
          cvv: newDetails.cvv || c.cvv,
          cardBrand,
          last4: last4 || c.last4
        };
      }
      return c;
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    showToast('Saved card details updated successfully! 💳', 'success');
    return updated;
  };

  const deleteCustomerCard = (cardIdOrIndex, email) => {
    const storageKey = `avenza_saved_cards_${(email || user?.email || 'guest').toLowerCase().trim()}`;
    let existing = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) existing = JSON.parse(stored);
    } catch (e) {}

    const updated = existing.filter((c, idx) => c.id !== cardIdOrIndex && idx !== cardIdOrIndex);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    showToast('Card removed from saved cards 🗑️', 'info');
    return updated;
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      login,
      register,
      logout,
      updateUserProfile,
      getSavedAddresses,
      saveCustomerAddress,
      updateCustomerAddress,
      getSavedCards,
      saveCustomerCard,
      updateCustomerCard,
      deleteCustomerCard,
      usersList,
      addUser,
      updateUser,
      deleteUser,
      systemSettings,
      updateSettings,
      auditLogs,
      addAuditLog,
      resetUserPassword,
      isAuthModalOpen,
      setIsAuthModalOpen,
      pendingCheckout,
      setPendingCheckout,
      paymentSuccessOrder,
      setPaymentSuccessOrder,
      activeTab,
      setActiveTab,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      priceRange,
      setPriceRange,
      selectedSizeFilter,
      setSelectedSizeFilter,
      sortBy,
      setSortBy,
      selectedProduct,
      setSelectedProduct,
      cart,
      addToCart,
      replaceCartItem,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      promoCode,
      applyPromoCode,
      cartSubtotal,
      discountAmount,
      shippingCost,
      taxAmount,
      cartTotal,
      wishlist,
      isWishlistOpen,
      setIsWishlistOpen,
      toggleWishlist,
      placeOrder,
      products,
      addProduct,
      updateProductStock,
      updateProductDetails,
      toggleProductAvailability,
      deleteProduct,
      orders,
      updateOrderStatus,
      assignOrderDelivery,
      deleteOrder,
      cancelOrder,
      cancelOrderItem,
      clearDeliveredOrders,
      clearCancelledOrders,
      feedbacks,
      setFeedbacks,
      isFeedbackModalOpen,
      setIsFeedbackModalOpen,
      feedbackTarget,
      setFeedbackTarget,
      openFeedbackModal,
      closeFeedbackModal,
      submitCustomerFeedback,
      editCustomerFeedback,
      deleteCustomerFeedback,
      changeFeedbackStatus,
      respondToFeedback,
      getProductRatingSummary,
      toast,
      setToast,
      showToast,
      formatLKR,
      categories: categoriesList,
      addCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext) || {};

