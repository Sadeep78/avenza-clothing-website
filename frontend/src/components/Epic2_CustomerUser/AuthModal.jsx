/**
 * ====================================================================
 * AVENZA CLOTHING STORE - UNIFIED AUTHENTICATION MODAL COMPONENT
 * File: frontend/src/components/Epic2_CustomerUser/AuthModal.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - All Users (Customers & Admins logging in or registering)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Unified modal handling user authentication:
 *   1. Account Login (Email/Username & Password).
 *   2. Account Registration for new customers.
 *   3. Pre-filled demo credentials shortcuts (Admin vs. Customer).
 *   4. Inline typing field validation and error alerts.
 *   5. Backdrop click-outside modal dismissal.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, usersList, pendingCheckout, setPendingCheckout } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field errors and touch states for typing validation
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');

  if (!isAuthModalOpen) return null;

  // Real-time validation logic
  const validateField = (field, value) => {
    let error = '';

    if (field === 'name' && isRegistering) {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Full name is required';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 characters';
      } else if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
        error = 'Name can only contain letters (A-Z, a-z)';
      }
    }

    if (field === 'identifier') {
      const raw = value || '';
      const trimmed = raw.trim();
      if (!trimmed) {
        error = 'Email or username is required';
      } else if (trimmed.includes('@')) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          error = 'Please enter a valid email address';
        } else if (isRegistering && usersList && usersList.some(u => u.email && u.email.toLowerCase().trim() === trimmed.toLowerCase())) {
          error = 'This email is already registered. Please use another email or sign in.';
        }
      } else {
        if (!/^[a-zA-Z]+$/.test(raw)) {
          error = 'Username can only contain letters (A-Z, a-z). Slashes like "\\" and numbers are not allowed.';
        } else if (trimmed.length < 3) {
          error = 'Username must be at least 3 letters';
        }
      }
    }

    if (field === 'phone' && isRegistering) {
      const trimmed = (value || '').trim();
      const digits = trimmed.replace(/[\s\-\+\(\)]/g, '');
      if (!trimmed) {
        error = 'Phone number is required';
      } else if (digits.length < 7 || digits.length > 15 || !/^\+?[0-9\s\-\(\)]+$/.test(trimmed)) {
        error = 'Enter a valid phone number (e.g. +94 77 123 4567)';
      }
    }

    if (field === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters';
      }
    }

    if (field === 'confirmPassword' && isRegistering) {
      if (!value) {
        error = 'Confirm password is required';
      } else if (value !== password) {
        error = 'Passwords do not match';
      }
    }

    return error;
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setFormError('');
    const err = validateField('name', val);
    setTouched(prev => ({ ...prev, name: true }));
    setErrors(prev => ({ ...prev, name: err }));
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setIdentifier(val);
    setFormError('');
    const err = validateField('identifier', val);
    setTouched(prev => ({ ...prev, identifier: true }));
    setErrors(prev => ({ ...prev, identifier: err }));
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    setFormError('');
    const err = validateField('phone', val);
    setTouched(prev => ({ ...prev, phone: true }));
    setErrors(prev => ({ ...prev, phone: err }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setFormError('');
    const err = validateField('password', val);
    setTouched(prev => ({ ...prev, password: true }));
    setErrors(prev => {
      const next = { ...prev, password: err };
      if (isRegistering && (touched.confirmPassword || confirmPassword)) {
        next.confirmPassword = val !== confirmPassword ? 'Passwords do not match' : '';
      }
      return next;
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    setFormError('');
    const err = !val ? 'Confirm password is required' : val !== password ? 'Passwords do not match' : '';
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    setErrors(prev => ({ ...prev, confirmPassword: err }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'name') val = name;
    if (field === 'identifier') val = identifier;
    if (field === 'phone') val = phone;
    if (field === 'password') val = password;
    if (field === 'confirmPassword') val = confirmPassword;
    setErrors(prev => ({ ...prev, [field]: validateField(field, val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTouched = { identifier: true, password: true };
    if (isRegistering) {
      newTouched.name = true;
      newTouched.phone = true;
      newTouched.confirmPassword = true;
    }
    setTouched(newTouched);

    const nameErr = isRegistering ? validateField('name', name) : '';
    const idErr = validateField('identifier', identifier);
    const phoneErr = isRegistering ? validateField('phone', phone) : '';
    const passErr = validateField('password', password);
    const confirmErr = isRegistering 
      ? (!confirmPassword ? 'Confirm password is required' : confirmPassword !== password ? 'Passwords do not match' : '')
      : '';

    const newErrors = {
      identifier: idErr,
      password: passErr,
      ...(isRegistering && { name: nameErr, phone: phoneErr, confirmPassword: confirmErr })
    };
    setErrors(newErrors);

    if (idErr || passErr || (isRegistering && (nameErr || phoneErr || confirmErr))) {
      if (isRegistering && confirmErr) {
        setFormError(confirmErr);
      } else {
        setFormError('Please resolve the highlighted validation errors above.');
      }
      return;
    }

    if (isRegistering) {
      const result = await register(name, identifier, phone, password);
      if (result && !result.success) {
        setFormError(result.error || 'This email is already registered. Please use another email.');
        if (result.error && result.error.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, identifier: result.error }));
          setTouched(prev => ({ ...prev, identifier: true }));
        }
      } else {
        handleClose();
      }
    } else {
      const result = login(identifier, password);
      if (result && !result.success) {
        setFormError(result.error || 'Invalid credentials. Please try again.');
      } else {
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    if (pendingCheckout) setPendingCheckout(false);
    setName('');
    setIdentifier('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setTouched({});
    setFormError('');
    setIsRegistering(false);
  };

  return (
    <div 
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 cursor-default"
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <span className="font-carnage-logo text-base tracking-[0.2em] text-amber-500 block">
            AVENZA CLOTHING STORE
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {isRegistering ? 'Create Customer Account' : 'Account Sign In'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {isRegistering 
              ? 'Register a new customer account to place orders & track shipments' 
              : 'Enter your email address or username and password to sign in'}
          </p>
        </div>

        {/* Pending Checkout Alert Banner */}
        {pendingCheckout && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2.5 font-medium animate-in fade-in">
            <span className="text-base shrink-0">🛍️</span>
            <span>
              <strong>Sign In to Complete Order:</strong> Please sign in or create an account to proceed with checkout. Your shopping bag items are saved!
            </span>
          </div>
        )}

        {/* Form Error Banner */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{formError}</span>
            </div>
            {isRegistering && formError.toLowerCase().includes('already registered') && (
              <div className="pl-6 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setFormError('');
                    setErrors({});
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  Sign In with this email →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Unified Single Login Form for All Users */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          {/* Full Name field (Registration Only) */}
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  touched.name && errors.name ? 'text-rose-500' : 'text-slate-400'
                }`} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sasanka Perera"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => handleBlur('name')}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm focus:outline-none transition-colors ${
                    touched.name && errors.name
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                      : touched.name && !errors.name && name
                      ? 'border-emerald-500/60 focus:border-emerald-500'
                      : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                  }`}
                />
                {touched.name && !errors.name && name && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
              </div>
              {touched.name && errors.name && (
                <p className="text-rose-500 text-[11px] font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email or Username field */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              {isRegistering ? 'Email Address' : 'Email Address or Username'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                touched.identifier && errors.identifier ? 'text-rose-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                required
                placeholder={isRegistering ? "e.g. customer@avenza.com" : "customer, staff, manager or admin"}
                value={identifier}
                onChange={handleIdentifierChange}
                onBlur={() => handleBlur('identifier')}
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm font-mono text-xs focus:outline-none transition-colors ${
                  touched.identifier && errors.identifier
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                    : touched.identifier && !errors.identifier && identifier
                    ? 'border-emerald-500/60 focus:border-emerald-500'
                    : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                }`}
              />
              {touched.identifier && !errors.identifier && identifier && (
                <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {touched.identifier && errors.identifier && (
              <p className="text-rose-500 text-[11px] font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.identifier}
              </p>
            )}
          </div>

          {/* Phone Number field (Registration Only - AVE-01) */}
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  touched.phone && errors.phone ? 'text-rose-500' : 'text-slate-400'
                }`} />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +94 77 123 4567"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm font-mono text-xs focus:outline-none transition-colors ${
                    touched.phone && errors.phone
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                      : touched.phone && !errors.phone && phone
                      ? 'border-emerald-500/60 focus:border-emerald-500'
                      : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                  }`}
                />
                {touched.phone && !errors.phone && phone && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
              </div>
              {touched.phone && errors.phone ? (
                <p className="text-rose-500 text-[11px] font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">
                  🔒 Kept strictly private. Never displayed publicly on the website.
                </p>
              )}
            </div>
          )}

          {/* Password field with Show/Hide toggle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Password <span className="text-rose-500">*</span>
              </label>
              {password && (
                <span className={`text-[10px] font-bold ${
                  password.length < 6 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {password.length < 6 ? `${password.length}/6 characters` : 'Length OK ✓'}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                touched.password && errors.password ? 'text-rose-500' : 'text-slate-400'
              }`} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm font-mono text-xs focus:outline-none transition-colors ${
                  touched.password && errors.password
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                    : touched.password && !errors.password && password
                    ? 'border-emerald-500/60 focus:border-emerald-500'
                    : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-rose-500 text-[11px] font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field (Registration Only) */}
          {isRegistering && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-500 uppercase">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-bold ${
                    confirmPassword === password && password.length >= 6
                      ? 'text-emerald-500' 
                      : 'text-rose-500'
                  }`}>
                    {confirmPassword === password && password.length >= 6 
                      ? 'Passwords match ✓' 
                      : 'Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  touched.confirmPassword && errors.confirmPassword ? 'text-rose-500' : 'text-slate-400'
                }`} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm font-mono text-xs focus:outline-none transition-colors ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                      : touched.confirmPassword && !errors.confirmPassword && confirmPassword && confirmPassword === password
                      ? 'border-emerald-500/60 focus:border-emerald-500'
                      : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-rose-500 text-[11px] font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Show Password Checkbox Option */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword && (!isRegistering || showConfirmPassword)}
                onChange={(e) => {
                  const val = e.target.checked;
                  setShowPassword(val);
                  setShowConfirmPassword(val);
                }}
                className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
              />
              <span>Show password</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isRegistering ? 'Create Customer Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch between Sign In and Registration for Customers */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrors({});
              setTouched({});
              setFormError('');
            }}
            className="text-xs text-slate-500 hover:text-amber-500 font-semibold transition-colors cursor-pointer"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register as Customer"}
          </button>
        </div>
      </div>
    </div>
  );
};
