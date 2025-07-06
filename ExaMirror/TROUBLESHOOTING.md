# ExamBook Troubleshooting Guide

## 🚨 Login and Signup Not Working

### Quick Fix Steps:

#### 1. **Set up Environment Files**

**Backend (.env file):**
```bash
# Navigate to backend directory
cd ExaMirror\backend

# Copy environment example
copy env.example .env
```

**Frontend (.env file):**
```bash
# Navigate to main directory
cd ExaMirror

# Copy environment example
copy env.example .env
```

#### 2. **Start Backend Server**

**Option A: Using PowerShell (one command at a time)**
```powershell
cd ExaMirror\backend
npm run dev
```

**Option B: Using the batch file**
```powershell
# Run this from the ExaMirror directory
.\start-servers.bat
```

#### 3. **Start Frontend Server**

**In a new PowerShell window:**
```powershell
cd ExaMirror
npm run dev
```

### Common Issues and Solutions:

#### ❌ Error: "Missing script: dev"
**Solution:** Make sure you're in the correct directory:
- Backend: `ExaMirror\backend\`
- Frontend: `ExaMirror\`

#### ❌ Error: "&& is not a valid statement separator"
**Solution:** PowerShell doesn't use `&&`. Use separate commands:
```powershell
# Instead of: cd ExaMirror && npm run dev
# Use:
cd ExaMirror
npm run dev
```

#### ❌ Error: "Cannot connect to backend"
**Solution:** 
1. Make sure backend is running on port 5000
2. Check if MongoDB is running (if using local MongoDB)
3. Verify `.env` files are created

#### ❌ Error: "MongoDB connection failed"
**Solution:**
1. Install MongoDB locally, OR
2. Use MongoDB Atlas (cloud):
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster
   - Get connection string
   - Update `MONGODB_URI` in backend `.env`

### Step-by-Step Setup:

#### 1. **Install Dependencies**
```powershell
# Backend dependencies
cd ExaMirror\backend
npm install

# Frontend dependencies
cd ..
npm install
```

#### 2. **Configure Environment**

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/exambook
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ExamBook
VITE_APP_VERSION=1.0.0
```

#### 3. **Start MongoDB (if using local)**
```powershell
# Install MongoDB if not installed
# Then start MongoDB service
mongod
```

#### 4. **Start Servers**

**Backend:**
```powershell
cd ExaMirror\backend
npm run dev
```

**Frontend (in new window):**
```powershell
cd ExaMirror
npm run dev
```

#### 5. **Test the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

### Demo Credentials:
- **Admin:** admin@exambook.com / admin123
- **Student:** student@exambook.com / student123
- **Instructor:** instructor@exambook.com / instructor123

### Alternative: Use Docker

If you have Docker installed:
```powershell
docker-compose up -d
```

### Still Having Issues?

1. **Check if ports are in use:**
```powershell
netstat -an | findstr :3000
netstat -an | findstr :5000
```

2. **Check Node.js version:**
```powershell
node --version
# Should be 16 or higher
```

3. **Clear npm cache:**
```powershell
npm cache clean --force
```

4. **Delete node_modules and reinstall:**
```powershell
rmdir /s node_modules
npm install
```

### Contact Support

If you're still experiencing issues:
1. Check the console logs in your browser (F12)
2. Check the terminal logs for error messages
3. Make sure all environment variables are set correctly
4. Verify MongoDB connection 

## Common Issues and Solutions

### 1. PowerShell Syntax Errors

**Problem**: `&&` is not a valid statement separator in PowerShell
```
PS C:\Users\thein\OneDrive\Desktop\exambook> cd ExaMirror && npm run dev
At line:1 char:14
+ cd ExaMirror && npm run dev
+              ~~
The token '&&' is not a valid statement separator in this version.
```

**Solution**: Use the provided startup scripts instead of manual commands.

**Option A - Batch File (Recommended)**:
```bash
# Double-click or run:
start-servers-fixed.bat
```

**Option B - PowerShell Script**:
```powershell
# Right-click and "Run with PowerShell":
.\start-servers.ps1
```

**Option C - Manual Commands**:
```powershell
# In PowerShell, use semicolons instead of &&
cd ExaMirror
npm run dev

# Or use separate commands:
cd ExaMirror
npm run dev
```

### 2. Missing "dev" Script Error

**Problem**: `npm error Missing script: "dev"`
```
npm error Missing script: "dev"
npm error
npm error To see a list of scripts, run:
npm error   npm run
```

**Solution**: You're in the wrong directory or missing package.json.

**Check your location**:
```powershell
# Make sure you're in the ExaMirror directory
pwd
# Should show: C:\Users\thein\OneDrive\Desktop\exambook\ExaMirror
```

**Check package.json exists**:
```powershell
ls package.json
# Should show the package.json file
```

**Correct directory structure**:
```
exambook/
└── ExaMirror/
    ├── package.json          # Frontend package.json
    ├── backend/
    │   └── package.json      # Backend package.json
    └── src/
```

