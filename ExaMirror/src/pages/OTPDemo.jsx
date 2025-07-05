import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OTPVerification from '../components/OTPVerification';
import { generateOTP, sendOTPEmail } from '../utils/otpUtils';
import emailService from '../utils/emailService';
import Button from '../components/Button';

const OTPDemo = () => {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);

  const handleSendOTP = async () => {
    if (!email) return;
    
    setIsSending(true);
    try {
      const otp = generateOTP();
      const result = await sendOTPEmail(email, otp);
      
      if (result.success) {
        setShowOTP(true);
        // Update sent emails list
        setSentEmails(emailService.getSentEmails());
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
    setIsSending(false);
  };

  const handleVerificationSuccess = () => {
    alert('OTP verified successfully! 🎉');
    setShowOTP(false);
    setEmail('');
  };

  const handleVerificationFailed = (error) => {
    console.log('Verification failed:', error);
  };

  const handleResendOTP = (newOTP) => {
    console.log(`📧 New OTP ${newOTP} sent to ${email}`);
    setSentEmails(emailService.getSentEmails());
  };

  const clearEmailHistory = () => {
    emailService.clearSentEmails();
    setSentEmails([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email OTP Verification Demo
          </h1>
          <p className="text-lg text-gray-600">
            Experience the secure email verification system for Examirror
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Try the OTP System
            </h2>
            
            {!showOTP ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to receive OTP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <Button
                  onClick={handleSendOTP}
                  disabled={!email || isSending}
                  variant="primary"
                  className="w-full"
                >
                  {isSending ? 'Sending OTP...' : 'Send OTP'}
                </Button>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is a demo. Check the browser console to see the OTP that would be sent to your email.
                  </p>
                </div>
              </div>
            ) : (
              <OTPVerification
                email={email}
                onVerificationSuccess={handleVerificationSuccess}
                onVerificationFailed={handleVerificationFailed}
                onResendOTP={handleResendOTP}
              />
            )}
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                OTP System Features
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">6-digit Secure OTP</p>
                    <p className="text-sm text-gray-500">Randomly generated verification codes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">5-minute Expiration</p>
                    <p className="text-sm text-gray-500">OTP expires automatically for security</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Resend Functionality</p>
                    <p className="text-sm text-gray-500">Request new OTP after expiration</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Auto-focus Input</p>
                    <p className="text-sm text-gray-500">Seamless OTP entry experience</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Paste Support</p>
                    <p className="text-sm text-gray-500">Paste 6-digit code directly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Email History (Demo)
                </h2>
                <Button
                  onClick={clearEmailHistory}
                  variant="secondary"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
              
              {sentEmails.length === 0 ? (
                <p className="text-sm text-gray-500">No emails sent yet</p>
              ) : (
                <div className="space-y-3">
                  {sentEmails.map((email, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{email.to}</p>
                          <p className="text-xs text-gray-500">{email.subject}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(email.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-blue-600">OTP: {email.otp}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {email.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Integration Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Current Implementation</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mock email service for demonstration</li>
                <li>• localStorage for OTP storage</li>
                <li>• 5-minute OTP expiration</li>
                <li>• Console logging for demo purposes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Production Ready</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Integrate with SendGrid/Mailgun</li>
                <li>• Redis/database for OTP storage</li>
                <li>• Rate limiting for OTP requests</li>
                <li>• SMS OTP via Twilio</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Examirror
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTPDemo; 