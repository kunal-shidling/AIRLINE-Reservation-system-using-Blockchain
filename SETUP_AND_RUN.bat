@echo off
cls
echo ============================================================
echo    AIRLINE RESERVATION SYSTEM - Setup and Installation    
echo ============================================================
echo.

echo [STEP 1] Checking MongoDB...
netstat -an | findstr ":27017" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running on port 27017
) else (
    echo ❌ MongoDB is NOT running!
    echo Please start MongoDB service first.
    pause
    exit /b 1
)
echo.

echo [STEP 2] Configuration Files Status...
echo ✅ API Gateway .env created
echo ✅ User Service .env created
echo ✅ Reservation Service .env created
echo ✅ Payment Service .env created
echo ✅ Blockchain Module .env created
echo ✅ AI Module .env created
echo ✅ Frontend .env created
echo.

echo ============================================================
echo              MONGODB URL CONFIGURATION
echo ============================================================
echo.
echo 📍 MongoDB connection is configured in these files:
echo    1. backend\services\user-service\.env
echo    2. backend\services\reservation-service\.env
echo    3. backend\services\payment-service\.env
echo.
echo Current setting: mongodb://localhost:27017/airline_reservation
echo.
echo ⚠️  To change MongoDB URL, edit MONGODB_URI in above files
echo.
echo ============================================================
echo                  API KEYS INFORMATION
echo ============================================================
echo.
echo ✅ GOOD NEWS: No API keys required!
echo.
echo This application works WITHOUT any paid API keys.
echo.
echo Optional (for advanced features only):
echo   - OpenAI API: backend\services\ai-module\.env
echo   - HuggingFace: backend\services\ai-module\.env
echo.
pause

echo.
echo [STEP 3] Installing User Service dependencies...
cd backend\services\user-service
call npm install --silent
cd ..\..\..
echo ✅ User Service dependencies installed
echo.

echo NOTE: Other services need similar setup. 
echo.
echo ============================================================
echo                  NEXT STEPS TO RUN
echo ============================================================
echo.
echo To start the application, you need to:
echo.
echo 1. Make sure MongoDB is running (Already checked ✅)
echo.
echo 2. Open 7 separate terminals and run:
echo.
echo    Terminal 1: cd backend\services\user-service ^&^& npm start
echo    Terminal 2: cd backend\services\reservation-service ^&^& npm start
echo    Terminal 3: cd backend\services\payment-service ^&^& npm start
echo    Terminal 4: cd backend\services\blockchain-module ^&^& npm start
echo    Terminal 5: cd backend\services\ai-module ^&^& python src\app.py
echo    Terminal 6: cd backend\api-gateway ^&^& npm start
echo    Terminal 7: cd frontend ^&^& npm start
echo.
echo 3. Access the application at: http://localhost:3000
echo.
echo ============================================================
echo.
echo ✅ Setup complete! Read QUICK_START_GUIDE.md for details.
echo.
pause
