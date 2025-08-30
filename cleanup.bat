@echo off
echo Cleaning up old files...

REM Remove all MD files from root
del /q "COMPLETE_PROJECT_SUMMARY.md" 2>nul
del /q "DASHBOARD_FIX_SUMMARY.md" 2>nul
del /q "ENHANCED_FEATURES.md" 2>nul
del /q "FRONTEND_SETUP_COMPLETE.md" 2>nul
del /q "PRACTICE_ROUTES_FIX.md" 2>nul
del /q "PRODUCTION_SETUP.md" 2>nul
del /q "PROJECT_SETUP.md" 2>nul
del /q "PROJECT_SUMMARY.md" 2>nul
del /q "QUICK_START.md" 2>nul
del /q "README.md" 2>nul
del /q "ROLE_ASSIGNMENT_FIX.md" 2>nul
del /q "SETUP_STEP_BY_STEP.md" 2>nul
del /q "TESTING_GUIDE.md" 2>nul
del /q "TROUBLESHOOTING_GUIDE.md" 2>nul

REM Remove all BAT files from root
del /q "emergency-fix.bat" 2>nul
del /q "quick-setup.bat" 2>nul
del /q "quick-start-frontend.bat" 2>nul
del /q "start-full-project.bat" 2>nul
del /q "start-production.bat" 2>nul
del /q "start-project.bat" 2>nul
del /q "test-backend.bat" 2>nul

REM Remove Frontend MD and BAT files
del /q "Frontend\FIXES_SUMMARY.md" 2>nul
del /q "Frontend\HEATMAP_IMPROVEMENTS.md" 2>nul
del /q "Frontend\README.md" 2>nul
del /q "Frontend\install-dependencies.bat" 2>nul
del /q "Frontend\restart-frontend.bat" 2>nul

REM Remove Backend BAT files
del /q "Backend\restart-backend.bat" 2>nul

echo Cleanup complete!
del /q "cleanup.bat" 2>nul
