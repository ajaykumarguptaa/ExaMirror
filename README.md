# ExamBook - Production Setup Guide

A comprehensive educational platform for exam preparation with course management, testing, and analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Backend Setup

```bash
cd ExaMirror/backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
# See backend/env.example for all required variables

# Start development server
npm run dev

# For production
npm start
```

### 2. Frontend Setup

```bash
cd ExaMirror

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your API URL
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Environment Configuration

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/exambook
MONGODB_URI_PROD=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/exambook

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=ExamBook
VITE_APP_VERSION=1.0.0
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `exambook`

### Option 2: MongoDB Atlas (Recommended for Production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI_PROD` in backend `.env`

## 📧 Email Setup

### Gmail Configuration
1. Enable 2-factor authentication
2. Generate App Password
3. Update email settings in backend `.env`

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Configure HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Configure email verification
- [ ] Set up password reset functionality

## 🚀 Production Deployment

### Backend Deployment (Node.js)
- **Platform**: Heroku, Railway, DigitalOcean, AWS
- **Environment**: Set `NODE_ENV=production`
- **Database**: Use MongoDB Atlas
- **Environment Variables**: Configure all required vars

### Frontend Deployment (React)
- **Platform**: Vercel, Netlify, AWS S3
- **Build Command**: `npm run build`
- **Environment Variables**: Set `VITE_API_URL` to production backend URL

## 📊 Features

- 🔐 **Authentication**: JWT-based auth with role management
- 👥 **User Management**: Student, Instructor, Admin roles
- 📚 **Course Management**: Create, enroll, track progress
- 🎯 **Test System**: Multiple question types, analytics
- 📖 **Study Materials**: File upload and management
- 📧 **Email Notifications**: Verification, reminders
- 📊 **Analytics**: Detailed reporting and insights
- 🔍 **Search**: Full-text search across content
- 📱 **Responsive Design**: Mobile-friendly interface

## 🛠️ Development

### Backend API Endpoints
- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Courses: `/api/courses/*`
- Tests: `/api/tests/*`
- Materials: `/api/materials/*`
- Admin: `/api/admin/*`

### Frontend Structure
- React 19 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management

## 📝 API Documentation

See `ExaMirror/backend/README.md` for complete API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.
