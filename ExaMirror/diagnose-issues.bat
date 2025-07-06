@echo off
echo ========================================
echo    ExamBook Diagnostic Tool
echo ========================================
echo.

echo Checking current directory...
echo Current location: %cd%
echo.

echo Checking if we're in the right place...
if not exist "backend" (
    echo ERROR: Backend folder not found!
    echo Please run this script from the ExaMirror directory
    echo.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the ExaMirror directory
    echo.
    pause
    exit /b 1
)

echo Directory structure looks correct.
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo Node.js version: %%i
)

echo.

echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    echo Please install npm or reinstall Node.js
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo npm version: %%i
)

echo.

echo Checking if backend dependencies are installed...
if not exist "backend\node_modules" (
    echo WARNING: Backend dependencies not installed
    echo Installing backend dependencies...
    cd backend
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        echo.
        pause
        exit /b 1
    )
    cd ..
) else (
    echo Backend dependencies are installed.
)

echo.

echo Checking if frontend dependencies are installed...
if not exist "node_modules" (
    echo WARNING: Frontend dependencies not installed
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        echo.
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies are installed.
)

echo.

echo Checking environment files...
if not exist "backend\.env" (
    echo WARNING: backend\.env not found
    if exist "backend\env.example" (
        echo Creating backend\.env from env.example...
        copy "backend\env.example" "backend\.env"
        echo Backend .env created.
    ) else (
        echo ERROR: backend\env.example not found
        echo.
        pause
        exit /b 1
    )
) else (
    echo Backend .env file exists.
)

if not exist ".env" (
    echo WARNING: .env not found
    if exist "env.example" (
        echo Creating .env from env.example...
        copy "env.example" ".env"
        echo Root .env created.
    ) else (
        echo ERROR: env.example not found
        echo.
        pause
        exit /b 1
    )
) else (
    echo Root .env file exists.
)

echo.

echo Checking if ports are in use...
echo Checking port 5000 (backend)...
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 5000 is already in use!
    echo This might prevent the backend from starting.
    echo.
    echo Processes using port 5000:
    netstat -ano | findstr :5000
    echo.
    echo You may need to stop these processes.
) else (
    echo Port 5000 is available.
)

echo.

echo Checking port 5173 (frontend)...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 5173 is already in use!
    echo This might prevent the frontend from starting.
    echo.
    echo Processes using port 5173:
    netstat -ano | findstr :5173
    echo.
    echo You may need to stop these processes.
) else (
    echo Port 5173 is available.
)

echo.

echo ========================================
echo    Starting Backend Server
echo ========================================
echo.

echo Starting backend server in a new window...
echo Backend will be available at: http://localhost:5000
start "ExamBook Backend" cmd /k "cd /d %cd%\backend && npm run dev"

echo.
echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo Testing backend connection...
echo.

echo Testing health endpoint...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: Backend is responding!
    echo Health check response:
    curl -s http://localhost:5000/api/health
) else (
    echo ERROR: Backend is not responding!
    echo.
    echo Possible issues:
    echo 1. Backend server failed to start
    echo 2. Port 5000 is blocked
    echo 3. MongoDB connection failed
    echo 4. Environment variables not set correctly
    echo.
    echo Check the backend window for error messages.
)

echo.
echo ========================================
echo    Starting Frontend Server
echo ========================================
echo.

echo Starting frontend server in a new window...
echo Frontend will be available at: http://localhost:5173
start "ExamBook Frontend" cmd /k "cd /d %cd% && npm run dev"

echo.
echo ========================================
echo    Diagnostic Complete
echo ========================================
echo.
echo If you see any errors above, please fix them first.
echo.
echo Once both servers are running:
echo 1. Backend:  http://localhost:5000
echo 2. Frontend: http://localhost:5173
echo 3. Admin:    http://localhost:5173/admin
echo.
echo Default admin credentials:
echo Email:    admin@exambook.com
echo Password: admin123
echo.
echo Press any key to close this window...
pause >nul 