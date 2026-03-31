#!/bin/bash

# Stop All Services Script
# This script stops all running microservices

echo "🛑 Stopping Airline Reservation System..."
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop services by port
stop_by_port() {
    local port=$1
    local service_name=$2

    local pid=$(lsof -ti:$port)

    if [ ! -z "$pid" ]; then
        echo -e "${RED}Stopping ${service_name} (Port: ${port}, PID: ${pid})${NC}"
        kill -9 $pid 2>/dev/null
        echo -e "${GREEN}✓ ${service_name} stopped${NC}"
    else
        echo "  ${service_name} is not running"
    fi
}

# Stop all services
stop_by_port 3000 "React Frontend"
stop_by_port 5000 "API Gateway"
stop_by_port 5001 "User Service"
stop_by_port 5002 "Reservation Service"
stop_by_port 5003 "Payment Service"
stop_by_port 5004 "AI Module"
stop_by_port 5005 "Blockchain Module"

echo ""
echo -e "${GREEN}========================================"
echo "✨ All services stopped"
echo "========================================${NC}"
