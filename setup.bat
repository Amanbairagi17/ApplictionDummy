@echo off
title Gravtitude - Full Stack Learning Platform Setup
color 0A

echo ========================================
echo    GRAVTITUDE SETUP & LAUNCHER
echo    Full Stack Learning Platform
echo ========================================
echo.

:MENU
echo [1] Quick Start (Frontend + Backend)
echo [2] Frontend Only
echo [3] Backend Only  
echo [4] Install Dependencies
echo [5] Clean & Rebuild
echo [6] Production Build
echo [7] Exit
echo.
set /p choice="Select option (1-7): "

if "%choice%"=="1" goto QUICK_START
if "%choice%"=="2" goto FRONTEND_ONLY
if "%choice%"=="3" goto BACKEND_ONLY
if "%choice%"=="4" goto INSTALL_DEPS
if "%choice%"=="5" goto CLEAN_REBUILD
if "%choice%"=="6" goto PRODUCTION
if "%choice%"=="7" goto EXIT
goto MENU

:QUICK_START
echo.
echo ========================================
echo    STARTING FULL PROJECT
echo ========================================
echo.
echo 🚀 Starting Backend Server...
start "Gravtitude Backend" cmd /k "cd Backend && mvnw spring-boot:run"
timeout /t 5 /nobreak >nul

echo 🎨 Starting Frontend Server...
start "Gravtitude Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo ✅ Both servers are starting!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:8080
echo.
pause
goto MENU

:FRONTEND_ONLY
echo.
echo ========================================
echo    STARTING FRONTEND ONLY
echo ========================================
echo.
cd Frontend
echo 🎨 Starting Frontend Development Server...
call npm run dev
goto MENU

:BACKEND_ONLY
echo.
echo ========================================
echo    STARTING BACKEND ONLY
echo ========================================
echo.
cd Backend
echo 🚀 Starting Backend Server...
call mvnw spring-boot:run
goto MENU

:INSTALL_DEPS
echo.
echo ========================================
echo    INSTALLING DEPENDENCIES
echo ========================================
echo.
echo 📦 Installing Frontend Dependencies...
cd Frontend
call npm install
cd..

echo 📦 Installing Backend Dependencies...
cd Backend
call mvnw dependency:resolve
cd..

echo ✅ All dependencies installed!
pause
goto MENU

:CLEAN_REBUILD
echo.
echo ========================================
echo    CLEAN & REBUILD PROJECT
echo ========================================
echo.
echo 🧹 Cleaning Frontend...
cd Frontend
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
call npm install
cd..

echo 🧹 Cleaning Backend...
cd Backend
call mvnw clean
call mvnw compile
cd..

echo ✅ Project cleaned and rebuilt!
pause
goto MENU

:PRODUCTION
echo.
echo ========================================
echo    PRODUCTION BUILD
echo ========================================
echo.
echo 🏗️ Building Frontend for Production...
cd Frontend
call npm run build
cd..

echo 🏗️ Building Backend for Production...
cd Backend
call mvnw clean package -DskipTests
cd..

echo ✅ Production build complete!
echo 📦 Frontend build: Frontend/dist/
echo 📦 Backend JAR: Backend/target/
pause
goto MENU

:EXIT
echo.
echo 👋 Thanks for using Gravtitude!
echo.
exit
