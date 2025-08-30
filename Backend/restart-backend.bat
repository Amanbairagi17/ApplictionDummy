@echo off
echo ========================================
echo    Restarting Gravtitude Backend
echo ========================================
echo.

echo 🛑 Stopping any existing backend processes...
taskkill /F /IM java.exe >nul 2>&1

echo ⏳ Waiting for processes to stop...
timeout /t 3 /nobreak >nul

cd Backend

echo 🚀 Starting Backend Server...
echo Backend will be available at: http://localhost:8080
echo.

call mvnw spring-boot:run

pause
