// Mock Email Service for OTP Verification
// In a real application, this would integrate with services like:
// - SendGrid, Mailgun, AWS SES, or similar email services
// - Twilio for SMS OTP
// - Firebase Auth for email verification

class EmailService {
  constructor() {
    this.sentEmails = new Map(); // Store sent emails for demo purposes
  }

  // Send OTP email
  async sendOTPEmail(to, otp, subject = 'Examirror Verification Code') {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would be an actual email API call
      const emailData = {
        to,
        subject,
        otp,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      // Store for demo purposes
      this.sentEmails.set(to, emailData);
      
      // Log to console for demo
      console.log('📧 Email sent:', {
        to,
        subject,
        otp,
        timestamp: emailData.timestamp
      });
      
      return {
        success: true,
        messageId: `email_${Date.now()}`,
        message: 'OTP sent successfully!'
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: 'Failed to send email'
      };
    }
  }

  // Send welcome email
  async sendWelcomeEmail(to, name) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('📧 Welcome email sent:', {
        to,
        name,
        timestamp: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(to, resetToken) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('📧 Password reset email sent:', {
        to,
        resetToken,
        timestamp: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false };
    }
  }

  // Get sent email history (for demo purposes)
  getSentEmails() {
    return Array.from(this.sentEmails.values());
  }

  // Clear sent emails (for demo purposes)
  clearSentEmails() {
    this.sentEmails.clear();
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;

// Example usage in a real application:
/*
import emailService from '../utils/emailService';

// Send OTP
const result = await emailService.sendOTPEmail('user@example.com', '123456');

// Send welcome email
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Send password reset
await emailService.sendPasswordResetEmail('user@example.com', 'reset-token-123');
*/ 