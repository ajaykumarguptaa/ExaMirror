import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - ExamBook',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 ExamBook</h1>
            <p>Welcome to your learning journey!</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Thank you for registering with ExamBook. To complete your registration and start learning, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${data.verificationUrl}</p>
            
            <p>This link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't create an account with ExamBook, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ExamBook. All rights reserved.</p>
            <p>This email was sent to you because you registered for an ExamBook account.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset - ExamBook',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 ExamBook</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>We received a request to reset your password for your ExamBook account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${data.resetUrl}</p>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons. If you don't reset your password within this time, you'll need to request a new reset link.
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ExamBook. All rights reserved.</p>
            <p>This email was sent to you because you requested a password reset for your ExamBook account.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to ExamBook!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ExamBook</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 ExamBook</h1>
            <p>Welcome to your learning journey!</p>
          </div>
          <div class="content">
            <h2>Welcome ${data.name}!</h2>
            <p>Congratulations! Your email has been verified and your ExamBook account is now active. You're ready to start your learning journey!</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <h3>What you can do with ExamBook:</h3>
            <div class="feature">
              <strong>📚 Browse Courses:</strong> Explore a wide variety of courses across different subjects and difficulty levels.
            </div>
            <div class="feature">
              <strong>🎯 Take Tests:</strong> Challenge yourself with interactive quizzes and assessments to test your knowledge.
            </div>
            <div class="feature">
              <strong>📖 Study Materials:</strong> Access comprehensive study materials and resources to enhance your learning.
            </div>
            <div class="feature">
              <strong>📊 Track Progress:</strong> Monitor your learning progress and achievements with detailed analytics.
            </div>
            
            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ExamBook. All rights reserved.</p>
            <p>Thank you for choosing ExamBook for your educational journey!</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  courseEnrollment: (data) => ({
    subject: `Enrolled in ${data.courseTitle} - ExamBook`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Enrollment</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .course-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 ExamBook</h1>
            <p>Course Enrollment Confirmation</p>
          </div>
          <div class="content">
            <h2>Hello ${data.studentName}!</h2>
            <p>You have successfully enrolled in a new course. Here are the details:</p>
            
            <div class="course-info">
              <h3>${data.courseTitle}</h3>
              <p><strong>Instructor:</strong> ${data.instructorName}</p>
              <p><strong>Duration:</strong> ${data.duration}</p>
              <p><strong>Level:</strong> ${data.level}</p>
              <p>${data.description}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.courseUrl}" class="button">Start Learning</a>
            </div>
            
            <p>You can now access all course materials, lessons, and assessments. Good luck with your studies!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ExamBook. All rights reserved.</p>
            <p>Happy learning!</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  testReminder: (data) => ({
    subject: `Test Reminder: ${data.testTitle} - ExamBook`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .test-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .urgent { background: #ffe6e6; border: 1px solid #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 ExamBook</h1>
            <p>Test Reminder</p>
          </div>
          <div class="content">
            <h2>Hello ${data.studentName}!</h2>
            <p>This is a reminder that you have a test scheduled:</p>
            
            <div class="test-info">
              <h3>${data.testTitle}</h3>
              <p><strong>Course:</strong> ${data.courseTitle}</p>
              <p><strong>Duration:</strong> ${data.duration} minutes</p>
              <p><strong>Questions:</strong> ${data.questionCount}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
            </div>
            
            ${data.isUrgent ? `
            <div class="urgent">
              <strong>⚠️ Urgent:</strong> This test is due soon! Please complete it as soon as possible.
            </div>
            ` : ''}
            
            <div style="text-align: center;">
              <a href="${data.testUrl}" class="button">Take Test Now</a>
            </div>
            
            <p>Make sure you have a stable internet connection and enough time to complete the test. Good luck!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ExamBook. All rights reserved.</p>
            <p>Best of luck with your test!</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
export const sendEmail = async ({ email, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = {
        subject: subject || 'Message from ExamBook',
        html: html || text || 'No content provided'
      };
    }

    const mailOptions = {
      from: `"ExamBook" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: text || emailContent.html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send bulk emails
export const sendBulkEmail = async (emails, template, data) => {
  const results = [];
  
  for (const email of emails) {
    const result = await sendEmail({ email, template, data });
    results.push({ email, ...result });
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 