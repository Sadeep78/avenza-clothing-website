/**
 * ====================================================================
 * AVENZA CLOTHING STORE - MY FEEDBACK PAGE COMPONENT
 * File: frontend/src/components/Epic2_CustomerUser/MyFeedback.jsx
 * 
 * 📌 USER STORY COVERED:
 *   - AVE-22: "As a Customer, I want to submit feedback or a rating for a 
 *              product or order, so that I can share my experience with AVENZA."
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer (Logged-in user viewing, editing, or deleting their submitted feedback)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Serves as the dedicated Customer Feedback Dashboard (`/my-feedback`).
 *   Allows customers to:
 *   1. View a list of all their posted reviews and ratings.
 *   2. Monitor live moderation status badges (Approved, Pending, Soft Hidden, Archived).
 *   3. Read official Administrator responses attached to their reviews.
 *   4. Edit reviews within a strict 7-day window from creation date.
 *   5. Permanently delete their reviews if desired.
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Edit3, Trash2, MessageSquare, Clock, ShieldCheck, CornerDownRight, AlertCircle, ShoppingBag } from 'lucide-react';

export const MyFeedback = () => {
  // Access global state and helper methods from AppContext
  const { 
    feedbacks, 
    user, 
    openFeedbackModal, 
    deleteCustomerFeedback,
    setActiveTab 
  } = useApp();

  /**
   * Filter List: Extract only feedback submitted by the currently logged-in customer
   * Target Role: Customer
   */
  const myFeedbacks = feedbacks.filter(f => f.customerId === user?.id || f.customerEmail === user?.email);

  /**
   * Helper Function: Calculate days elapsed since review creation
   * Purpose: Used to enforce the 7-day edit restriction rule.
   * Return: Integer representing days since submission.
   */
  const getDaysElapsed = (createdAt) => {
    const created = new Date(createdAt);
    const diffTime = Math.abs(new Date() - created);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* PAGE HEADER BANNER (Target Role: Customer) */}
      <div className="p-6 rounded-3xl card-theme shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Customer Rating & Feedback Center</span>
          </div>
          <h2 className="text-2xl font-black">
            My Submitted Reviews & Ratings
          </h2>
          <p className="text-xs text-slate-500">
            View your product reviews, track official admin responses, or edit entries within 7 days of posting.
          </p>
        </div>

        {/* Quick link button to return to storefront catalog */}
        <button
          onClick={() => setActiveTab('shop')}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Storefront & Review Products
        </button>
      </div>

      {/* REVIEWS LIST SECTION (Target Role: Customer) */}
      {myFeedbacks.length > 0 ? (
        <div className="space-y-4">
          {myFeedbacks.map((item) => {
            // Check 7-day edit permission window
            const daysElapsed = getDaysElapsed(item.createdAt);
            const canEdit = daysElapsed <= 7;

            return (
              <div 
                key={item.id}
                className="p-6 rounded-3xl card-theme shadow-sm space-y-4 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 transition-colors"
              >
                {/* Review Header Row: Product/Order Name + Date + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">
                        {item.productName || (item.orderId ? `Order #${item.orderId}` : 'General Feedback')}
                      </span>
                      {item.productId && (
                        <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-zinc-800 text-slate-500 px-2.5 py-0.5 rounded-full">
                          Product Review
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Posted on {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-amber-500">
                        <Clock className="w-3 h-3" />
                        {daysElapsed === 0 ? 'Today' : `${daysElapsed} day(s) ago`}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Status Badge (Managed by Administrator via AVE-25) */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                      item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                      item.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                      item.status === 'hidden' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/30'
                    }`}>
                      {item.status === 'approved' ? '✓ Public Approved' :
                       item.status === 'pending' ? '⏳ Pending Moderation' :
                       item.status === 'hidden' ? '🔒 Soft Hidden' : '📁 Archived'}
                    </span>
                  </div>
                </div>

                {/* Rating Stars & Comment Body */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-zinc-700'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-black font-mono text-amber-500">
                      {item.rating}.0 / 5.0
                    </span>
                  </div>

                  {item.title && (
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      "{item.title}"
                    </h4>
                  )}

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300 whitespace-pre-line bg-slate-50 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
                    {item.comment}
                  </p>
                </div>

                {/* OFFICIAL ADMIN RESPONSE BOX (Target Role: Administrator AVE-25 Response Shown to Customer) */}
                {item.adminReply && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 ml-4">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                      <CornerDownRight className="w-4 h-4" />
                      <ShieldCheck className="w-4 h-4" />
                      <span>Official AVENZA Staff Response ({item.adminReply.repliedBy})</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        • {new Date(item.adminReply.repliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-zinc-200 font-medium pl-6">
                      "{item.adminReply.message}"
                    </p>
                  </div>
                )}

                {/* CARD ACTION FOOTER: 7-Day Rule Indicator + Edit/Delete Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  
                  {/* 7-Day Window Status Note */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    {!canEdit ? (
                      <span className="flex items-center gap-1 text-amber-500/90 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> 7-day edit restriction active (submitted {daysElapsed} days ago).
                      </span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">
                        ✓ Editable for {7 - daysElapsed} more day(s).
                      </span>
                    )}
                  </div>

                  {/* Edit & Delete Action Buttons (Target Role: Customer) */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      disabled={!canEdit}
                      onClick={() => openFeedbackModal({
                        type: 'edit',
                        initialData: item
                      })}
                      className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 border transition-all ${
                        canEdit
                          ? 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-700 hover:border-amber-500 cursor-pointer'
                          : 'bg-slate-100 dark:bg-zinc-900 text-slate-400 border-transparent cursor-not-allowed opacity-60'
                      }`}
                      title={canEdit ? 'Edit your review' : 'Editing disabled after 7 days from posting'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Review
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete your feedback review?')) {
                          deleteCustomerFeedback(item.id);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-rose-500/20 transition-all cursor-pointer"
                      title="Delete your review permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State Graphic */
        <div className="text-center py-16 px-4 rounded-3xl card-theme">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-lg font-bold">No Reviews Submitted Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            You haven't submitted any product ratings or feedback yet. Visit the catalog to leave your first review!
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="mt-4 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            Go to Apparel Shop
          </button>
        </div>
      )}

    </div>
  );
};
