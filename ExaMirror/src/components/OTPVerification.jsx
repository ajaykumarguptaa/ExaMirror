import React, { useState, useEffect, useRef } from 'react';
import { generateOTP, sendOTPEmail, validateOTP, getOTPRemainingTime, formatTime } from '../utils/otpUtils';
import Button from './Button';

const OTPVerification = ({ email, onVerificationSuccess, onVerificationFailed, onResendOTP }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Start timer when component mounts
    const timer = setInterval(() => {
      const remaining = getOTPRemainingTime();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setCanResend(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOTP = pastedData.split('');
      setOtp([...newOTP, ...Array(6 - newOTP.length).fill('')]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = validateOTP(otpString, email);
      
      if (result.isValid) {
        onVerificationSuccess();
      } else {
        setError(result.message);
        onVerificationFailed?.(result.message);
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      onVerificationFailed?.('Verification failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    
    try {
      const newOTP = generateOTP();
      const result = await sendOTPEmail(email, newOTP);
      
      if (result.success) {
        setOtp(['', '', '', '', '', '']);
        setTimeLeft(300); // 5 minutes
        setCanResend(false);
        onResendOTP?.(newOTP);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    }
    
    setIsResending(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Verify Your Email</h3>
        <p className="text-sm text-gray-600 mt-2">
          We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter Verification Code
          </label>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </div>
      </form>

      <div className="text-center space-y-4">
        {timeLeft > 0 ? (
          <div className="text-sm text-gray-600">
            <p>Code expires in <span className="font-medium text-red-600">{formatTime(timeLeft)}</span></p>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            <p className="text-red-600">Code has expired</p>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            ) : (
              <span className="text-gray-400">
                Resend available in {formatTime(timeLeft)}
              </span>
            )}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Demo Note:</strong> Check the browser console to see the OTP that was "sent" to your email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 