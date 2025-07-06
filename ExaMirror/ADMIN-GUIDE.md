# ExamBook Admin Guide

## Overview

The ExamBook admin section has been completely rebuilt to be fully functional with real backend integration. All pre-fetched demo data has been removed and replaced with live API calls to the MongoDB backend.

## Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Instructor, Student)
- **Protected admin routes** with automatic redirect to login
- **Session management** with automatic token refresh

### 📊 Admin Dashboard
- **Real-time statistics** from the database
- **Recent users, courses, and tests** with live data
- **Interactive charts and metrics** (coming soon)
- **Quick action buttons** for common tasks

### 👥 User Management
- **Complete CRUD operations** for users
- **Advanced filtering** by role, status, and search
- **Bulk operations** (delete, status change)
- **User profile management** with avatar support
- **Role assignment** (Student, Instructor, Admin)

### 📚 Course Management
- **Full course lifecycle** management
- **Instructor assignment** and management
- **Course status control** (Draft, Published, Archived)
- **Enrollment tracking** and analytics
- **Category and level management**

### 🧪 Test Management
- **Test creation and editing**
- **Question bank management**
- **Test scheduling and access control**
- **Results and analytics**
- **Bulk test operations**

## Getting Started

### 1. Start the Application

Run the provided batch file for Windows:
```bash
start-servers.bat
```

Or manually start both servers:
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

### 2. Access Admin Panel

1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials:
   - **Email**: admin@exambook.com
   - **Password**: admin123

### 3. Default Admin Account

If no admin exists, create one using the signup page or directly in the database:

```javascript
// Example admin user
{
  "name": "Admin User",
  "email": "admin@exambook.com",
  "password": "admin123",
  "role": "admin",
  "status": "active"
}
```

## Admin Pages

### Dashboard (`/admin`)
- **Overview tab**: Real-time statistics and recent activity
- **Users tab**: Quick user management with search and filters
- **Courses tab**: Course overview with status management
- **Tests tab**: Test management and analytics
- **Analytics tab**: Advanced analytics and reporting

### User Management (`/admin/users`)
- **User listing** with advanced search and filters
- **Add new users** with role assignment
- **Edit user profiles** and permissions
- **Bulk operations** for multiple users
- **User status management**

### Course Management (`/admin/courses`)
- **Course grid view** with status indicators
- **Course creation** with instructor assignment
- **Course editing** and content management
- **Enrollment tracking** and analytics
- **Bulk course operations**

## API Integration

### Backend Endpoints

The admin section uses these backend endpoints:

#### Dashboard
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data

#### Users
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

#### Courses
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `PUT /api/admin/courses/:id/status` - Update course status

#### Tests
- `GET /api/admin/tests` - Get all tests
- `POST /api/admin/tests` - Create test
- `PUT /api/admin/tests/:id` - Update test
- `DELETE /api/admin/tests/:id` - Delete test

### Frontend API Service

The admin functionality uses the `adminAPI` service in `src/services/api.js`:

```javascript
import { adminAPI } from '../services/api';

// Example usage
const dashboardData = await adminAPI.getDashboard();
const users = await adminAPI.getAllUsers();
const courses = await adminAPI.getAllCourses();
```

## Security Features

### Authentication
- **JWT tokens** stored securely in localStorage
- **Automatic token refresh** on API calls
- **Session timeout** handling
- **Secure logout** with token cleanup

### Authorization
- **Route protection** based on user roles
- **API endpoint protection** with middleware
- **Role-based UI** showing only relevant features
- **Permission checking** for all admin actions

### Data Validation
- **Input sanitization** on all forms
- **Server-side validation** for all API endpoints
- **Error handling** with user-friendly messages
- **CSRF protection** (implemented in backend)

## Error Handling

### Frontend Error Handling
- **Loading states** for all async operations
- **Error messages** displayed to users
- **Retry mechanisms** for failed requests
- **Graceful degradation** when services are unavailable

### Backend Error Handling
- **Comprehensive error responses** with status codes
- **Validation errors** with field-specific messages
- **Database error handling** with fallbacks
- **Logging** for debugging and monitoring

## Performance Optimizations

### Frontend
- **Lazy loading** of admin components
- **Optimistic updates** for better UX
- **Debounced search** to reduce API calls
- **Caching** of frequently accessed data

### Backend
- **Database indexing** for fast queries
- **Pagination** for large datasets
- **Caching** of dashboard statistics
- **Efficient queries** with proper aggregation

## Troubleshooting

### Common Issues

#### 1. Admin Login Not Working
- Check if backend is running on port 5000
- Verify admin user exists in database
- Check browser console for errors
- Ensure JWT token is being set correctly

#### 2. Data Not Loading
- Check network tab for failed API calls
- Verify backend API endpoints are working
- Check database connection
- Ensure proper CORS configuration

#### 3. Permission Errors
- Verify user has admin role
- Check JWT token is valid
- Ensure proper authorization headers
- Check backend middleware configuration

### Debug Mode

Enable debug mode by setting in `.env`:
```
VITE_DEBUG=true
NODE_ENV=development
```

This will show additional console logs and error details.

## Development

### Adding New Admin Features

1. **Create API endpoint** in backend routes
2. **Add API method** to `adminAPI` service
3. **Create React component** for the feature
4. **Add route** to `AdminRoutes.jsx`
5. **Update navigation** in `AdminSidebar.jsx`

### Styling Guidelines

- Use **Tailwind CSS** for all styling
- Follow **responsive design** principles
- Maintain **consistent spacing** and colors
- Use **semantic HTML** structure
- Implement **accessibility** features

### Code Organization

```
src/
├── pages/
│   ├── AdminDashboard.jsx    # Main dashboard
│   ├── AdminUsers.jsx        # User management
│   ├── AdminCourses.jsx      # Course management
│   └── AdminTests.jsx        # Test management
├── components/
│   ├── AdminSidebar.jsx      # Navigation
│   └── ProtectedRoute.jsx    # Route protection
├── services/
│   └── api.js               # API service
└── context/
    └── AuthContext.jsx      # Authentication
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Check backend logs for API issues
4. Verify database connectivity
5. Test API endpoints directly

## Future Enhancements

- **Advanced analytics** with charts and graphs
- **Bulk import/export** functionality
- **Email notifications** for admin actions
- **Audit logging** for all admin operations
- **Advanced search** with filters
- **Real-time updates** with WebSocket
- **Mobile-responsive** admin interface
- **Multi-language** support 