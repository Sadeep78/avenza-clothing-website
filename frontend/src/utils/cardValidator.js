/**
 * ====================================================================
 * AVENZA CLOTHING STORE - CARD PAYMENT VALIDATION & BRAND DETECTION
 * File: frontend/src/utils/cardValidator.js
 * 
 * 🎯 FEATURES:
 *   1. Luhn Algorithm (MOD 10 Checksum) Verification.
 *   2. Strict Brand Identification (Visa vs. Mastercard).
 *   3. Rejection of unsupported brands (Amex, Discover, etc.).
 *   4. Expiry Date validation (Month 01-12, future date check).
 *   5. CVV security code validation (strictly 3 digits).
 *   6. Auto-formatting helpers for card number and expiry.
 * ====================================================================
 */

/**
 * Standard Luhn (Mod 10) Checksum Algorithm
 * Worldwide credit/debit card number validity verification.
 */
export const validateLuhn = (numStr) => {
  const digits = (numStr || '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Detect Credit / Debit Card Brand
 * @param {string} numStr 
 * @returns {'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' | null}
 */
export const detectCardBrand = (numStr) => {
  const digits = (numStr || '').replace(/\D/g, '');
  if (!digits || digits.length === 0) return null;

  // Visa: starts with 4
  if (/^4/.test(digits)) return 'visa';

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/.test(digits)) {
    return 'mastercard';
  }

  // Unsupported brands
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^(6011|65|64[4-9]|622)/.test(digits)) return 'discover';

  return 'unknown';
};

/**
 * Format a raw string into spaced card number chunks (e.g. 4111 1111 1111 1111)
 */
export const formatCardNumber = (value) => {
  const digits = (value || '').replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digits;
};

/**
 * Format raw expiry input into MM/YY
 */
export const formatExpiry = (value) => {
  const digits = (value || '').replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
};

/**
 * Validate a single card field
 */
export const validateCardField = (field, value, allValues = {}) => {
  const val = (value || '').trim();

  switch (field) {
    case 'cardNumber': {
      if (!val) return 'Card number is required.';
      if (/[a-zA-Z]/.test(val)) return 'Card number cannot contain letters (numbers only).';
      
      const digits = val.replace(/\D/g, '');
      if (digits.length === 0) return 'Card number is required.';

      const brand = detectCardBrand(digits);

      if (brand === 'amex') {
        return 'American Express is not accepted. Only Visa and Mastercard are accepted.';
      }
      if (brand === 'discover') {
        return 'Discover cards are not accepted. Only Visa and Mastercard are accepted.';
      }
      if (brand !== 'visa' && brand !== 'mastercard') {
        return 'Invalid card brand. We strictly accept Visa (starts with 4) or Mastercard (starts with 51-55 or 22-27).';
      }

      if (digits.length < 16) {
        return `${brand === 'visa' ? 'Visa' : 'Mastercard'} card number must be 16 digits (currently ${digits.length} digits).`;
      }
      if (digits.length > 16) {
        return 'Card number cannot exceed 16 digits.';
      }

      // Luhn Mod-10 Checksum verification
      if (!validateLuhn(digits)) {
        return 'Invalid card checksum! This card number does not pass standard bank verification.';
      }

      return '';
    }

    case 'cardName': {
      if (!val) return 'Cardholder name is required.';
      if (/\d/.test(val)) return 'Cardholder name cannot contain numbers (letters only).';
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Cardholder name can only contain letters and spaces.';
      if (val.length < 2) return 'Cardholder name must be at least 2 characters.';
      return '';
    }

    case 'expiry': {
      if (!val) return 'Expiry date is required (MM/YY).';
      const match = val.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
      if (!match) {
        return 'Invalid expiry date format. Please use MM/YY (e.g. 08/28).';
      }
      const month = parseInt(match[1], 10);
      const year = 2000 + parseInt(match[2], 10);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // 1-12

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return 'This card has expired. Please enter a valid future expiry date.';
      }
      if (year > currentYear + 15) {
        return 'Expiry year is too far in the future.';
      }
      return '';
    }

    case 'cvv': {
      if (!val) return 'CVV security code is required.';
      if (/[a-zA-Z]/.test(val)) return 'CVV cannot contain letters (numbers only).';
      if (!/^\d{3}$/.test(val)) {
        return 'CVV must be exactly 3 digits for Visa and Mastercard (e.g. 882).';
      }
      return '';
    }

    default:
      return '';
  }
};

/**
 * Validate all card fields at once
 */
export const validateAllCardDetails = (form) => {
  const fields = ['cardNumber', 'cardName', 'expiry', 'cvv'];
  const errors = {};
  let firstError = '';

  fields.forEach(field => {
    const err = validateCardField(field, form[field], form);
    if (err) {
      errors[field] = err;
      if (!firstError) firstError = err;
    }
  });

  return {
    isValid: !firstError,
    errors,
    firstError
  };
};
