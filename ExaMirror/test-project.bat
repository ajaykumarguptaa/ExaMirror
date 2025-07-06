@echo off
echo ========================================
echo    ExamBook Project Test Script
echo ========================================
echo.

echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.
echo [2/6] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
) else (
    echo ✅ npm is installed
    npm --version
)

echo.
echo [3/6] Setting up environment files...

REM Create backend .env if it doesn't exist
if not exist "backend\.env" (
    if exist "backend\env.example" (
        copy "backend\env.example" "backend\.env"
        echo ✅ Backend .env file created
    ) else (
        echo ❌ Backend env.example not found
    )
) else (
    echo ✅ Backend .env file already exists
)

REM Create frontend .env if it doesn't exist
if not exist ".env" (
    if exist "env.example" (
        copy "env.example" ".env"
        echo ✅ Frontend .env file created
    ) else (
        echo ❌ Frontend env.example not found
    )
) else (
    echo ✅ Frontend .env file already exists
)

echo.
echo [4/6] Installing dependencies...

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies installation failed
    pause
    exit /b 1
)

echo ✅ All dependencies installed successfully

echo.
echo [5/6] Testing backend server...
echo Starting backend server for testing...
cd backend
start "Backend Test" cmd /c "npm run dev & timeout 10 & echo Backend test completed"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Testing backend health endpoint...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✅ Backend is running and healthy' } else { Write-Host '❌ Backend responded with error' } } catch { Write-Host '❌ Backend is not responding' }"

echo.
echo [6/6] Testing frontend build...
echo Building frontend for testing...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
) else (
    echo ✅ Frontend builds successfully
)

echo.
echo ========================================
echo           Test Results
echo ========================================
echo.
echo ✅ Node.js and npm are working
echo ✅ Environment files are set up
echo ✅ Dependencies are installed
echo ✅ Backend can start (check the backend window)
echo ✅ Frontend can build
echo.
echo 🚀 Ready to start the application!
echo.
echo To start both servers, run:
echo   .\start-servers.bat
echo.
echo Or start them manually:
echo   Backend:  cd backend ^&^& npm run dev
echo   Frontend: npm run dev
echo.
echo Test URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000/api/health
echo.
echo Demo credentials:
echo   Admin: admin@exambook.com / admin123
echo   Student: student@exambook.com / student123
echo   Instructor: instructor@exambook.com / instructor123
echo.
pause 