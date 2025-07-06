@echo off
setlocal enabledelayedexpansion

echo 🚀 ExamBook Quick Start Script
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo [INFO] Node.js version: 
node --version
echo [INFO] npm version: 
npm --version

REM Setup backend
echo [STEP] Setting up backend...

cd backend

REM Check if .env exists
if not exist .env (
    echo [WARNING] Creating .env file from example...
    if exist env.example (
        copy env.example .env
        echo [WARNING] Please edit backend\.env with your settings:
        echo   - MONGODB_URI (use MongoDB Atlas for production)
        echo   - JWT_SECRET (change to a strong secret)
        echo   - EMAIL settings (for email verification)
        pause
    ) else (
        echo [ERROR] env.example not found in backend directory
        pause
        exit /b 1
    )
)

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
call npm install

cd ..

REM Setup frontend
echo [STEP] Setting up frontend...

REM Check if .env exists
if not exist .env (
    echo [WARNING] Creating .env file from example...
    if exist env.example (
        copy env.example .env
        echo [INFO] Frontend .env created with default settings
    ) else (
        echo [ERROR] env.example not found in frontend directory
        pause
        exit /b 1
    )
)

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
call npm install

echo [STEP] Setup completed! 🎉

echo.
echo Next steps:
echo ===========
echo 1. Start MongoDB (if using local MongoDB):
echo    mongod
echo.
echo 2. Start the backend server:
echo    cd backend ^&^& npm run dev
echo.
echo 3. In a new terminal, start the frontend:
echo    npm run dev
echo.
echo 4. Open your browser and go to:
echo    http://localhost:3000
echo.
echo 5. Default admin credentials:
echo    Email: admin@exambook.com
echo    Password: admin123
echo.
echo For production deployment, see PRODUCTION.md
echo.

set /p start_services="Would you like to start the services now? (y/n): "
if /i "%start_services%"=="y" (
    echo [STEP] Starting services...
    
    REM Start backend in background
    echo [INFO] Starting backend server...
    cd backend
    start "ExamBook Backend" cmd /k "npm run dev"
    cd ..
    
    REM Wait a moment for backend to start
    timeout /t 5 /nobreak >nul
    
    REM Start frontend
    echo [INFO] Starting frontend server...
    start "ExamBook Frontend" cmd /k "npm run dev"
    
    echo.
    echo [INFO] 🎉 ExamBook is now running!
    echo Frontend: http://localhost:3000
    echo Backend API: http://localhost:5000
    echo.
    echo Services are running in separate windows.
    echo Close those windows to stop the services.
    echo.
    pause
) else (
    echo [INFO] Setup completed. You can start the services manually when ready.
    pause
) 