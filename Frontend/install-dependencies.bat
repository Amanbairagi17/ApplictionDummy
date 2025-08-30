@echo off
echo ========================================
echo    Installing Frontend Dependencies
echo ========================================
echo.

cd Frontend

echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 Starting development server...
call npm run dev

pause
