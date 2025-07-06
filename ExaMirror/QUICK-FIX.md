# Quick Fix for "Failed to Fetch" Error

## Immediate Steps to Fix the Issue

### Step 1: Run the Diagnostic Tool
```bash
# Double-click this file to run diagnostics:
diagnose-issues.bat
```

This will:
- Check if you're in the right directory
- Verify Node.js and npm are installed
- Install missing dependencies
- Create missing .env files
- Check if ports are available
- Start both servers
- Test the backend connection

### Step 2: If Diagnostic Shows Errors

#### A. Wrong Directory
**Problem**: You're not in the ExaMirror folder
**Solution**: 
```powershell
cd ExaMirror
```

#### B. Missing Dependencies
**Problem**: node_modules not found
**Solution**: Run these commands:
```powershell
npm install
cd backend
npm install
cd ..
```

#### C. Missing .env Files
**Problem**: Environment files not created
**Solution**: Copy example files:
```powershell
copy backend\env.example backend\.env
copy env.example .env
```

#### D. Port Already in Use
**Problem**: Port 5000 or 5173 is occupied
**Solution**: Kill the process:
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F
```

### Step 3: Manual Server Startup

If the diagnostic tool doesn't work, start servers manually:

#### Terminal 1 - Backend:
```powershell
cd ExaMirror\backend
npm run dev
```

#### Terminal 2 - Frontend:
```powershell
cd ExaMirror
npm run dev
```

### Step 4: Test Backend Connection

Open this file in your browser to test the backend:
```
test-backend.html
```

Or manually test:
```powershell
curl http://localhost:5000/api/health
```

### Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Go to Network tab
5. Check for failed requests (red entries)

## Common "Failed to Fetch" Causes

### 1. Backend Server Not Running
**Symptoms**: 
- "Failed to fetch" in browser console
- Network tab shows failed requests to localhost:5000

**Fix**: Start the backend server first

### 2. CORS Issues
**Symptoms**:
- CORS errors in console
- Requests blocked by browser

**Fix**: Ensure backend has CORS configured properly

### 3. Wrong API URL
**Symptoms**:
- 404 errors
- Wrong endpoint responses

**Fix**: Check API_BASE_URL in src/services/api.js

### 4. Authentication Issues
**Symptoms**:
- 401 Unauthorized errors
- "Authentication failed" messages

**Fix**: Login with admin credentials

### 5. Network/Firewall Issues
**Symptoms**:
- Connection refused errors
- Timeout errors

**Fix**: Check firewall settings, try different port

## Emergency Reset

If nothing works, try a complete reset:

```powershell
# 1. Stop all servers (Ctrl+C in terminal windows)

# 2. Delete node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force backend\node_modules

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall everything
npm install
cd backend
npm install
cd ..

# 5. Start servers
start-servers-fixed.bat
```

## Verification Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Backend health endpoint responds: http://localhost:5000/api/health
- [ ] Frontend loads: http://localhost:5173
- [ ] Admin panel loads: http://localhost:5173/admin
- [ ] No errors in browser console
- [ ] No failed requests in Network tab

## Still Having Issues?

1. **Check the backend terminal** for error messages
2. **Check the frontend terminal** for error messages
3. **Open test-backend.html** to test API endpoints
4. **Check MongoDB** is running (if using local database)
5. **Try a different browser** to rule out browser issues

## Quick Commands Reference

```powershell
# Check if you're in the right place
ls package.json
ls backend

# Check Node.js
node --version
npm --version

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start servers
start-servers-fixed.bat

# Test backend
curl http://localhost:5000/api/health

# Check ports
netstat -ano | findstr :5000
netstat -ano | findstr :5173
``` 