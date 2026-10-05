/**
 * ====================================================================
 * AVENZA CLOTHING STORE - CHECKOUT & ORDER PLACEMENT MODAL
 * File: frontend/src/components/Epic3_CartPayment/CheckoutModal.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Customer (Completes shipping details, selects delivery speed, & places order)
 * 
 * 🎯 EPIC: E3 - Shopping Cart and Payment Management
 *   Purpose: Multi-step order checkout modal:
 *   1. Step 1: Shipping address & recipient contact form.
 *   2. Step 2: Islandwide delivery speed selection (Standard Courier vs. Express Colombo).
 *   3. Step 3: Payment method choice (Visa/Mastercard or Cash on Delivery).
 *   4. Step 4: Confetti celebration animation & order summary invoice generation.
 *   5. Backdrop click-outside modal dismissal.
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CreditCard, 
  MapPin, 
  Truck, 
  Check, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Banknote, 
  CheckCircle2,
  AlertCircle,
  Edit3,
  ShieldCheck,
  Upload,
  FileText,
  Trash2,
  Paperclip,
  Image as ImageIcon
} from 'lucide-react';
import { 
  validateCardField, 
  validateAllCardDetails, 
  detectCardBrand, 
  formatCardNumber, 
  formatExpiry 
} from '../../utils/cardValidator';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { 
    cartTotal, 
    placeOrder, 
    user, 
    formatLKR, 
    systemSettings, 
    getSavedAddresses,
    updateCustomerAddress,
    getSavedCards,
    saveCustomerCard,
    updateCustomerCard,
    deleteCustomerCard,
    setIsAuthModalOpen,
    setPendingCheckout,
    setPaymentSuccessOrder,
    setActiveTab,
    showToast 
  } = useApp();

  const [step, setStep] = useState(1);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [addressMode, setAddressMode] = useState('saved'); // 'saved' | 'different'
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [saveAddressChecked, setSaveAddressChecked] = useState(true);
  const [addressError, setAddressError] = useState('');
  const [shippingErrors, setShippingErrors] = useState({});
  const [shippingTouched, setShippingTouched] = useState({});

  // Saved Credit / Debit Cards state (AVE-SavedCards)
  const [cardMode, setCardMode] = useState('saved'); // 'saved' | 'different'
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [saveCardChecked, setSaveCardChecked] = useState(true);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [editCardForm, setEditCardForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [editCardErrors, setEditCardErrors] = useState({});
  const [editCardTouched, setEditCardTouched] = useState({});

  // Editing state for existing saved address
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [editAddressForm, setEditAddressForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [editTouched, setEditTouched] = useState({});

  const cleanName = (str) => (str || '').replace(/\s*\([^)]*\)/g, '').trim();

  const [shippingForm, setShippingForm] = useState({
    fullName: cleanName(user?.name),
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || ''
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  const [paymentForm, setPaymentForm] = useState({
    method: 'card',
    cardNumber: '4111 1111 1111 1111',
    cardName: cleanName(user?.name) || 'Sasanka Perera',
    expiry: '08/28',
    cvv: '882'
  });
  const [cardErrors, setCardErrors] = useState({});
  const [cardTouched, setCardTouched] = useState({});
  const [paymentError, setPaymentError] = useState('');

  // Cash on Delivery Advance Slip state & handlers
  const [codPaymentSlip, setCodPaymentSlip] = useState(null);
  const [slipError, setSlipError] = useState('');

  const handleSlipUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSlipError('File size exceeds 5MB limit. Please upload a smaller receipt / slip.');
      showToast('File size exceeds 5MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCodPaymentSlip({
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileType: file.type,
        fileData: event.target.result,
        uploadedAt: new Date().toLocaleTimeString()
      });
      setSlipError('');
      showToast('LKR 500 advance deposit slip attached successfully! 📄', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSlip = () => {
    setCodPaymentSlip(null);
    setSlipError('');
  };

  const handleAttachDemoSlip = () => {
    setCodPaymentSlip({
      fileName: 'Commercial_Bank_Deposit_Slip_LKR500.jpg',
      fileSize: '248.5 KB',
      fileType: 'image/jpeg',
      fileData: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      uploadedAt: new Date().toLocaleTimeString(),
      isDemo: true
    });
    setSlipError('');
    showToast('Demo bank deposit slip attached! 📄', 'info');
  };

  const handleCardFieldChange = (field, value) => {
    let formatted = value;
    if (field === 'cardNumber') {
      formatted = formatCardNumber(value);
    } else if (field === 'expiry') {
      formatted = formatExpiry(value);
    } else if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentForm(prev => ({ ...prev, [field]: formatted }));
    if (paymentError) setPaymentError('');

    if (cardTouched[field]) {
      const err = validateCardField(field, formatted, { ...paymentForm, [field]: formatted });
      setCardErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleCardFieldBlur = (field) => {
    setCardTouched(prev => ({ ...prev, [field]: true }));
    const err = validateCardField(field, paymentForm[field], paymentForm);
    setCardErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleFillDemoCard = (brand) => {
    if (brand === 'visa') {
      setPaymentForm(prev => ({
        ...prev,
        method: 'card',
        cardNumber: '4111 1111 1111 1111',
        cardName: cleanName(user?.name) || 'Sasanka Perera',
        expiry: '08/28',
        cvv: '882'
      }));
    } else {
      setPaymentForm(prev => ({
        ...prev,
        method: 'card',
        cardNumber: '5555 5555 5555 4444',
        cardName: cleanName(user?.name) || 'Sasanka Perera',
        expiry: '12/28',
        cvv: '542'
      }));
    }
    setCardErrors({});
    setCardTouched({});
    setPaymentError('');
    showToast(`Loaded test ${brand === 'visa' ? 'Visa' : 'Mastercard'} card details 💳`, 'info');
  };

  // Saved Cards Operations (Selection, Editing, Deletion)
  const handleSelectSavedCard = (index) => {
    setSelectedCardIndex(index);
    const sel = savedCards[index];
    if (sel) {
      setPaymentForm(prev => ({
        ...prev,
        method: 'card',
        cardNumber: sel.cardNumber,
        cardName: sel.cardName,
        expiry: sel.expiry,
        cvv: sel.cvv
      }));
      setCardErrors({});
      setCardTouched({});
      setPaymentError('');
    }
  };

  const handleStartEditCard = (e, index) => {
    e.stopPropagation();
    const card = savedCards[index];
    if (!card) return;
    setEditingCardIndex(index);
    setEditCardForm({
      cardNumber: card.cardNumber || '',
      cardName: card.cardName || '',
      expiry: card.expiry || '',
      cvv: card.cvv || ''
    });
    setEditCardErrors({});
    setEditCardTouched({});
  };

  const handleCancelEditCard = (e) => {
    if (e) e.stopPropagation();
    setEditingCardIndex(null);
    setEditCardErrors({});
    setEditCardTouched({});
  };

  const handleEditCardFieldChange = (field, value) => {
    let formatted = value;
    if (field === 'cardNumber') {
      formatted = formatCardNumber(value);
    } else if (field === 'expiry') {
      formatted = formatExpiry(value);
    } else if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 3);
    }

    setEditCardForm(prev => ({ ...prev, [field]: formatted }));
    if (editCardTouched[field]) {
      const error = validateCardField(field, formatted);
      setEditCardErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleEditCardFieldBlur = (field) => {
    setEditCardTouched(prev => ({ ...prev, [field]: true }));
    const error = validateCardField(field, editCardForm[field]);
    setEditCardErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSaveEditedCard = async (e, index) => {
    e.stopPropagation();
    const { isValid, errors, firstError } = validateAllCardDetails(editCardForm);
    if (!isValid) {
      setEditCardErrors(errors);
      setEditCardTouched({
        cardNumber: true,
        cardName: true,
        expiry: true,
        cvv: true
      });
      showToast(firstError || 'Please correct the card details before saving.', 'error');
      return;
    }

    const targetCard = savedCards[index];
    const detectedBrand = detectCardBrand(editCardForm.cardNumber);
    const last4 = editCardForm.cardNumber.replace(/\D/g, '').slice(-4);

    const updatedCard = {
      ...targetCard,
      cardNumber: editCardForm.cardNumber,
      cardName: editCardForm.cardName.trim(),
      expiry: editCardForm.expiry,
      cvv: editCardForm.cvv,
      cardBrand: detectedBrand,
      last4
    };

    let updatedList = [];
    if (updateCustomerCard) {
      updatedList = updateCustomerCard(targetCard?.id || index, updatedCard, user?.email);
    }
    const newCards = updatedList && updatedList.length > 0 ? updatedList : savedCards.map((c, i) => i === index ? updatedCard : c);
    setSavedCards(newCards);

    if (selectedCardIndex === index) {
      setPaymentForm(prev => ({
        ...prev,
        cardNumber: updatedCard.cardNumber,
        cardName: updatedCard.cardName,
        expiry: updatedCard.expiry,
        cvv: updatedCard.cvv
      }));
      setCardErrors({});
    }

    setEditingCardIndex(null);
    showToast('Saved card updated successfully! 💳', 'success');
  };

  const handleDeleteCard = (e, index) => {
    e.stopPropagation();
    const targetCard = savedCards[index];
    if (!targetCard) return;

    let updatedList = [];
    if (deleteCustomerCard) {
      updatedList = deleteCustomerCard(targetCard?.id || index, user?.email);
    }
    const newCards = updatedList || savedCards.filter((_, i) => i !== index);
    setSavedCards(newCards);

    if (newCards.length === 0) {
      setCardMode('different');
      setPaymentForm(prev => ({
        ...prev,
        cardNumber: '',
        cardName: cleanName(user?.name) || '',
        expiry: '',
        cvv: ''
      }));
    } else {
      const nextIdx = Math.min(selectedCardIndex, newCards.length - 1);
      setSelectedCardIndex(nextIdx);
      const sel = newCards[nextIdx];
      setPaymentForm(prev => ({
        ...prev,
        cardNumber: sel.cardNumber,
        cardName: sel.cardName,
        expiry: sel.expiry,
        cvv: sel.cvv
      }));
    }
  };

  // Strict validation rules for recipient shipping fields
  const validateShippingField = (field, value) => {
    const rawVal = value || '';
    const val = rawVal.trim();

    switch (field) {
      case 'fullName':
        if (!val) return 'Full name is required.';
        if (/\d/.test(val)) return 'Full name cannot contain numbers (letters only).';
        if (!/^[a-zA-Z\s.'()\-]+$/.test(val)) return 'Full name can only contain letters and spaces.';
        if (val.length < 2) return 'Full name must be at least 2 characters.';
        return '';

      case 'email':
        if (!val) return 'Email address is required.';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
          return 'Please enter a valid email format (e.g. customer@example.com).';
        }
        return '';

      case 'address':
        if (!val) return 'Street address is required.';
        if (!/\d/.test(val)) {
          return 'Street address must include a house / building / street number (e.g. No. 45, Temple Road).';
        }
        if (val.length < 5) return 'Please enter a complete street address.';
        return '';

      case 'city':
        if (!val) return 'City / Town is required.';
        if (/\d/.test(val)) return 'City cannot contain numbers.';
        if (/[^a-zA-Z\s]/.test(val)) return 'City cannot contain symbols or special characters (letters only).';
        if (val.length < 2) return 'Please enter a valid city name.';
        return '';

      case 'phone': {
        if (!val) return 'Contact phone number is required.';
        if (/[a-zA-Z]/.test(val)) return 'Phone number cannot contain letters.';
        if (!val.startsWith('+')) {
          return "Phone number must include country code starting with '+' (e.g. +94 77 123 4567).";
        }
        const digitsOnly = val.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
          return 'Please enter a valid phone number length with country code (10-15 digits).';
        }
        return '';
      }

      case 'postalCode':
        if (val) {
          if (/[a-zA-Z]/.test(val)) return 'Postal code cannot contain letters (numbers only).';
          if (!/^[0-9\s-]{4,10}$/.test(val)) return 'Postal code must contain numbers only (e.g. 00700).';
        }
        return '';

      default:
        return '';
    }
  };

  const handleFieldChange = (field, value) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
    if (shippingTouched[field]) {
      const error = validateShippingField(field, value);
      setShippingErrors(prev => ({ ...prev, [field]: error }));
    }
    if (addressError) setAddressError('');
  };

  const handleFieldBlur = (field) => {
    setShippingTouched(prev => ({ ...prev, [field]: true }));
    const error = validateShippingField(field, shippingForm[field]);
    setShippingErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAllShipping = () => {
    const fields = ['fullName', 'email', 'address', 'city', 'phone', 'postalCode'];
    const newErrors = {};
    let firstError = '';

    fields.forEach(f => {
      const err = validateShippingField(f, shippingForm[f]);
      if (err) {
        newErrors[f] = err;
        if (!firstError) firstError = err;
      }
    });

    setShippingErrors(newErrors);
    setShippingTouched({
      fullName: true,
      email: true,
      address: true,
      city: true,
      phone: true,
      postalCode: true
    });

    return { isValid: !firstError, firstError };
  };

  // Automatically sync with the active logged-in user and saved addresses when checkout opens
  useEffect(() => {
    if (isOpen) {
      if (!user) {
        onClose();
        setPendingCheckout(true);
        setIsAuthModalOpen(true);
        showToast('Please sign in or create an account to proceed to checkout! 🛍️', 'info');
        return;
      }

      setStep(1);
      setAddressError('');
      setShippingErrors({});
      setShippingTouched({});
      setSelectedAddressIndex(0);

      const list = getSavedAddresses ? getSavedAddresses(user?.email) : [];
      setSavedAddresses(list || []);

      if (list && list.length > 0) {
        setAddressMode('saved');
        const defaultAddr = list[0];
        setShippingForm({
          fullName: cleanName(defaultAddr.fullName || user?.name || ''),
          email: defaultAddr.email || user?.email || '',
          phone: defaultAddr.phone || user?.phone || '',
          address: defaultAddr.address || '',
          city: defaultAddr.city || '',
          postalCode: defaultAddr.postalCode || ''
        });
      } else if (user && user.address && user.address.trim() && user.address !== 'No. 12, Main Street') {
        setAddressMode('saved');
        const fallback = {
          id: 'addr-default',
          fullName: cleanName(user.name || ''),
          email: user.email || '',
          phone: user.phone || '',
          address: user.address,
          city: user.city || 'Colombo',
          postalCode: user.postalCode || '00700',
          isDefault: true
        };
        setSavedAddresses([fallback]);
        setShippingForm({
          fullName: fallback.fullName,
          email: fallback.email,
          phone: fallback.phone,
          address: fallback.address,
          city: fallback.city,
          postalCode: fallback.postalCode
        });
      } else {
        // Brand new customer with no saved address yet
        setAddressMode('different');
        setShippingForm({
          fullName: cleanName(user?.name || ''),
          email: user?.email || '',
          phone: user?.phone || '',
          address: '',
          city: '',
          postalCode: ''
        });
      }

      // Saved Credit / Debit Cards Synchronization
      const cardsList = getSavedCards ? getSavedCards(user?.email) : [];
      setSavedCards(cardsList || []);
      setEditingCardIndex(null);
      setEditCardErrors({});
      setEditCardTouched({});

      if (cardsList && cardsList.length > 0) {
        setCardMode('saved');
        setSelectedCardIndex(0);
        const defCard = cardsList[0];
        setPaymentForm(prev => ({
          ...prev,
          method: 'card',
          cardNumber: defCard.cardNumber,
          cardName: defCard.cardName || cleanName(user?.name) || 'Sasanka Perera',
          expiry: defCard.expiry,
          cvv: defCard.cvv
        }));
      } else {
        setCardMode('different');
        setPaymentForm(prev => ({
          ...prev,
          method: 'card',
          cardNumber: '4111 1111 1111 1111',
          cardName: cleanName(user?.name) || 'Sasanka Perera',
          expiry: '08/28',
          cvv: '882'
        }));
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSelectSavedAddress = (index) => {
    setSelectedAddressIndex(index);
    const sel = savedAddresses[index];
    if (sel) {
      setShippingForm({
        fullName: cleanName(sel.fullName || user?.name || ''),
        email: sel.email || user?.email || '',
        phone: sel.phone || user?.phone || '',
        address: sel.address || '',
        city: sel.city || '',
        postalCode: sel.postalCode || ''
      });
      setShippingErrors({});
      setShippingTouched({});
    }
  };

  const handleStartEditAddress = (e, index) => {
    e.stopPropagation();
    const addr = savedAddresses[index];
    if (!addr) return;
    setEditingAddressIndex(index);
    setEditAddressForm({
      fullName: cleanName(addr.fullName || user?.name || ''),
      email: addr.email || user?.email || '',
      phone: addr.phone || user?.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      postalCode: addr.postalCode || ''
    });
    setEditErrors({});
    setEditTouched({});
  };

  const handleCancelEditAddress = (e) => {
    if (e) e.stopPropagation();
    setEditingAddressIndex(null);
    setEditErrors({});
    setEditTouched({});
  };

  const handleEditFieldChange = (field, value) => {
    setEditAddressForm(prev => ({ ...prev, [field]: value }));
    if (editTouched[field]) {
      const error = validateShippingField(field, value);
      setEditErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleEditFieldBlur = (field) => {
    setEditTouched(prev => ({ ...prev, [field]: true }));
    const error = validateShippingField(field, editAddressForm[field]);
    setEditErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSaveEditedAddress = async (e, index) => {
    e.stopPropagation();
    const fields = ['fullName', 'email', 'address', 'city', 'phone', 'postalCode'];
    const newErrors = {};
    let firstError = '';

    fields.forEach(f => {
      const err = validateShippingField(f, editAddressForm[f]);
      if (err) {
        newErrors[f] = err;
        if (!firstError) firstError = err;
      }
    });

    setEditErrors(newErrors);
    setEditTouched({
      fullName: true,
      email: true,
      address: true,
      city: true,
      phone: true,
      postalCode: true
    });

    if (firstError) {
      showToast(firstError, 'error');
      return;
    }

    const targetAddr = savedAddresses[index];
    const updatedAddr = {
      ...targetAddr,
      fullName: editAddressForm.fullName.trim(),
      email: editAddressForm.email.trim(),
      phone: editAddressForm.phone.trim(),
      address: editAddressForm.address.trim(),
      city: editAddressForm.city.trim(),
      postalCode: editAddressForm.postalCode.trim()
    };

    const newSavedAddresses = [...savedAddresses];
    newSavedAddresses[index] = updatedAddr;
    setSavedAddresses(newSavedAddresses);

    if (selectedAddressIndex === index) {
      setShippingForm({
        fullName: updatedAddr.fullName,
        email: updatedAddr.email,
        phone: updatedAddr.phone,
        address: updatedAddr.address,
        city: updatedAddr.city,
        postalCode: updatedAddr.postalCode
      });
      setShippingErrors({});
    }

    if (updateCustomerAddress) {
      await updateCustomerAddress(targetAddr?.id || index, updatedAddr);
    }

    setEditingAddressIndex(null);
    showToast('Saved shipping address updated successfully! ✅', 'success');
  };

  const handleProceedToStep2 = () => {
    setAddressError('');
    const { isValid, firstError } = validateAllShipping();
    if (!isValid) {
      setAddressError(firstError || 'Please correct the highlighted errors before proceeding.');
      return;
    }
    setStep(2);
  };

  const handleCompletePayment = (e) => {
    e.preventDefault();
    if (systemSettings?.maintenanceMode) {
      return;
    }

    setPaymentError('');

    // Strict Visa & Mastercard card validation
    if (paymentForm.method === 'card') {
      const { isValid, errors, firstError } = validateAllCardDetails(paymentForm);
      if (!isValid) {
        setCardErrors(errors);
        setCardTouched({
          cardNumber: true,
          cardName: true,
          expiry: true,
          cvv: true
        });
        setPaymentError(firstError || 'Please correct the card details before proceeding.');
        showToast(firstError || 'Please provide a valid Visa or Mastercard.', 'error');
        return;
      }

      // Automatically save card if user opted-in while adding a different card
      if (cardMode === 'different' && saveCardChecked && saveCustomerCard) {
        saveCustomerCard(paymentForm, user?.email);
        const refreshedCards = getSavedCards ? getSavedCards(user?.email) : [];
        setSavedCards(refreshedCards);
      }
    }

    // Cash on Delivery: Require advance deposit slip
    if (paymentForm.method === 'cod') {
      if (!codPaymentSlip) {
        setSlipError('Please upload your LKR 500 advance deposit bank transfer slip / receipt to place your COD order.');
        showToast('Please upload your advance payment slip before proceeding.', 'error');
        return;
      }
    }

    const detectedBrand = detectCardBrand(paymentForm.cardNumber);
    const last4 = (paymentForm.cardNumber || '').replace(/\D/g, '').slice(-4);

    const enrichedPayment = {
      ...paymentForm,
      cardBrand: detectedBrand === 'mastercard' ? 'Mastercard' : 'Visa',
      last4: last4 || '9981',
      paymentSlip: codPaymentSlip
    };

    setIsProcessingPayment(true);
    setPaymentError('');

    setTimeout(() => {
      const order = placeOrder(
        {
          ...shippingForm,
          saveAddress: saveAddressChecked
        }, 
        enrichedPayment, 
        deliveryMethod
      );
      setIsProcessingPayment(false);

      // Close the shipping address / checkout window
      onClose();

      // Open the separate Payment Success Window
      if (setPaymentSuccessOrder) {
        setPaymentSuccessOrder(order);
      }
    }, 850);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 sm:p-8 cursor-default"
      >
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {systemSettings?.maintenanceMode ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-500">System Under Maintenance</span>
              <h3 className="text-2xl font-black">Checkout & Payment Currently Disabled</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Our payment gateway is currently down for scheduled system maintenance. You may continue viewing garments and saving items in your shopping bag.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-md mx-auto space-y-1">
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Scheduled Maintenance Re-opening Date & Time
              </p>
              <p className="text-sm font-mono font-black text-slate-900 dark:text-white">
                {systemSettings.maintenanceNoticeTime || 'September 15, 2026 at 10:00 AM (SLST)'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Return to Browsing Garments
            </button>
          </div>
        ) : (
          <>
            {step < 4 && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className={step >= 1 ? 'text-amber-500' : ''}>1. Shipping Info</span>
              <span className={step >= 2 ? 'text-amber-500' : ''}>2. Delivery Speed</span>
              <span className={step >= 3 ? 'text-amber-500' : ''}>3. Payment Gateway</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-xl font-black flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                Shipping Details
              </h3>
              
              {savedAddresses.length > 0 && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs font-bold self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode('saved');
                      setAddressError('');
                      if (savedAddresses[selectedAddressIndex]) {
                        const sel = savedAddresses[selectedAddressIndex];
                        setShippingForm(prev => ({
                          ...prev,
                          fullName: cleanName(sel.fullName || user?.name || ''),
                          phone: sel.phone || user?.phone || '',
                          address: sel.address,
                          city: sel.city,
                          postalCode: sel.postalCode || ''
                        }));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      addressMode === 'saved'
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Saved Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode('different');
                      setAddressError('');
                      setShippingForm(prev => ({
                        ...prev,
                        address: '',
                        city: '',
                        postalCode: ''
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      addressMode === 'different'
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    + Different Address
                  </button>
                </div>
              )}
            </div>

            {addressError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addressError}</span>
              </div>
            )}

            {/* OPTION A: SAVED ADDRESS SELECTED */}
            {savedAddresses.length > 0 && addressMode === 'saved' ? (
              <div className="space-y-3">
                {savedAddresses.map((addr, idx) => {
                  const isSelected = selectedAddressIndex === idx;
                  const isEditing = editingAddressIndex === idx;
                  return (
                    <div
                      key={addr.id || idx}
                      onClick={() => {
                        if (!isEditing) {
                          handleSelectSavedAddress(idx);
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all relative ${
                        isEditing
                          ? 'border-amber-500 bg-white dark:bg-zinc-900 shadow-xl ring-2 ring-amber-500/30'
                          : isSelected
                            ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30 cursor-pointer'
                            : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-amber-500 bg-amber-500 text-black' : 'border-slate-400'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                            {cleanName(addr.fullName || user?.name || 'Customer')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                              Default Saved Address
                            </span>
                          )}
                          {!isEditing && (
                            <button
                              type="button"
                              onClick={(e) => handleStartEditAddress(e, idx)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/20 hover:scale-105"
                              title="Edit this saved shipping address"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Address</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-3 cursor-default" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                              <Edit3 className="w-3.5 h-3.5" /> Edit Saved Address Details
                            </span>
                            <span className="text-[10px] text-slate-400">Recipient validation active</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                Full Name (Letters only) *
                              </label>
                              <input
                                type="text"
                                value={editAddressForm.fullName}
                                onChange={e => handleEditFieldChange('fullName', e.target.value)}
                                onBlur={() => handleEditFieldBlur('fullName')}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-zinc-800/80 border ${
                                  editTouched.fullName && editErrors.fullName
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : 'border-slate-300 dark:border-zinc-700 focus:ring-amber-500'
                                } text-slate-900 dark:text-white focus:outline-none focus:ring-1`}
                                placeholder="Sasanka Perera"
                              />
                              {editTouched.fullName && editErrors.fullName && (
                                <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{editErrors.fullName}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                value={editAddressForm.email}
                                onChange={e => handleEditFieldChange('email', e.target.value)}
                                onBlur={() => handleEditFieldBlur('email')}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-zinc-800/80 border ${
                                  editTouched.email && editErrors.email
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : 'border-slate-300 dark:border-zinc-700 focus:ring-amber-500'
                                } text-slate-900 dark:text-white focus:outline-none focus:ring-1`}
                                placeholder="customer@avenza.com"
                              />
                              {editTouched.email && editErrors.email && (
                                <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{editErrors.email}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                              Street Address (Must include house/building number) *
                            </label>
                            <input
                              type="text"
                              value={editAddressForm.address}
                              onChange={e => handleEditFieldChange('address', e.target.value)}
                              onBlur={() => handleEditFieldBlur('address')}
                              className={`w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-zinc-800/80 border ${
                                editTouched.address && editErrors.address
                                  ? 'border-rose-500 focus:ring-rose-500'
                                  : 'border-slate-300 dark:border-zinc-700 focus:ring-amber-500'
                              } text-slate-900 dark:text-white focus:outline-none focus:ring-1`}
                              placeholder="No. 45, Temple Road"
                            />
                            {editTouched.address && editErrors.address && (
                              <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{editErrors.address}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                City / Town (Letters only) *
                              </label>
                              <input
                                type="text"
                                value={editAddressForm.city}
                                onChange={e => handleEditFieldChange('city', e.target.value)}
                                onBlur={() => handleEditFieldBlur('city')}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-zinc-800/80 border ${
                                  editTouched.city && editErrors.city
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : 'border-slate-300 dark:border-zinc-700 focus:ring-amber-500'
                                } text-slate-900 dark:text-white focus:outline-none focus:ring-1`}
                                placeholder="Colombo"
                              />
                              {editTouched.city && editErrors.city && (
                                <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{editErrors.city}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                Phone (+Country Code) *
                              </label>
                              <input
                                type="text"
                                value={editAddressForm.phone}
                                onChange={e => handleEditFieldChange('phone', e.target.value)}
                                onBlur={() => handleEditFieldBlur('phone')}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-zinc-800/80 border ${
                                  editTouched.phone && editErrors.phone
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : 'border-slate-300 dark:border-zinc-700 focus:ring-amber-500'
                                } text-slate-900 dark:text-white focus:outline-none focus:ring-1`}
                                placeholder="+94 77 123 4567"
                              />
                              {editTouched.phone && editErrors.phone && (
                                <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{editErrors.phone}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                Postal Code (Optional)
                              </label>
                              <input
                                type="text"
                                value={editAddressForm.postalCode}
                                onChange={e => handleEditFieldChange('postalCode', e.target.value)}
                                onBlur={() => handleEditFieldBlur('postalCode')}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-zinc-800/80 border ${
                                  editTouched.postalCode && editErrors.postalCode
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : 'border-slate-300 dark:border-zinc-700 focus:ring-amber-500'
                                } text-slate-900 dark:text-white focus:outline-none focus:ring-1`}
                                placeholder="00700"
                              />
                              {editTouched.postalCode && editErrors.postalCode && (
                                <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{editErrors.postalCode}</p>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end items-center gap-2">
                            <button
                              type="button"
                              onClick={handleCancelEditAddress}
                              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleSaveEditedAddress(e, idx)}
                              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pl-7 space-y-1 text-xs">
                          <p className="font-semibold text-slate-800 dark:text-zinc-200">{addr.address}</p>
                          <p className="text-slate-500 dark:text-zinc-400">{addr.city} {addr.postalCode ? `(${addr.postalCode})` : ''}</p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 mt-1">
                            📞 {addr.phone || user?.phone || 'No phone recorded'} • ✉️ {addr.email || user?.email}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-zinc-400">
                    Want this sent to a different place?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode('different');
                      setShippingForm(prev => ({
                        ...prev,
                        address: '',
                        city: '',
                        postalCode: ''
                      }));
                    }}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Enter a Different Delivery Address</span>
                  </button>
                </div>
              </div>
            ) : (
              /* OPTION B: NEW OR DIFFERENT ADDRESS FORM */
              <div className="space-y-4">
                {savedAddresses.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                    <span className="text-amber-700 dark:text-amber-300 font-bold">
                      📍 Specifying a different delivery address for this order
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddressMode('saved')}
                      className="font-black text-amber-600 dark:text-amber-400 underline cursor-pointer"
                    >
                      ← Use Saved Address
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Recipient Full Name *
                      <span className="normal-case font-normal text-slate-400 ml-1 text-[11px]">(Letters only, no numbers)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Silva"
                      value={shippingForm.fullName}
                      onChange={e => handleFieldChange('fullName', e.target.value)}
                      onBlur={() => handleFieldBlur('fullName')}
                      className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm focus:outline-none transition-colors ${
                        shippingErrors.fullName && shippingTouched.fullName
                          ? 'border-red-500 ring-1 ring-red-500/30'
                          : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                      }`}
                    />
                    {shippingErrors.fullName && shippingTouched.fullName && (
                      <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-semibold animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {shippingErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Email Address *
                      <span className="normal-case font-normal text-slate-400 ml-1 text-[11px]">(Valid email format)</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="customer@example.com"
                      value={shippingForm.email}
                      onChange={e => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm focus:outline-none transition-colors ${
                        shippingErrors.email && shippingTouched.email
                          ? 'border-red-500 ring-1 ring-red-500/30'
                          : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                      }`}
                    />
                    {shippingErrors.email && shippingTouched.email && (
                      <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-semibold animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {shippingErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Street Address *
                    <span className="normal-case font-normal text-slate-400 ml-1 text-[11px]">(Must include house / building / street number)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. No. 45/2, Temple Road"
                    value={shippingForm.address}
                    onChange={e => handleFieldChange('address', e.target.value)}
                    onBlur={() => handleFieldBlur('address')}
                    className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm focus:outline-none transition-colors ${
                      shippingErrors.address && shippingTouched.address
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  {shippingErrors.address && shippingTouched.address && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-semibold animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {shippingErrors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      City / Town *
                      <span className="normal-case font-normal text-slate-400 ml-1 text-[11px]">(Letters only, no numbers or symbols)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Colombo, Kandy, Galle"
                      value={shippingForm.city}
                      onChange={e => handleFieldChange('city', e.target.value)}
                      onBlur={() => handleFieldBlur('city')}
                      className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm focus:outline-none transition-colors ${
                        shippingErrors.city && shippingTouched.city
                          ? 'border-red-500 ring-1 ring-red-500/30'
                          : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                      }`}
                    />
                    {shippingErrors.city && shippingTouched.city && (
                      <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-semibold animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {shippingErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Phone Number *
                      <span className="normal-case font-normal text-slate-400 ml-1 text-[11px]">(With country code e.g. +94, no letters)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+94 77 123 4567"
                      value={shippingForm.phone}
                      onChange={e => handleFieldChange('phone', e.target.value)}
                      onBlur={() => handleFieldBlur('phone')}
                      className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm focus:outline-none transition-colors ${
                        shippingErrors.phone && shippingTouched.phone
                          ? 'border-red-500 ring-1 ring-red-500/30'
                          : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                      }`}
                    />
                    {shippingErrors.phone && shippingTouched.phone && (
                      <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-semibold animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {shippingErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Postal Code (Optional)
                    <span className="normal-case font-normal text-slate-400 ml-1 text-[11px]">(Numbers only, no letters)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 00700"
                    value={shippingForm.postalCode}
                    onChange={e => handleFieldChange('postalCode', e.target.value)}
                    onBlur={() => handleFieldBlur('postalCode')}
                    className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border text-sm focus:outline-none transition-colors ${
                      shippingErrors.postalCode && shippingTouched.postalCode
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-slate-200 dark:border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  {shippingErrors.postalCode && shippingTouched.postalCode && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-semibold animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {shippingErrors.postalCode}
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveAddressChecked}
                    onChange={e => setSaveAddressChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Save this address for future orders</span>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">This address will be remembered for fast checkout next time you order.</p>
                  </div>
                </label>
              </div>
            )}

            <button
              type="button"
              onClick={handleProceedToStep2}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              Continue to Delivery Speed
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Shipping */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Islandwide Delivery Options
            </h3>

            <div className="space-y-3">
              <label 
                onClick={() => setDeliveryMethod('standard')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === 'standard' 
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30' 
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                    {deliveryMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">Standard Courier Delivery</p>
                    <p className="text-xs text-slate-400">Delivered within 2-3 business days across Sri Lanka</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-emerald-500">FREE</span>
              </label>

              <label 
                onClick={() => setDeliveryMethod('express')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === 'express' 
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30' 
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                    {deliveryMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">Express Same-Day Delivery (Colombo)</p>
                    <p className="text-xs text-slate-400">Guaranteed 24-hour priority dispatch</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-amber-500 font-mono">+Rs. 500.00</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-800 font-bold text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <form onSubmit={handleCompletePayment} className="space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              Choose Payment Method
            </h3>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentForm({ ...paymentForm, method: 'card' })}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  paymentForm.method === 'card'
                    ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <CreditCard className={`w-5 h-5 ${paymentForm.method === 'card' ? 'text-amber-500' : 'text-slate-400'}`} />
                  {paymentForm.method === 'card' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <div className="font-black text-sm">Credit / Debit Card</div>
                  <div className="text-[11px] opacity-75">Visa & Mastercard (LKR)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentForm({ ...paymentForm, method: 'cod' })}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  paymentForm.method === 'cod'
                    ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Banknote className={`w-5 h-5 ${paymentForm.method === 'cod' ? 'text-amber-500' : 'text-slate-400'}`} />
                  {paymentForm.method === 'cod' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <div className="font-black text-sm">Cash on Delivery</div>
                  <div className="text-[11px] opacity-75">Pay in cash upon doorstep delivery</div>
                </div>
              </button>
            </div>

            {paymentError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* CARD PAYMENT FORM & SAVED CARDS MANAGEMENT */}
            {paymentForm.method === 'card' && (() => {
              const detectedBrand = detectCardBrand(paymentForm.cardNumber);
              const isBrandValid = detectedBrand === 'visa' || detectedBrand === 'mastercard';

              return (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  {/* SAVED CARDS vs DIFFERENT CARD SWITCHER */}
                  {savedCards.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Card Payment Options
                      </span>
                      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs font-bold self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setCardMode('saved');
                            setPaymentError('');
                            if (savedCards[selectedCardIndex]) {
                              const sel = savedCards[selectedCardIndex];
                              setPaymentForm(prev => ({
                                ...prev,
                                cardNumber: sel.cardNumber,
                                cardName: sel.cardName,
                                expiry: sel.expiry,
                                cvv: sel.cvv
                              }));
                              setCardErrors({});
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            cardMode === 'saved'
                              ? 'bg-amber-500 text-black shadow-sm font-black'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Saved Cards ({savedCards.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCardMode('different');
                            setPaymentError('');
                            setPaymentForm(prev => ({
                              ...prev,
                              cardNumber: '',
                              cardName: cleanName(user?.name) || '',
                              expiry: '',
                              cvv: ''
                            }));
                            setCardErrors({});
                            setCardTouched({});
                          }}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            cardMode === 'different'
                              ? 'bg-amber-500 text-black shadow-sm font-black'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          + Add Different Card
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MODE A: SAVED CARDS LIST & INLINE EDITING */}
                  {cardMode === 'saved' && savedCards.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Select a saved card for instant 1-click checkout, or edit your card details:
                      </p>

                      <div className="space-y-2.5">
                        {savedCards.map((card, idx) => {
                          const isSelected = selectedCardIndex === idx;
                          const isEditing = editingCardIndex === idx;
                          const brand = card.cardBrand || detectCardBrand(card.cardNumber);

                          return (
                            <div
                              key={card.id || idx}
                              onClick={() => !isEditing && handleSelectSavedCard(idx)}
                              className={`p-4 rounded-2xl border transition-all ${
                                isSelected
                                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                                  : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                              } ${isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              {/* NON-EDITING STATE: CARD SUMMARY ROW */}
                              {!isEditing ? (
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0">
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                                    </div>

                                    <div className="w-11 h-7 rounded-md bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 flex items-center justify-center shrink-0 shadow-sm">
                                      {brand === 'visa' ? (
                                        <span className="text-[10px] font-black italic text-blue-400">VISA</span>
                                      ) : (
                                        <div className="flex -space-x-1.5">
                                          <div className="w-3 h-3 rounded-full bg-rose-600 opacity-90"></div>
                                          <div className="w-3 h-3 rounded-full bg-amber-500 opacity-90"></div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="font-mono font-bold text-sm tracking-wider text-slate-900 dark:text-white">
                                          •••• •••• •••• {card.last4 || (card.cardNumber || '').slice(-4) || '1111'}
                                        </p>
                                        {card.isDefault && (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase">
                                            Default
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
                                        {card.cardName || 'Cardholder'} • Exp: <span className="font-mono">{card.expiry || 'MM/YY'}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => handleStartEditCard(e, idx)}
                                      className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                                      title="Edit card details"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Edit</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteCard(e, idx)}
                                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                                      title="Delete saved card"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* INLINE EDIT FORM FOR SAVED CARD */
                                <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
                                    <span className="font-black text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                                      <Edit3 className="w-3.5 h-3.5" /> Edit Saved Card Details
                                    </span>
                                    <button
                                      type="button"
                                      onClick={handleCancelEditCard}
                                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 font-bold cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                                        Card Number (16 Digits) *
                                      </label>
                                      <input
                                        type="text"
                                        maxLength="19"
                                        value={editCardForm.cardNumber}
                                        onChange={e => handleEditCardFieldChange('cardNumber', e.target.value)}
                                        onBlur={() => handleEditCardFieldBlur('cardNumber')}
                                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-zinc-800 border text-xs font-mono tracking-wider focus:outline-none ${
                                          editCardTouched.cardNumber && editCardErrors.cardNumber
                                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                                            : 'border-slate-200 dark:border-zinc-700 focus:border-amber-500'
                                        }`}
                                      />
                                      {editCardTouched.cardNumber && editCardErrors.cardNumber && (
                                        <p className="text-[10px] text-rose-500 font-semibold mt-1">
                                          {editCardErrors.cardNumber}
                                        </p>
                                      )}
                                    </div>

                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                                        Cardholder Name *
                                      </label>
                                      <input
                                        type="text"
                                        value={editCardForm.cardName}
                                        onChange={e => handleEditCardFieldChange('cardName', e.target.value)}
                                        onBlur={() => handleEditCardFieldBlur('cardName')}
                                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-zinc-800 border text-xs focus:outline-none ${
                                          editCardTouched.cardName && editCardErrors.cardName
                                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                                            : 'border-slate-200 dark:border-zinc-700 focus:border-amber-500'
                                        }`}
                                      />
                                      {editCardTouched.cardName && editCardErrors.cardName && (
                                        <p className="text-[10px] text-rose-500 font-semibold mt-1">
                                          {editCardErrors.cardName}
                                        </p>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                                          Expiry (MM/YY) *
                                        </label>
                                        <input
                                          type="text"
                                          maxLength="5"
                                          placeholder="MM/YY"
                                          value={editCardForm.expiry}
                                          onChange={e => handleEditCardFieldChange('expiry', e.target.value)}
                                          onBlur={() => handleEditCardFieldBlur('expiry')}
                                          className={`w-full p-2.5 rounded-xl bg-white dark:bg-zinc-800 border text-xs font-mono focus:outline-none ${
                                            editCardTouched.expiry && editCardErrors.expiry
                                              ? 'border-rose-500 ring-1 ring-rose-500/30'
                                              : 'border-slate-200 dark:border-zinc-700 focus:border-amber-500'
                                          }`}
                                        />
                                        {editCardTouched.expiry && editCardErrors.expiry && (
                                          <p className="text-[10px] text-rose-500 font-semibold mt-1">
                                            {editCardErrors.expiry}
                                          </p>
                                        )}
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                                          CVV *
                                        </label>
                                        <input
                                          type="password"
                                          maxLength="3"
                                          placeholder="•••"
                                          value={editCardForm.cvv}
                                          onChange={e => handleEditCardFieldChange('cvv', e.target.value)}
                                          onBlur={() => handleEditCardFieldBlur('cvv')}
                                          className={`w-full p-2.5 rounded-xl bg-white dark:bg-zinc-800 border text-xs font-mono tracking-widest focus:outline-none ${
                                            editCardTouched.cvv && editCardErrors.cvv
                                              ? 'border-rose-500 ring-1 ring-rose-500/30'
                                              : 'border-slate-200 dark:border-zinc-700 focus:border-amber-500'
                                          }`}
                                        />
                                        {editCardTouched.cvv && editCardErrors.cvv && (
                                          <p className="text-[10px] text-rose-500 font-semibold mt-1">
                                            {editCardErrors.cvv}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-end gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={(e) => handleSaveEditedCard(e, idx)}
                                        className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs cursor-pointer shadow-sm transition-all"
                                      >
                                        Save Changes
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCancelEditCard}
                                        className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-zinc-700 font-bold text-xs cursor-pointer hover:bg-slate-300 dark:hover:bg-zinc-600 transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* QUICK BUTTON TO ADD DIFFERENT CARD */}
                      <button
                        type="button"
                        onClick={() => {
                          setCardMode('different');
                          setPaymentForm(prev => ({
                            ...prev,
                            cardNumber: '',
                            cardName: cleanName(user?.name) || '',
                            expiry: '',
                            cvv: ''
                          }));
                          setCardErrors({});
                          setCardTouched({});
                        }}
                        className="w-full py-3 rounded-xl border border-dashed border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        + Add Another / Different Card
                      </button>
                    </div>
                  ) : (
                    /* MODE B: ENTER DIFFERENT / NEW CARD DETAILS */
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* LUXURY INTERACTIVE CARD PREVIEW */}
                      <div className="p-6 rounded-3xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-amber-950 text-white shadow-2xl space-y-5 relative border border-amber-500/30 overflow-hidden">
                        {/* Subtle watermarked background logo */}
                        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                          <CreditCard className="w-48 h-48 text-amber-400" />
                        </div>

                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                              AVENZA SECURE 256-BIT SSL
                            </span>
                          </div>

                          {/* Card Brand Badge in Card Preview */}
                          {detectedBrand === 'visa' && (
                            <div className="px-3 py-0.5 rounded-md bg-blue-600 text-white font-black italic tracking-widest text-xs shadow-md">
                              VISA
                            </div>
                          )}
                          {detectedBrand === 'mastercard' && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 shadow-md">
                              <div className="flex -space-x-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-rose-600 opacity-90"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 opacity-90"></div>
                              </div>
                              <span className="font-black text-[10px] text-white tracking-tight lowercase">mastercard</span>
                            </div>
                          )}
                          {detectedBrand && !isBrandValid && (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                              Unsupported Brand
                            </span>
                          )}
                          {!detectedBrand && (
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                              Visa / Mastercard
                            </span>
                          )}
                        </div>

                        {/* Gold EMV Chip Graphic */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-sm flex items-center justify-center">
                            <div className="w-8 h-5 border border-amber-700/40 rounded-sm grid grid-cols-2 gap-0.5 opacity-60"></div>
                          </div>
                          <div className="text-[10px] font-mono flex items-center gap-1.5">
                            {paymentForm.cardNumber && (
                              validateCardField('cardNumber', paymentForm.cardNumber) === '' ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1">
                                  ⏳ Bank Verification
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <p className="font-mono text-lg sm:text-xl tracking-[0.2em] text-slate-100 font-bold">
                          {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                        </p>

                        <div className="flex justify-between items-end text-xs font-mono pt-1 border-t border-zinc-800">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block tracking-wider">Cardholder Name</span>
                            <span className="font-bold text-slate-200 uppercase">{paymentForm.cardName || 'NAME ON CARD'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 uppercase block tracking-wider">Expires</span>
                            <span className="font-bold text-slate-200">{paymentForm.expiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* QUICK DEMO TESTING SHORTCUTS */}
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          Testing verified numbers:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleFillDemoCard('visa')}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-500/20 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Test Visa (4111...)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFillDemoCard('mastercard')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Test Mastercard (5555...)
                          </button>
                        </div>
                      </div>

                      {/* INPUT FIELDS */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Card Number */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase">
                              Card Number (16 Digits) *
                            </label>
                            {detectedBrand === 'visa' && (
                              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                🟦 VISA
                              </span>
                            )}
                            {detectedBrand === 'mastercard' && (
                              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                🟧 MASTERCARD
                              </span>
                            )}
                            {detectedBrand && !isBrandValid && (
                              <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                ❌ NOT ACCEPTED
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            maxLength="19"
                            placeholder="4111 1111 1111 1111"
                            value={paymentForm.cardNumber}
                            onChange={e => handleCardFieldChange('cardNumber', e.target.value)}
                            onBlur={() => handleCardFieldBlur('cardNumber')}
                            className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border ${
                              cardTouched.cardNumber && cardErrors.cardNumber
                                ? 'border-rose-500 focus:ring-rose-500'
                                : 'border-slate-200 dark:border-zinc-800 focus:ring-amber-500'
                            } text-sm font-mono tracking-wider focus:outline-none focus:ring-1`}
                          />
                          {cardTouched.cardNumber && cardErrors.cardNumber && (
                            <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{cardErrors.cardNumber}</span>
                            </p>
                          )}
                        </div>

                        {/* Cardholder Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase mb-1">
                            Cardholder Name (Letters only) *
                          </label>
                          <input
                            type="text"
                            placeholder="Sasanka Perera"
                            value={paymentForm.cardName}
                            onChange={e => handleCardFieldChange('cardName', e.target.value)}
                            onBlur={() => handleCardFieldBlur('cardName')}
                            className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border ${
                              cardTouched.cardName && cardErrors.cardName
                                ? 'border-rose-500 focus:ring-rose-500'
                                : 'border-slate-200 dark:border-zinc-800 focus:ring-amber-500'
                            } text-sm focus:outline-none focus:ring-1`}
                          />
                          {cardTouched.cardName && cardErrors.cardName && (
                            <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{cardErrors.cardName}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Expiry Date */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase mb-1">
                            Expiry Date (MM/YY) *
                          </label>
                          <input
                            type="text"
                            maxLength="5"
                            placeholder="08/28"
                            value={paymentForm.expiry}
                            onChange={e => handleCardFieldChange('expiry', e.target.value)}
                            onBlur={() => handleCardFieldBlur('expiry')}
                            className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border ${
                              cardTouched.expiry && cardErrors.expiry
                                ? 'border-rose-500 focus:ring-rose-500'
                                : 'border-slate-200 dark:border-zinc-800 focus:ring-amber-500'
                            } text-sm font-mono focus:outline-none focus:ring-1`}
                          />
                          {cardTouched.expiry && cardErrors.expiry && (
                            <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{cardErrors.expiry}</span>
                            </p>
                          )}
                        </div>

                        {/* CVV */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase mb-1">
                            CVV (3 Digits) *
                          </label>
                          <input
                            type="password"
                            maxLength="3"
                            placeholder="882"
                            value={paymentForm.cvv}
                            onChange={e => handleCardFieldChange('cvv', e.target.value)}
                            onBlur={() => handleCardFieldBlur('cvv')}
                            className={`w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border ${
                              cardTouched.cvv && cardErrors.cvv
                                ? 'border-rose-500 focus:ring-rose-500'
                                : 'border-slate-200 dark:border-zinc-800 focus:ring-amber-500'
                            } text-sm font-mono tracking-widest focus:outline-none focus:ring-1`}
                          />
                          {cardTouched.cvv && cardErrors.cvv && (
                            <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{cardErrors.cvv}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* SAVE CARD FOR FUTURE ORDERS CHECKBOX */}
                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={saveCardChecked}
                          onChange={e => setSaveCardChecked(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">Save this card securely for future purchases</span>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400">Card will be remembered for 1-click checkout next time you order.</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* CASH ON DELIVERY INFORMATION & ADVANCE SLIP UPLOAD */}
            {paymentForm.method === 'cod' && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-900 dark:text-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm">Cash on Delivery (COD)</h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Doorstep delivery with advance deposit verification</p>
                    </div>
                  </div>
                  
                  <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/90 border border-amber-500/30 text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-600 dark:text-zinc-300">
                      <span>Total Order Value:</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{formatLKR(cartTotal)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
                      <span className="font-bold text-amber-700 dark:text-amber-400">Advance Commitment Required:</span>
                      <span className="font-black font-mono text-amber-700 dark:text-amber-300 text-sm">LKR 500.00</span>
                    </div>

                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-500 dark:text-zinc-400">Remaining Balance Due at Delivery:</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatLKR(Math.max(0, cartTotal - 500))}
                      </span>
                    </div>
                  </div>

                  {/* Bank Deposit Account Details */}
                  <div className="p-3.5 rounded-xl bg-slate-900 dark:bg-black border border-amber-500/20 text-white text-[11px] space-y-2 font-mono">
                    <div className="flex justify-between items-center text-amber-400 font-bold border-b border-zinc-800 pb-1.5 font-sans">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" /> Official Bank Transfer Details (Deposit LKR 500)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Bank</span>
                        <span className="font-bold">Commercial Bank of Ceylon</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Branch</span>
                        <span className="font-bold">Colombo 07</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Name</span>
                        <span className="font-bold">Avenza Clothing Store (Pvt) Ltd</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Number</span>
                        <span className="font-bold text-amber-400 tracking-wider">1000 2489 7721</span>
                      </div>
                    </div>
                  </div>

                  <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 list-disc list-inside">
                    <li><strong>LKR 500.00</strong> advance commitment is required to verify your address & dispatch parcel.</li>
                    <li>Pay the remaining <strong>{formatLKR(Math.max(0, cartTotal - 500))}</strong> in cash to the rider upon delivery.</li>
                  </ul>
                </div>

                {/* ADVANCE PAYMENT SLIP UPLOAD COMPONENT */}
                <div className={`p-4 rounded-2xl border-2 transition-all ${
                  slipError 
                    ? 'border-rose-500 bg-rose-500/5' 
                    : codPaymentSlip 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/60'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-amber-500" />
                      <span className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        Upload Advance Deposit Slip *
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">JPG, PNG or PDF (Max 5MB)</span>
                  </div>

                  {codPaymentSlip ? (
                    /* UPLOADED SLIP PREVIEW CARD */
                    <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/30 shadow-sm flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {codPaymentSlip.fileType?.startsWith('image/') || codPaymentSlip.isDemo ? (
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700 shrink-0 bg-slate-100 dark:bg-zinc-800">
                            <img 
                              src={codPaymentSlip.fileData} 
                              alt="Payment Slip Preview" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div className="overflow-hidden text-xs">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {codPaymentSlip.fileName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                            Size: {codPaymentSlip.fileSize} • Uploaded: {codPaymentSlip.uploadedAt}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Slip Verified & Attached
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveSlip}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0 border border-rose-500/20"
                        title="Remove uploaded slip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ) : (
                    /* UPLOAD DROPZONE */
                    <div className="space-y-3">
                      <label className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-amber-500/70 dark:hover:border-amber-500/70 transition-all cursor-pointer group">
                        <input 
                          type="file" 
                          accept="image/png,image/jpeg,image/webp,application/pdf"
                          onChange={handleSlipUpload}
                          className="hidden" 
                        />
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-500 flex items-center justify-center mb-2 transition-all">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                          Click to browse or drop your bank deposit receipt here
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Bank transfer screenshot, ATM deposit slip, or online banking receipt
                        </p>
                      </label>

                      {/* Quick demo attach button for testing */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-slate-400">Need a sample slip for testing?</span>
                        <button
                          type="button"
                          onClick={handleAttachDemoSlip}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Paperclip className="w-3 h-3" />
                          + Attach Sample Deposit Slip
                        </button>
                      </div>
                    </div>
                  )}

                  {slipError && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{slipError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-800 font-bold text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment Securely...</span>
                  </div>
                ) : paymentForm.method === 'card' ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay {formatLKR(cartTotal)} Securely
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Place COD Order (Advance: LKR 500)
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        </>
        )}

      </div>
    </div>
  );
};
