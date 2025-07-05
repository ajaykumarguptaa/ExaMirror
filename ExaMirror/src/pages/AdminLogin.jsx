import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import OTPVerification from '../components/OTPVerification';
import { generateOTP, sendOTPEmail } from '../utils/otpUtils';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const navigate = useNavigate();

  // Default admin credentials (in real app, this would be in a secure backend)
  const ADMIN_CREDENTIALS = {
    email: 'admin@examirror.com',
    password: 'admin123'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check credentials
    if (formData.email === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password) {
      // Send OTP for admin verification
      setIsSendingOTP(true);
      
      try {
        const otp = generateOTP();
        const result = await sendOTPEmail(formData.email, otp);
        
        if (result.success) {
          setShowOTPVerification(true);
        } else {
          setError('Failed to send verification code. Please try again.');
        }
      } catch (err) {
        setError('Failed to send verification code. Please try again.');
      }
      
      setIsSendingOTP(false);
    } else {
      setError('Invalid email or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleOTPVerificationSuccess = () => {
    // Store admin session (in real app, this would be a JWT token)
    localStorage.setItem('adminAuthenticated', 'true');
    localStorage.setItem('adminEmail', formData.email);
    navigate('/admin');
  };

  const handleOTPVerificationFailed = (errorMessage) => {
    setError(errorMessage);
  };

  const handleResendOTP = (newOTP) => {
    console.log(`📧 New OTP ${newOTP} sent to ${formData.email}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {showOTPVerification ? 'Verify Your Email' : 'Examirror Admin'}
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            {showOTPVerification ? 'Complete your admin sign in' : 'Sign in to your admin account'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          {showOTPVerification ? (
            <OTPVerification
              email={formData.email}
              onVerificationSuccess={handleOTPVerificationSuccess}
              onVerificationFailed={handleOTPVerificationFailed}
              onResendOTP={handleResendOTP}
            />
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading || isSendingOTP}
              >
                {isLoading || isSendingOTP ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
          )}
          
          {!showOTPVerification && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Email:</strong> admin@examirror.com
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <a href="/" className="text-blue-100 hover:text-white text-sm">
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 