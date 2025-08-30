@echo off
echo ========================================
echo    Grabtitude Project Startup Script
echo ========================================
echo.

echo Starting Backend (Spring Boot)...
echo.
cd Backend
start "Backend - Spring Boot" cmd /k "mvnw spring-boot:run"
echo Backend started in new window
echo.

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Starting Frontend (React)...
echo.
cd ..\Frontend
start "Frontend - React" cmd /k "npm run dev"
echo Frontend started in new window
echo.

echo ========================================
echo    Project Started Successfully!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Test Backend: http://localhost:8080/auth/test
echo.
echo Press any key to exit this script...
pause > nul
