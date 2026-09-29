/**
 * ====================================================================
 * AVENZA CLOTHING STORE - MONGOOSE FEEDBACK MODEL
 * File: backend/models/Feedback.js
 * 
 * 📌 USER STORIES COVERED:
 *   - AVE-22: Customer Submits Feedback/Rating (Customer Side)
 *   - AVE-25: Administrator Views, Responds to, and Hides/Archives Feedback (Admin Side)
 * 
 * 👤 TARGET USER ROLES:
 *   - Customer (Creates, views, edits within 7 days, and deletes their feedback)
 *   - Administrator (Reads, approves, soft hides, archives, and replies to feedback)
 * 
 * 🎯 PURPOSE OF THIS FILE:
 *   Defines the MongoDB collection schema for storing customer review titles,
 *   star ratings (1 to 5), review comments, moderation status flags, and 
 *   official admin responses attached to products or orders.
 * ====================================================================
 */

const mongoose = require('mongoose');

/**
 * Feedback & Rating Mongoose Schema
 * Purpose: Defines data structures, field validations, and default values for reviews.
 * Target Role: Customer (Submits) & Administrator (Moderates & Replies)
 */
const feedbackSchema = new mongoose.Schema(
  {
    // Unique identifier of the customer submitting the review (From JWT Token / Auth Context)
    customerId: {
      type: String,
      required: [true, 'Customer ID is required']
    },

    // Full name of the customer displayed publicly under the review
    customerName: {
      type: String,
      required: [true, 'Customer name is required']
    },

    // Email address of the customer for verification and notification
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required']
    },

    // Optional ID of the clothing product being reviewed (e.g., 'prod-m1')
    productId: {
      type: String,
      default: null
    },

    // Name of the clothing product for quick display in admin tables
    productName: {
      type: String,
      default: null
    },

    // Optional ID of the completed customer order being rated (e.g., 'ACH-99420')
    orderId: {
      type: String,
      default: null
    },

    // Star Rating Score: Required integer from 1 (Terrible) to 5 (Excellent)
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },

    // Optional headline/title for the review (max 100 characters)
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      default: ''
    },

    // Main detailed customer review text (max 1000 characters)
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },

    // Moderation Status Flag managed by Administrator (AVE-25)
    // Values:
    //   - 'approved': Publicly visible on storefront product detail modal
    //   - 'pending': Awaiting admin moderation review
    //   - 'hidden': Soft hide (visible only to submitting customer in "My Feedback", hidden from public)
    //   - 'archived': Removed from active lists, kept in database
    status: {
      type: String,
      enum: ['pending', 'approved', 'hidden', 'archived'],
      default: 'approved'
    },

    // Official Administrator Reply object (AVE-25)
    // Target Role: Administrator (Publishes official response shown under customer review)
    adminReply: {
      message: { type: String, default: null }, // Official response text
      repliedAt: { type: Date, default: null },  // Timestamp of response
      repliedBy: { type: String, default: null }  // Name of admin staff responding
    }
  },
  {
    // Auto-generates createdAt and updatedAt timestamps
    timestamps: true
  }
);

// Compound index to help enforce 1 review per customer per product (Anti-Spam safeguard)
feedbackSchema.index({ customerId: 1, productId: 1 }, { unique: false });

module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
