# Manual Testing Guide for ExamBook

## 🧪 **How to Test the Project**

### **Option 1: Automated Test (Recommended)**
```powershell
# Run the automated test script
.\test-project.bat
```

### **Option 2: Manual Testing Steps**

#### **Step 1: Check Prerequisites**
```powershell
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version
```

#### **Step 2: Set up Environment**
```powershell
# Navigate to project directory
cd ExaMirror

# Create backend environment file
cd backend
copy env.example .env
cd ..

# Create frontend environment file
copy env.example .env
```

#### **Step 3: Install Dependencies**
```powershell
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
npm install
```

#### **Step 4: Test Backend**
```powershell
# Start backend server
cd backend
npm run dev
```

**In a new PowerShell window, test the backend:**
```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

#### **Step 5: Test Frontend**
```powershell
# In a new PowerShell window
cd ExaMirror
npm run dev
```

#### **Step 6: Test in Browser**
1. Open browser and go to: `http://localhost:3000`
2. Test the login page
3. Use demo credentials:
   - **Admin:** admin@exambook.com / admin123
   - **Student:** student@exambook.com / student123
   - **Instructor:** instructor@exambook.com / instructor123

## 🔍 **What to Test**

### **1. Backend API Tests**
- [ ] Health endpoint: `http://localhost:5000/api/health`
- [ ] Authentication endpoints
- [ ] User registration
- [ ] User login
- [ ] Protected routes

### **2. Frontend Tests**
- [ ] Home page loads
- [ ] Login page works
- [ ] Signup page works
- [ ] Navigation works
- [ ] Responsive design

### **3. Authentication Tests**
- [ ] Register new user
- [ ] Login with existing user
- [ ] Logout functionality
- [ ] Protected route access
- [ ] Role-based access

### **4. Database Tests**
- [ ] MongoDB connection
- [ ] User creation
- [ ] Data persistence
- [ ] Query operations

## 🚨 **Common Issues & Solutions**

### **Backend Issues**
- **Port 5000 in use:** Change PORT in backend `.env`
- **MongoDB connection failed:** Check MongoDB installation or use MongoDB Atlas
- **JWT errors:** Check JWT_SECRET in `.env`

### **Frontend Issues**
- **Port 3000 in use:** Change port in `package.json` scripts
- **API connection failed:** Check `VITE_API_URL` in frontend `.env`
- **Build errors:** Check for syntax errors in React components

### **Authentication Issues**
- **Login not working:** Check backend is running and API URL is correct
- **Token not stored:** Check localStorage in browser dev tools
- **Role not working:** Check user role in database

## 📊 **Test Results Checklist**

### **✅ Backend Tests**
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Database connects
- [ ] API endpoints work
- [ ] Authentication works

### **✅ Frontend Tests**
- [ ] App builds successfully
- [ ] Pages load correctly
- [ ] Navigation works
- [ ] Forms submit properly
- [ ] Error handling works

### **✅ Integration Tests**
- [ ] Login flow works end-to-end
- [ ] Registration flow works
- [ ] Protected routes work
- [ ] Data flows correctly
- [ ] Error messages display

## 🎯 **Performance Tests**

### **Load Testing**
- [ ] Multiple users can login simultaneously
- [ ] API responds within 2 seconds
- [ ] Frontend loads within 3 seconds
- [ ] Database queries are optimized

### **Security Tests**
- [ ] Passwords are hashed
- [ ] JWT tokens are secure
- [ ] CORS is configured
- [ ] Input validation works
- [ ] Rate limiting is active

## 📝 **Reporting Issues**

If you find issues during testing:

1. **Note the exact error message**
2. **Check browser console (F12)**
3. **Check terminal logs**
4. **Verify environment variables**
5. **Test with different browsers**
6. **Document the steps to reproduce**

## 🚀 **Ready for Production**

Once all tests pass:

1. **Update environment variables for production**
2. **Set up MongoDB Atlas (cloud database)**
3. **Configure email service**
4. **Set up SSL/HTTPS**
5. **Deploy using Docker or cloud platform**

---

**Need help?** Check the `TROUBLESHOOTING.md` file for common solutions! 