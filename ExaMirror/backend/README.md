# ExamBook Backend API

A production-ready Node.js/Express backend for the ExamBook educational platform with MongoDB database integration.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 👥 **User Management**: Complete user registration, login, profile management
- 📚 **Course Management**: Create, update, delete courses with enrollment tracking
- 🎯 **Test System**: Comprehensive quiz and assessment system with analytics
- 📖 **Study Materials**: File upload and management for course materials
- 📧 **Email Service**: Transactional emails for verification, notifications
- 🛡️ **Security**: Rate limiting, input validation, CORS, Helmet security
- 📊 **Analytics**: Detailed analytics and reporting for instructors and admins
- 🔍 **Search**: Full-text search across courses and tests
- 📱 **API Documentation**: RESTful API with comprehensive endpoints

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate limiting
- **File Upload**: Multer
- **Logging**: Morgan

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd ExaMirror/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
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
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/resend-verification` - Resend verification email

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/stats/overview` - Get user statistics (Admin)

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/rate` - Rate course
- `GET /api/courses/enrolled` - Get user's enrolled courses
- `GET /api/courses/instructor` - Get instructor's courses

### Tests
- `GET /api/tests` - Get all active tests
- `GET /api/tests/:id` - Get test by ID
- `POST /api/tests` - Create test (Instructor/Admin)
- `PUT /api/tests/:id` - Update test (Instructor/Admin)
- `DELETE /api/tests/:id` - Delete test (Instructor/Admin)
- `POST /api/tests/:id/start` - Start test attempt
- `POST /api/tests/:id/submit` - Submit test attempt
- `GET /api/tests/:id/results` - Get test results
- `GET /api/tests/instructor` - Get instructor's tests
- `GET /api/tests/:id/analytics` - Get test analytics (Instructor)

### Materials
- `GET /api/materials/course/:courseId` - Get course materials
- `POST /api/materials/course/:courseId` - Add material (Instructor/Admin)
- `PUT /api/materials/:courseId/:materialId` - Update material (Instructor/Admin)
- `DELETE /api/materials/:courseId/:materialId` - Delete material (Instructor/Admin)

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/system` - Get system information
- `GET /api/admin/courses` - Get all courses (Admin view)
- `GET /api/admin/tests` - Get all tests (Admin view)
- `PUT /api/admin/courses/:id/status` - Update course status
- `PUT /api/admin/tests/:id/status` - Update test status
- `PUT /api/admin/courses/:id/feature` - Feature/unfeature course
- `GET /api/admin/analytics` - Get admin analytics

## Database Models

### User Model
- Basic info (name, email, password)
- Role-based access (student, instructor, admin)
- Profile information
- Preferences and settings
- Statistics tracking
- Email verification

### Course Model
- Course details (title, description, category, level)
- Instructor assignment
- Sections and lessons
- Student enrollments
- Ratings and reviews
- Materials and resources
- Progress tracking

### Test Model
- Test configuration
- Questions with multiple types
- Student attempts
- Scoring and analytics
- Time limits and settings
- Results and statistics

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Role-based Access**: Granular permission system

## Email Templates

- Email verification
- Password reset
- Welcome emails
- Course enrollment confirmation
- Test reminders

## Error Handling

- Centralized error handling middleware
- Consistent error response format
- Detailed error logging
- User-friendly error messages

## Development

### Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRE`: JWT expiration time
- `EMAIL_HOST`: SMTP host
- `EMAIL_PORT`: SMTP port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASS`: SMTP password
- `FRONTEND_URL`: Frontend application URL

## Production Deployment

1. **Set environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI_PROD=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Install dependencies**
   ```bash
   npm install --production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 