// OTP Generation and Validation Utilities

// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in localStorage with expiration (5 minutes)
export const storeOTP = (email, otp) => {
  const otpData = {
    otp,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
  };
  localStorage.setItem('pendingOTP', JSON.stringify(otpData));
};

// Get stored OTP data
export const getStoredOTP = () => {
  const otpData = localStorage.getItem('pendingOTP');
  if (!otpData) return null;
  
  try {
    return JSON.parse(otpData);
  } catch (error) {
    return null;
  }
};

// Validate OTP
export const validateOTP = (inputOTP, email) => {
  const storedData = getStoredOTP();
  
  if (!storedData) {
    return { isValid: false, message: 'No OTP found. Please request a new one.' };
  }
  
  // Check if OTP has expired
  if (Date.now() > storedData.expiresAt) {
    localStorage.removeItem('pendingOTP');
    return { isValid: false, message: 'OTP has expired. Please request a new one.' };
  }
  
  // Check if email matches
  if (storedData.email !== email) {
    return { isValid: false, message: 'Email mismatch. Please use the same email.' };
  }
  
  // Check if OTP matches
  if (storedData.otp !== inputOTP) {
    return { isValid: false, message: 'Invalid OTP. Please try again.' };
  }
  
  // OTP is valid - clear it from storage
  localStorage.removeItem('pendingOTP');
  return { isValid: true, message: 'OTP verified successfully!' };
};

// Clear stored OTP
export const clearOTP = () => {
  localStorage.removeItem('pendingOTP');
};

// Check if OTP is expired
export const isOTPExpired = () => {
  const storedData = getStoredOTP();
  if (!storedData) return true;
  
  return Date.now() > storedData.expiresAt;
};

// Get remaining time for OTP (in seconds)
export const getOTPRemainingTime = () => {
  const storedData = getStoredOTP();
  if (!storedData) return 0;
  
  const remaining = Math.max(0, Math.floor((storedData.expiresAt - Date.now()) / 1000));
  return remaining;
};

import emailService from './emailService';

// Send OTP email using email service
export const sendOTPEmail = async (email, otp) => {
  try {
    const result = await emailService.sendOTPEmail(email, otp);
    
    if (result.success) {
      // Store the OTP
      storeOTP(email, otp);
      return { success: true, message: 'OTP sent successfully!' };
    } else {
      return { success: false, message: 'Failed to send OTP' };
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

// Format time as MM:SS
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}; 