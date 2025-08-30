@echo off
echo ========================================
echo    Quick Start Frontend Only
echo ========================================
echo.

cd Frontend

echo 🔧 Installing dependencies...
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Starting Frontend Development Server...
echo Frontend will be available at: http://localhost:5173
echo Test Connection Page: http://localhost:5173/test-connection
echo.

call npm run dev

pause
