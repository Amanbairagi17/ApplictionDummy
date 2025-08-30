@echo off
echo ========================================
echo    Grabtitude Production Startup
echo ========================================
echo.

echo [1/5] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed or not in PATH
    echo Please install Java 21 from: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo ✅ Java is installed
    java -version
)

echo.
echo [2/5] Checking MySQL service...
net start mysql80 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MySQL service not started, attempting to start...
    net start mysql80
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MySQL service
        echo Please start MySQL manually or check installation
        pause
        exit /b 1
    )
) else (
    echo ✅ MySQL service is running
)

echo.
echo [3/5] Compiling backend...
cd Backend
call mvnw.cmd clean compile
if %errorlevel% neq 0 (
    echo ❌ Backend compilation failed
    echo Please check the error messages above
    pause
    exit /b 1
) else (
    echo ✅ Backend compiled successfully
)

echo.
echo [4/5] Starting backend...
start "Grabtitude Backend" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo [5/5] Starting frontend...
cd ..\Frontend
start "Grabtitude Frontend" cmd /k "npm install && npm run dev"

echo.
echo ========================================
echo    Production Startup Complete!
echo ========================================
echo.
echo ✅ Backend: Starting on port 8080
echo ✅ Frontend: Starting on port 5173
echo.
echo 📱 Access URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo.
echo 🔑 Test Credentials:
echo    Email: test@example.com
echo    Password: test123
echo.
echo ⏳ Please wait for both services to fully start...
echo    Check the new command windows for startup progress
echo.
pause
