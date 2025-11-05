@echo off
REM FlowChat Installation Script for Windows
REM This script installs all dependencies for both frontend and backend

echo.
echo ============================================
echo   Installing FlowChat Dependencies
echo ============================================
echo.

REM Install Backend Dependencies
echo [INFO] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed
cd ..
echo.

REM Install Frontend Dependencies
echo [INFO] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed
cd ..
echo.

echo ============================================
echo   All dependencies installed successfully!
echo ============================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Configure .env files:
echo    - backend/.env
echo    - frontend/.env.local
echo 3. Run 'scripts\start-dev.bat' to start development servers
echo.
pause

