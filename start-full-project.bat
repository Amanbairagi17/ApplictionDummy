@echo off
echo ========================================
echo    Starting Gravtitude Full Project
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 21 or higher
    pause
    exit /b 1
)

REM Check if Maven is available
cd Backend
if exist "mvnw.cmd" (
    echo ✅ Maven wrapper found
) else (
    echo ERROR: Maven wrapper not found in Backend directory
    pause
    exit /b 1
)

echo.
echo 🔧 Installing Frontend Dependencies...
cd ..\Frontend
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install npm packages
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting Backend Server...
cd ..\Backend
start "Gravtitude Backend" cmd /k "echo Starting Backend on http://localhost:8080 && mvnw.cmd spring-boot:run"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo 🚀 Starting Frontend Server...
cd ..\Frontend
start "Gravtitude Frontend" cmd /k "echo Starting Frontend on http://localhost:5173 && npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:8080
echo 🧪 Test:     http://localhost:5173/test-connection
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open browser
start http://localhost:5173

echo.
echo 🎉 Gravtitude is now running!
echo.
echo To stop the servers:
echo - Close the Backend and Frontend command windows
echo - Or press Ctrl+C in each window
echo.
pause
