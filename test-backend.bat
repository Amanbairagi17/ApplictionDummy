@echo off
echo ========================================
echo    Testing Backend Connectivity
echo ========================================
echo.

echo Testing backend health...
curl -s http://localhost:8080/auth/health
echo.

echo Testing backend connectivity...
curl -s http://localhost:8080/auth/test
echo.

echo.
echo ========================================
echo    Backend Test Complete
echo ========================================
echo.
echo If you see responses above, backend is working.
echo If you see connection errors, backend is not running.
echo.
pause
