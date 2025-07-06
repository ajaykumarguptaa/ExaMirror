@echo off
echo ========================================
echo    ExamBook Application Startup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install npm or reinstall Node.js
    echo.
    pause
    exit /b 1
)

echo Node.js and npm are installed successfully.
echo.

REM Check if .env files exist
echo Checking environment files...
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found
    echo Creating backend\.env from env.example...
    if exist "backend\env.example" (
        copy "backend\env.example" "backend\.env"
        echo Backend .env file created. Please edit it with your configuration.
    ) else (
        echo ERROR: backend\env.example not found
        echo.
        pause
        exit /b 1
    )
)

if not exist ".env" (
    echo WARNING: .env file not found in root
    echo Creating .env from env.example...
    if exist "env.example" (
        copy "env.example" ".env"
        echo Root .env file created. Please edit it with your configuration.
    ) else (
        echo ERROR: env.example not found in root
        echo.
        pause
        exit /b 1
    )
)

echo Environment files are ready.
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend node_modules...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        echo.
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed.
)
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
if not exist "node_modules" (
    echo Installing frontend node_modules...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        echo.
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed.
)

echo.
echo Dependencies installed successfully.
echo.

REM Start backend server in a new window
echo Starting backend server...
echo Backend will be available at: http://localhost:5000
start "ExamBook Backend Server" cmd /k "cd /d %cd%\backend && npm run dev"

REM Wait a moment for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend server in a new window
echo Starting frontend server...
echo Frontend will be available at: http://localhost:5173
start "ExamBook Frontend Server" cmd /k "cd /d %cd% && npm run dev"

echo.
echo ========================================
echo    Both servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin:    http://localhost:5173/admin
echo.
echo Default admin credentials:
echo Email:    admin@exambook.com
echo Password: admin123
echo.
echo Press any key to close this window...
pause >nul 