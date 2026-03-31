@echo off
REM Windows Batch Script to Start All Services

echo Starting Airline Reservation System...
echo ========================================

REM Start User Service
cd backend\services\user-service
start "User Service" cmd /c "npm start"
cd ..\..\..

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start Reservation Service
cd backend\services\reservation-service
start "Reservation Service" cmd /c "npm start"
cd ..\..\..

timeout /t 2 /nobreak >nul

REM Start Payment Service
cd backend\services\payment-service
start "Payment Service" cmd /c "npm start"
cd ..\..\..

timeout /t 2 /nobreak >nul

REM Start Blockchain Module
cd backend\services\blockchain-module
start "Blockchain Module" cmd /c "npm start"
cd ..\..\..

timeout /t 2 /nobreak >nul

REM Start AI Module (Python)
cd backend\services\ai-module
start "AI Module" cmd /c "python src\app.py"
cd ..\..\..

timeout /t 2 /nobreak >nul

REM Start API Gateway
cd backend\api-gateway
start "API Gateway" cmd /c "npm start"
cd ..\..

timeout /t 2 /nobreak >nul

REM Start Frontend
cd frontend
start "React Frontend" cmd /c "npm start"
cd ..

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Service URLs:
echo   Frontend:     http://localhost:3000
echo   API Gateway:  http://localhost:5000
echo.
pause
