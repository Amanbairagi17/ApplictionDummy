@echo off
echo ========================================
echo    Grabtitude Project Setup Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Java
echo [1/4] Checking Java installation...
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

REM Check MySQL
echo [2/4] Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed or not in PATH
    echo Please install MySQL 8.0+ from: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
) else (
    echo ✅ MySQL is installed
    mysql --version
)

echo.

REM Check Node.js
echo [3/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
    npm --version
)

echo.

echo [4/4] Prerequisites check complete!
echo.

echo ========================================
echo    Database Setup Instructions
echo ========================================
echo.
echo 1. Start MySQL service (if not running):
echo    net start mysql80
echo.
echo 2. Run database scripts:
echo    mysql -u root -p ^< Backend/database-init.sql
echo    mysql -u root -p ^< Backend/create-test-user.sql
echo.
echo 3. Update database password in:
echo    Backend/src/main/resources/application.properties
echo.

echo ========================================
echo    Project Startup Instructions
echo ========================================
echo.
echo Option 1: Use startup script (Recommended)
echo    start-project.bat
echo.
echo Option 2: Manual startup
echo    Backend: cd Backend ^& mvnw.cmd spring-boot:run
echo    Frontend: cd Frontend ^& npm install ^& npm run dev
echo.

echo ========================================
echo    Test URLs
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo Test User: test@example.com / test123
echo.

echo ========================================
echo    Next Steps
echo ========================================
echo.
echo 1. Complete database setup above
echo 2. Start the project using start-project.bat
echo 3. Open http://localhost:5173 in your browser
echo 4. Click "Test Backend Connection" to verify setup
echo.

echo For detailed instructions, see: SETUP_STEP_BY_STEP.md
echo.

pause
