@echo off
echo Starting ExamBook Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install npm or reinstall Node.js
    pause
    exit /b 1
)

echo Node.js and npm are installed.
echo.

REM Check if .env files exist
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found
    echo Creating backend\.env from env.example...
    if exist "backend\env.example" (
        copy "backend\env.example" "backend\.env"
        echo Backend .env file created. Please edit it with your configuration.
    ) else (
        echo ERROR: backend\env.example not found
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
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo Dependencies installed successfully.
echo.

REM Start backend server in a new window
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server in a new window
echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul 