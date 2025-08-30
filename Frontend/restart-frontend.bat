@echo off
echo ========================================
echo    Restarting Gravtitude Frontend
echo ========================================
echo.

echo 🛑 Stopping any existing frontend processes...
taskkill /F /IM node.exe >nul 2>&1

echo ⏳ Waiting for processes to stop...
timeout /t 3 /nobreak >nul

cd Frontend

echo 🚀 Starting Frontend Development Server...
echo Frontend will be available at: http://localhost:5173
echo.

call npm run dev

pause
