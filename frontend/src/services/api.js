// API Service module connecting React App to Express + SQL Backend
const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', database: 'SQL Offline' };
    }
  },

  // Auth: Login
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, using fallback auth logic.');
      return null;
    }
  },

  // Users: Get All
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Users: Create User
  async createUser(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Users: Update User Details & Role
  async updateUser(userId, userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Users: Save Shipping Address (Auto-save on checkout)
  async saveShippingAddress(userId, addressData) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/shipping-address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Users: Delete User
  async deleteUser(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Users: Reset Password (AVE-14)
  async resetPassword(userId, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Products: Get All
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Products: Update Stock
  async updateStock(productId, stock) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Products: Update Full Details (AVE-13)
  async updateProduct(productId, productData) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Products: Toggle Availability (AVE-14)
  async toggleProductAvailability(productId, isAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Settings: Get Settings (AVE-10)
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Settings: Update Settings (AVE-10)
  async updateSettings(settingsData) {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Get All
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Place New Order in SQL Database
  async placeOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (e) {
      console.warn('Could not post order to SQL database (API offline). Saved to local state.');
      return null;
    }
  },

  // Orders: Update Status (AVE-25)
  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Assign Delivery Details (AVE-24, Standard Courier vs Express Same-Day)
  async assignDelivery(orderId, deliveryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/delivery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Cancel Order (Only if Processing)
  async cancelOrder(orderId) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Cancel Individual Item from Order (Only if Processing)
  async cancelOrderItem(orderId, orderItemId) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/items/${orderItemId}/cancel`, {
        method: 'PUT'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Delete Delivered Order
  async deleteOrder(orderId) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Bulk Clear All Delivered Orders
  async clearDeliveredOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders-delivered/bulk`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Orders: Bulk Clear All Cancelled Orders
  async clearCancelledOrders(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/orders-cancelled/bulk${query ? `?${query}` : ''}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Feedback: Get All (AVE-22, AVE-25)
  async getFeedbacks(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/feedback${query ? `?${query}` : ''}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Feedback: Submit Feedback (AVE-22)
  async submitFeedback(feedbackData) {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Feedback: Update Feedback (AVE-22)
  async updateFeedback(id, feedbackData) {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Feedback: Delete Feedback (AVE-22, AVE-25)
  async deleteFeedback(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Feedback: Moderate Status (AVE-25)
  async updateFeedbackStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Feedback: Admin Response (AVE-25)
  async replyToFeedback(id, message, repliedBy) {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, repliedBy })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};


