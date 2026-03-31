#!/bin/bash

# Start All Microservices Script
# This script starts all backend services and the frontend

echo "🚀 Starting Airline Reservation System..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "\n${BLUE}Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}✗ MongoDB is not running${NC}"
    echo "Please start MongoDB first: mongod"
    exit 1
fi

# Function to start a service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3

    echo -e "\n${BLUE}Starting ${service_name}...${NC}"
    cd "$service_path"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies for ${service_name}..."
        npm install
    fi

    # Start service in background
    npm start > /dev/null 2>&1 &
    local pid=$!
    echo -e "${GREEN}✓ ${service_name} started on port ${port} (PID: ${pid})${NC}"

    cd - > /dev/null
}

# Start Python AI Module
echo -e "\n${BLUE}Starting AI Module (Python)...${NC}"
cd backend/services/ai-module

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

# Install dependencies
if [ ! -f ".dependencies_installed" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    touch .dependencies_installed
fi

# Start AI module
python src/app.py > /dev/null 2>&1 &
AI_PID=$!
echo -e "${GREEN}✓ AI Module started on port 5004 (PID: ${AI_PID})${NC}"

cd ../../..

# Start Node.js services
start_service "User Service" "backend/services/user-service" "5001"
start_service "Reservation Service" "backend/services/reservation-service" "5002"
start_service "Payment Service" "backend/services/payment-service" "5003"
start_service "Blockchain Module" "backend/services/blockchain-module" "5005"
start_service "API Gateway" "backend/api-gateway" "5000"

# Start Frontend
echo -e "\n${BLUE}Starting React Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm start > /dev/null 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started on port 3000 (PID: ${FRONTEND_PID})${NC}"

cd ..

# Summary
echo -e "\n${GREEN}========================================"
echo "✨ All services started successfully!"
echo "========================================${NC}"
echo ""
echo "📡 Service URLs:"
echo "   Frontend:     http://localhost:3000"
echo "   API Gateway:  http://localhost:5000"
echo "   User Service: http://localhost:5001"
echo "   Reservation:  http://localhost:5002"
echo "   Payment:      http://localhost:5003"
echo "   AI Module:    http://localhost:5004"
echo "   Blockchain:   http://localhost:5005"
echo ""
echo "📝 Sample Credentials:"
echo "   Email: john.doe@example.com"
echo "   Password: password123"
echo ""
echo "⚠️  To stop all services, run: ./scripts/stop-all-services.sh"
echo ""
