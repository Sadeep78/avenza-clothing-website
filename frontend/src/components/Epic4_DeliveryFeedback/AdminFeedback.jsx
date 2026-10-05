/**
 * ====================================================================
 * AVENZA CLOTHING STORE - MANAGER FEEDBACK & CUSTOMER CARE MODERATION (AVE-26, AVE-27, AVE-28)
 * File: frontend/src/components/Epic4_DeliveryFeedback/AdminFeedback.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Store Manager / AVENZA Owner (Customer Feedback Moderation & Official Replies)
 * 
 * 🎯 USER STORIES COVERED:
 *   - AVE-26: As a Manager, I want to view and filter customer ratings and garment reviews, 
 *             so that I can evaluate customer satisfaction and identify service or product quality issues.
 *   - AVE-27: As a Manager, I want to officially reply to customer reviews and concerns, 
 *             so that customer inquiries are addressed, trust is strengthened, and store reputation is maintained.
 *   - AVE-28: As a Manager, I want to moderate customer feedback by approving, hiding, or archiving reviews, 
 *             so that abusive, inappropriate, or obsolete comments do not misrepresent the brand.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  EyeOff, 
  Archive, 
  Trash2, 
  Search, 
  Filter, 
  ShieldCheck, 
  CornerDownRight, 
  Send,
  X,
  TrendingUp,
  Clock
} from 'lucide-react';

export const AdminFeedback = () => {
  // Extract global feedback state and moderation handlers from AppContext
  const { 
    feedbacks, 
    changeFeedbackStatus, 
    respondToFeedback, 
    deleteCustomerFeedback 
  } = useApp();

  // Local filter and search states (Target Role: Manager - AVE-26)
  const [filterRating, setFilterRating] = useState('all'); // 'all', '5', '4', '3', '2', '1'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'approved', 'pending', 'hidden', 'archived'
  const [searchQuery, setSearchQuery] = useState('');     // Search input query string
  
  // Manager Reply Modal state (AVE-27)
  const [respondingTarget, setRespondingTarget] = useState(null); // Feedback object being replied to
  const [replyMessage, setReplyMessage] = useState('');           // Official reply message input

  /**
   * Analytics Calculation 1: Summary KPI Metrics (AVE-26)
   * Target Role: Manager / AVENZA Owner
   */
  const totalCount = feedbacks.length;
  const totalScore = feedbacks.reduce((sum, f) => sum + f.rating, 0);
  const avgRating = totalCount > 0 ? (totalScore / totalCount).toFixed(1) : '0.0';
  const pendingCount = feedbacks.filter(f => f.status === 'pending').length;

  /**
   * Analytics Calculation 2: Rating Star Distribution Count
   * Target Role: Manager
   */
  const countByStar = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach(f => {
    if (countByStar[f.rating] !== undefined) countByStar[f.rating]++;
  });

  /**
   * Filtered List Computation: Multi-criteria filtering by star rating, status, and keyword search (AVE-26)
   * Target Role: Manager
   */
  const filteredFeedbacks = feedbacks.filter(f => {
    if (filterRating !== 'all' && f.rating !== Number(filterRating)) return false;
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCust = f.customerName?.toLowerCase().includes(q) || f.customerEmail?.toLowerCase().includes(q);
      const matchProd = f.productName?.toLowerCase().includes(q) || f.orderId?.toLowerCase().includes(q);
      const matchComment = f.comment?.toLowerCase().includes(q) || f.title?.toLowerCase().includes(q);
      if (!matchCust && !matchProd && !matchComment) return false;
    }
    return true;
  });

  /**
   * Handler: Open Manager Reply Modal (AVE-27)
   * Purpose: Pre-fills any existing reply message for editing.
   */
  const handleOpenReplyModal = (item) => {
    setRespondingTarget(item);
    setReplyMessage(item.adminReply?.message || '');
  };

  /**
   * Handler: Publish Official Store Manager Response (AVE-27)
   * Purpose: Saves reply text to state and backend REST API.
   */
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    respondToFeedback(respondingTarget.id, replyMessage);
    setRespondingTarget(null);
    setReplyMessage('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* CONSOLE HEADER BANNER */}
      <div className="p-6 rounded-3xl card-theme shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Manager & Operations Portal</span>
          </div>
          <h2 className="text-2xl font-black">
            Customer Feedback & Review Moderation
          </h2>
          <p className="text-xs text-slate-500">
            View & filter satisfaction ratings, publish official Manager responses, and approve, hide, or archive reviews.
          </p>
        </div>
      </div>

      {/* STATISTICS TOP GRID (Target Role: Manager - AVE-26 KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* KPI Card 1: Total Customer Reviews */}
        <div className="p-5 rounded-3xl card-theme shadow-sm border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Customer Reviews</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono">{totalCount}</span>
            <MessageSquare className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-500">Across all products and orders</p>
        </div>

        {/* KPI Card 2: Overall Average Rating */}
        <div className="p-5 rounded-3xl card-theme shadow-sm border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Average Rating</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-amber-500 flex items-center gap-1">
              ★ {avgRating}
            </span>
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-[11px] text-slate-500">Satisfaction index / 5.0</p>
        </div>

        {/* KPI Card 3: Pending Moderation Count */}
        <div className="p-5 rounded-3xl card-theme shadow-sm border border-slate-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Moderation</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-amber-400">{pendingCount}</span>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-[11px] text-slate-500">Awaiting admin review</p>
        </div>

        {/* KPI Card 4: Rating Star Distribution Progress Bars */}
        <div className="p-4 rounded-3xl card-theme shadow-sm border border-slate-200 dark:border-zinc-800 space-y-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rating Distribution</span>
          <div className="space-y-1 pt-1">
            {[5, 4, 3, 2, 1].map(s => {
              const count = countByStar[s] || 0;
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className="w-5 font-mono font-bold">{s}★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="w-6 font-mono text-slate-400 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* FILTER & SEARCH CONTROL BAR (Target Role: Administrator) */}
      <div className="p-5 rounded-3xl card-theme shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, product, review..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Multi-Criteria Select Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Star Rating Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-400">Rating:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Stars (1–5★)</option>
              <option value="5">5 Stars (5★)</option>
              <option value="4">4 Stars (4★)</option>
              <option value="3">3 Stars (3★)</option>
              <option value="2">2 Stars (2★)</option>
              <option value="1">1 Star (1★)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

      </div>

      {/* REVIEWS MODERATION TABLE VIEW (Target Role: Administrator - AVE-25 Controls) */}
      <div className="rounded-3xl card-theme shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-5">Item / Order Context</th>
                <th className="py-4 px-5">Rating & Review</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    
                    {/* Column 1: Customer Details */}
                    <td className="py-4 px-5">
                      <p className="font-extrabold text-slate-900 dark:text-white">{item.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{item.customerEmail}</p>
                    </td>

                    {/* Column 2: Product / Order Context */}
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-800 dark:text-zinc-200">
                        {item.productName || (item.orderId ? `Order #${item.orderId}` : 'General Store')}
                      </p>
                      {item.orderId && (
                        <p className="text-[10px] text-amber-500 font-mono font-semibold">Ref Order: {item.orderId}</p>
                      )}
                    </td>

                    {/* Column 3: Rating Stars, Title & Comment */}
                    <td className="py-4 px-5 max-w-xs space-y-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-zinc-700'}`} />
                        ))}
                        <span className="font-bold font-mono text-amber-500 ml-1">{item.rating}.0</span>
                      </div>
                      {item.title && <p className="font-extrabold text-slate-900 dark:text-white text-[11px]">"{item.title}"</p>}
                      <p className="text-slate-600 dark:text-zinc-300 truncate font-normal" title={item.comment}>{item.comment}</p>
                      
                      {/* Admin Response Snippet Preview */}
                      {item.adminReply && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 pt-0.5">
                          <CornerDownRight className="w-3 h-3" /> Responded: "{item.adminReply.message.slice(0, 40)}..."
                        </div>
                      )}
                    </td>

                    {/* Column 4: Moderation Status Badge */}
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                        item.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        item.status === 'hidden' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Column 5: Created Date */}
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    {/* Column 6: Action Buttons */}
                    <td className="py-4 px-5 text-right space-x-1 whitespace-nowrap">
                      
                      {/* Action 1: Manager Reply Button */}
                      <button
                        onClick={() => handleOpenReplyModal(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                        title="Publish official Store Manager reply"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply
                      </button>

                      {/* Action 2: Approve Button (Public Visibility) */}
                      {item.status !== 'approved' && (
                        <button
                          onClick={() => changeFeedbackStatus(item.id, 'approved')}
                          className="px-2 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                          title="Approve review for public storefront display"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}

                      {/* Action 3: Soft Hide Button (Hides from public storefront, author customer still sees it) */}
                      {item.status !== 'hidden' && (
                        <button
                          onClick={() => changeFeedbackStatus(item.id, 'hidden')}
                          className="px-2 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                          title="Soft hide from public storefront"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          Hide
                        </button>
                      )}

                      {/* Action 4: Archive Button */}
                      {item.status !== 'archived' && (
                        <button
                          onClick={() => changeFeedbackStatus(item.id, 'archived')}
                          className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-white font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                          title="Archive historical review"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Action 5: Permanent Delete Button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Permanently delete feedback review from ${item.customerName}?`)) {
                            deleteCustomerFeedback(item.id);
                          }
                        }}
                        className="px-2 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No customer feedback entries match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL STORE MANAGER RESPONSE COMPOSER MODAL */}
      {respondingTarget && (
        <div 
          onClick={() => setRespondingTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 cursor-default"
          >
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-black">Official Store Reply</span>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  Reply to {respondingTarget.customerName}'s Review
                </h3>
              </div>
              <button onClick={() => setRespondingTarget(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Review Summary Snippet */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-amber-500">★ {respondingTarget.rating}.0 - "{respondingTarget.title || 'Review'}"</p>
                <span className="text-[10px] text-slate-400 font-mono">{respondingTarget.customerName}</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-300 italic">"{respondingTarget.comment}"</p>
            </div>

            {/* Response Form */}
            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Official Manager Reply Message *
                  </label>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Replying as Store Manager (AVENZA Operations)
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank you for sharing your feedback! At AVENZA, we are committed to top-tier garment quality and customer satisfaction..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Publish Manager Reply
                </button>
                <button
                  type="button"
                  onClick={() => setRespondingTarget(null)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
