@echo off
echo ========================================
echo    Grabtitude Emergency Fix Script
echo ========================================
echo.

echo [1/4] Stopping all Java processes...
taskkill /f /im java.exe >nul 2>&1
echo ✅ Java processes stopped

echo.
echo [2/4] Stopping all Node processes...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Node processes stopped

echo.
echo [3/4] Cleaning backend build...
cd Backend
if exist target rmdir /s /q target
if exist .mvn rmdir /s /q .mvn
echo ✅ Backend cleaned

echo.
echo [4/4] Cleaning frontend build...
cd ..\Frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo ✅ Frontend cleaned

echo.
echo ========================================
echo    Emergency Fix Complete!
echo ========================================
echo.
echo ✅ All processes stopped
echo ✅ Build directories cleaned
echo ✅ Ready for fresh startup
echo.
echo 🚀 Next steps:
echo    1. Run start-production.bat
echo    2. Wait for compilation to complete
echo    3. Test the application
echo.
pause
