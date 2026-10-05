/**
 * ====================================================================
 * AVENZA CLOTHING STORE - CUSTOMER FEEDBACK & RATING MODAL COMPONENT
 * File: frontend/src/components/Epic4_DeliveryFeedback/FeedbackModal.jsx
 * 
 * 📌 USER STORY COVERED:
 *   - AVE-22: "As a Customer, I want to submit feedback or a rating for a 
 *              product or order, so that I can share my experience with AVENZA."
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer (Logged-in user creating or editing product/order reviews)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Provides an interactive modal window allowing logged-in customers to:
 *   1. Select a star rating from 1 to 5 with dynamic hover feedback.
 *   2. Enter an optional headline title (max 100 chars).
 *   3. Write a detailed review comment with live character counter (max 1000 chars).
 *   4. Auto-fill context details based on product or order ID.
 *   5. Edit previously submitted reviews (if within 7 days of posting).
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, MessageSquare, AlertCircle } from 'lucide-react';

export const FeedbackModal = () => {
  // Extract global application state and feedback handlers from AppContext
  const { 
    isFeedbackModalOpen, 
    closeFeedbackModal, 
    feedbackTarget, 
    submitCustomerFeedback, 
    editCustomerFeedback,
    user 
  } = useApp();

  // Local component form state variables
  const [rating, setRating] = useState(5);             // Selected star rating (1 to 5)
  const [hoverRating, setHoverRating] = useState(0);   // Temporary star rating shown on mouse hover
  const [title, setTitle] = useState('');              // Optional review headline title
  const [comment, setComment] = useState('');          // Required detailed review comment text
  const [errorMsg, setErrorMsg] = useState('');        // Validation error message text

  // Check if modal was opened for editing an existing review or submitting a new one
  const isEditMode = feedbackTarget?.type === 'edit';

  /**
   * Effect Hook: Synchronize form fields whenever modal opens or target changes
   * Purpose: Pre-fills existing review data if editing, or resets to default empty state if creating.
   * Target Role: Customer
   */
  useEffect(() => {
    if (isFeedbackModalOpen && feedbackTarget) {
      if (isEditMode && feedbackTarget.initialData) {
        // Pre-fill fields for editing
        setRating(feedbackTarget.initialData.rating || 5);
        setTitle(feedbackTarget.initialData.title || '');
        setComment(feedbackTarget.initialData.comment || '');
      } else {
        // Reset fields for fresh review submission
        setRating(5);
        setTitle('');
        setComment('');
      }
      setErrorMsg('');
    }
  }, [isFeedbackModalOpen, feedbackTarget, isEditMode]);

  // Do not render anything if modal is not open
  if (!isFeedbackModalOpen || !feedbackTarget) return null;

  /**
   * Form Submission Handler
   * Purpose: Validates customer inputs (rating 1-5, comment non-empty & max 1000 chars) 
   *          and dispatches action to AppContext and REST API.
   * Target Role: Customer (AVE-22)
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation 1: Star Rating check
    if (!rating || rating < 1) {
      setErrorMsg('Please select a star rating between 1 and 5 stars.');
      return;
    }

    // Validation 2: Required Comment check
    if (!comment.trim()) {
      setErrorMsg('Please write your review comment before submitting.');
      return;
    }

    // Validation 3: Maximum length safeguard
    if (comment.trim().length > 1000) {
      setErrorMsg('Comment text cannot exceed 1000 characters.');
      return;
    }

    // Dispatch update or creation action based on edit mode
    if (isEditMode) {
      // Edit existing review (Target Role: Customer)
      editCustomerFeedback(feedbackTarget.initialData.id, {
        rating,
        title,
        comment
      });
    } else {
      // Submit new review (Target Role: Customer)
      submitCustomerFeedback({
        productId: feedbackTarget.productId || null,
        productName: feedbackTarget.productName || null,
        orderId: feedbackTarget.orderId || null,
        rating,
        title,
        comment
      });
    }
  };

  return (
    <div 
      onClick={closeFeedbackModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 overflow-hidden cursor-default"
      >
        
        {/* Close Button (Target Role: Customer) */}
        <button
          onClick={closeFeedbackModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header showing context (Product name or Order ID) */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">
              {isEditMode ? 'Edit Your Review' : 'Customer Review & Rating'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {feedbackTarget.productName ? (
                <>Reviewing <span className="font-bold text-amber-500">{feedbackTarget.productName}</span></>
              ) : feedbackTarget.orderId ? (
                <>Rating Order <span className="font-bold font-mono text-amber-500">{feedbackTarget.orderId}</span></>
              ) : 'Share your clothing experience with AVENZA'}
            </p>
          </div>
        </div>

        {/* Validation Error Message Box */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* SECTION 1: Interactive 1-5 Star Rating Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Select Your Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  title={`Rate ${star} Star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-zinc-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-black font-mono text-amber-500">
                {rating} / 5 Stars ({rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'})
              </span>
            </div>
          </div>

          {/* SECTION 2: Optional Headline Title */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Review Title (Optional - Max 100 Chars)
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="e.g., Perfect fit and outstanding fabric quality!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* SECTION 3: Detailed Review Comment Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Your Detailed Review *
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {comment.length} / 1000 Chars
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              placeholder="Write your honest thoughts about fabric texture, sizing, comfort, or delivery service..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Customer Identity Information Banner */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 text-xs text-slate-500 flex items-center justify-between">
            <span>Submitting as: <strong className="text-slate-800 dark:text-zinc-200">{user?.name}</strong> ({user?.email})</span>
            <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">Verified Customer</span>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
            >
              {isEditMode ? 'Update Review' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              onClick={closeFeedbackModal}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
