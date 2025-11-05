@echo off
REM FlowChat Development Startup Script for Windows
REM This script starts both frontend and backend in development mode

echo.
echo ============================================
echo   Starting FlowChat Development Environment
echo ============================================
echo.

REM Check if MongoDB is running
echo [INFO] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not running!
    echo [INFO] Starting MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to start MongoDB
        echo Please start MongoDB manually
        pause
        exit /b 1
    )
)
echo [SUCCESS] MongoDB is running
echo.

REM Start Backend
echo [INFO] Starting Backend Server...
cd backend
start "FlowChat Backend" cmd /k "npm run dev"
echo [SUCCESS] Backend started
cd ..
echo.

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [INFO] Starting Frontend Application...
cd frontend
start "FlowChat Frontend" cmd /k "npm run dev"
echo [SUCCESS] Frontend started
cd ..
echo.

echo ============================================
echo   FlowChat is now running!
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo API Docs: http://localhost:5000/api/health
echo.
echo Press Ctrl+C in the terminal windows to stop services
echo.
pause

