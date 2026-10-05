import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BannerHero } from './components/BannerHero';
import { CategoryBar } from './components/CategoryBar';
import { ProductCatalog } from './components/Epic2_ProductInventory/ProductCatalog';
import { ProductDetailModal } from './components/Epic2_ProductInventory/ProductDetailModal';
import { AdminInventory } from './components/Epic2_ProductInventory/AdminInventory';
import { AuthModal } from './components/Epic1_UserAdministration/AuthModal';
import { UserProfile } from './components/Epic1_UserAdministration/UserProfile';
import { OrderHistory } from './components/Epic3_CartPayment/OrderHistory';
import { MyFeedback } from './components/Epic4_DeliveryFeedback/MyFeedback';
import { FeedbackModal } from './components/Epic4_DeliveryFeedback/FeedbackModal';
import { WishlistDrawer } from './components/Epic3_CartPayment/WishlistDrawer';
import { CartDrawer } from './components/Epic3_CartPayment/CartDrawer';
import { CheckoutModal } from './components/Epic3_CartPayment/CheckoutModal';
import { PaymentSuccessModal } from './components/Epic3_CartPayment/PaymentSuccessModal';
import { AdminDashboard } from './components/Epic1_UserAdministration/AdminDashboard';
import { AdminOrders } from './components/Epic4_DeliveryFeedback/AdminOrders';
import { AdminUsers } from './components/Epic1_UserAdministration/AdminUsers';
import { AdminSettings } from './components/Epic1_UserAdministration/AdminSettings';
import { AdminFeedback } from './components/Epic4_DeliveryFeedback/AdminFeedback';
import { AdminAuditLogs } from './components/Epic1_UserAdministration/AdminAuditLogs';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';


const MainContent = () => {
  const { 
    activeTab, 
    showToast, 
    user, 
    pendingCheckout, 
    setPendingCheckout, 
    setIsAuthModalOpen 
  } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Automatically resume checkout once guest signs in or creates an account
  useEffect(() => {
    if (user && pendingCheckout) {
      setPendingCheckout(false);
      setIsCheckoutOpen(true);
      showToast(`Welcome back, ${user.name}! Ready to complete your checkout 🛍️`, 'success');
    }
  }, [user, pendingCheckout]);

  const handleProceedToCheckout = () => {
    if (!user) {
      setPendingCheckout(true);
      showToast('Please sign in or create an account to proceed with checkout! 🛍️', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa] text-zinc-900 dark:bg-black dark:text-white transition-colors duration-300 relative">
      <div>
        <Navbar />

        {activeTab === 'shop' && <BannerHero />}

        <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6">
          {activeTab === 'shop' && (
            <>
              <CategoryBar />
              <ProductCatalog />
            </>
          )}

          {activeTab === 'orders' && <OrderHistory />}
          {activeTab === 'my-feedback' && <MyFeedback />}
          {activeTab === 'profile' && <UserProfile />}
          {activeTab === 'admin-dashboard' && <AdminDashboard />}
          {activeTab === 'admin-inventory' && <AdminInventory />}
          {activeTab === 'admin-orders' && <AdminOrders />}
          {activeTab === 'admin-users' && <AdminUsers />}
          {activeTab === 'admin-settings' && <AdminSettings />}
          {activeTab === 'admin-feedback' && <AdminFeedback />}
          {activeTab === 'admin-audit-logs' && <AdminAuditLogs />}
        </main>
      </div>

      <Footer />



      {/* Global Modals */}
      <ProductDetailModal />
      <FeedbackModal />
      <AuthModal />
      {user?.role !== 'admin' && (
        <>
          <WishlistDrawer />
          <CartDrawer onProceedToCheckout={handleProceedToCheckout} />
          <CheckoutModal 
            isOpen={isCheckoutOpen} 
            onClose={() => {
              setIsCheckoutOpen(false);
              if (pendingCheckout) setPendingCheckout(false);
            }} 
          />
          <PaymentSuccessModal />
        </>
      )}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