### 3. User Management Fetch Failures

**Problem**: User management page shows loading forever or errors.

**Common Causes**:

#### A. Backend Server Not Running
**Check**: Visit `http://localhost:5000/api/health`
**Solution**: Start the backend server first

#### B. Wrong API Endpoints
**Fixed**: Updated AdminUsers.jsx to use `adminAPI` instead of `userAPI`

#### C. CORS Issues
**Check**: Browser console for CORS errors
**Solution**: Ensure backend has proper CORS configuration

#### D. Authentication Issues
**Check**: Verify you're logged in as admin
**Solution**: Login with admin credentials

### 4. API Endpoint Issues

**Problem**: API calls failing with 404 or 500 errors.

**Check Backend Routes**:
```javascript
// Backend should have these routes:
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
```

**Check Frontend API Service**:
```javascript
// Updated API methods in src/services/api.js
export const adminAPI = {
  getAllUsers: (params = {}) => apiService.get(`/admin/users?${new URLSearchParams(params)}`),
  createUser: (userData) => apiService.post('/admin/users', userData),
  updateUser: (id, userData) => apiService.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => apiService.delete(`/admin/users/${id}`),
  // ... other methods
};
```

### 5. Environment File Issues

**Problem**: Missing .env files causing configuration errors.

**Solution**: Use the startup scripts which automatically create .env files:

```bash
# The scripts will create:
backend/.env    # From backend/env.example
.env            # From env.example
```

**Manual Creation**:
```bash
# Copy example files
copy backend\env.example backend\.env
copy env.example .env
```

### 6. Database Connection Issues

**Problem**: MongoDB connection failures.

**Check MongoDB**:
```bash
# Ensure MongoDB is running
mongod --version
```

**Check Connection String**:
```bash
# In backend/.env
MONGODB_URI=mongodb://localhost:27017/exambook
```

### 7. Port Conflicts

**Problem**: Ports 5000 or 5173 already in use.

**Check Port Usage**:
```powershell
# Check what's using port 5000
netstat -ano | findstr :5000

# Check what's using port 5173
netstat -ano | findstr :5173
```

**Kill Process**:
```powershell
# Kill process by PID (replace XXXX with actual PID)
taskkill /PID XXXX /F
```

### 8. Node.js/npm Issues

**Problem**: Node.js or npm not working properly.

**Check Versions**:
```bash
node --version
npm --version
```

**Reinstall Node.js**:
1. Download from https://nodejs.org/
2. Uninstall current version
3. Install new version
4. Restart computer

**Clear npm Cache**:
```bash
npm cache clean --force
```

## Step-by-Step Startup Guide

### 1. Prerequisites
- Node.js 16+ installed
- npm installed
- MongoDB running (if using local database)

### 2. Quick Start
```bash
# Option 1: Use batch file (Windows)
start-servers-fixed.bat

# Option 2: Use PowerShell script
.\start-servers.ps1

# Option 3: Manual startup
cd ExaMirror
npm install
cd backend
npm install
npm run dev
# In new terminal:
cd ExaMirror
npm run dev
```

### 3. Verify Installation
1. Backend: `http://localhost:5000/api/health`
2. Frontend: `http://localhost:5173`
3. Admin: `http://localhost:5173/admin`

### 4. Test Admin Login
- Email: `admin@exambook.com`
- Password: `admin123`

## Debug Mode

Enable debug mode for more detailed error information:

**Frontend (.env)**:
```
VITE_DEBUG=true
NODE_ENV=development
```

**Backend (backend/.env)**:
```
NODE_ENV=development
DEBUG=*
```

## Browser Console Debugging

**Check Network Tab**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load user management page
4. Look for failed requests (red entries)
5. Check response details

**Check Console Tab**:
1. Look for JavaScript errors
2. Check for API call failures
3. Verify authentication status

## Common Error Messages

### "Failed to load users"
- Backend server not running
- Wrong API endpoint
- Authentication token expired

### "Authentication failed"
- Not logged in as admin
- JWT token expired
- Wrong credentials

### "Network Error"
- Backend server down
- CORS configuration issue
- Firewall blocking requests

### "Cannot read property 'users' of undefined"
- API response format incorrect
- Backend returning error instead of data
- Frontend expecting wrong data structure

## Getting Help

If you're still experiencing issues:

1. **Check the logs**: Look at both frontend and backend console output
2. **Verify versions**: Ensure you have the latest code
3. **Test API directly**: Use Postman or curl to test backend endpoints
4. **Check browser console**: Look for JavaScript errors
5. **Verify database**: Ensure MongoDB is running and accessible

## Emergency Reset

If everything is broken, try a complete reset:

```bash
# 1. Stop all servers
# 2. Delete node_modules
rm -rf node_modules
rm -rf backend/node_modules

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall dependencies
npm install
cd backend
npm install
cd ..

# 5. Restart servers
start-servers-fixed.bat
``` 