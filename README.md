# ✈️ Smart Airline Reservation System

A production-ready **microservices-based airline reservation system** featuring **AI-powered recommendations** and **blockchain-based transaction logging**.

## Table of Contents

- Project Overview
- Architecture
- Tech Stack
- Project Structure
- Quick Start
- Access URLs
- Sample Credentials
- Features
- API Endpoints
- Testing
- Improvements
- Database Schema

## Project Overview

This is a comprehensive college project demonstrating:
- Microservices architecture with independent services
- AI-based flight recommendations using rule-based algorithms
- Blockchain integration for immutable transaction logs
- Modern full-stack development (React + Node.js + Python)
- RESTful API design with API Gateway pattern
- JWT authentication for secure user management

## Project Overview

This project demonstrates:
- Microservices architecture with an API Gateway
- AI-based flight recommendations
- Blockchain-backed transaction logging
- Modern full-stack development (React + Node.js + Python)
- RESTful API design and JWT authentication

## Architecture

```
┌─────────────┐
│   React     │  Frontend (Port 3000)
│  Frontend   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────┐
│        API Gateway (Port 5000)          │
│  - Authentication                        │
│  - Rate Limiting                         │
│  - Request Routing                       │
└────┬────┬────┬─────┬──────┬─────────────┘
     │    │    │     │      │
     ↓    ↓    ↓     ↓      ↓
   ┌───┐┌───┐┌───┐┌───┐┌──────┐
   │USR││RES││PAY││AI ││BLOCK │
   │5001││5002││5003││5004││5005│
   └───┘└───┘└───┘└───┘└──────┘
```

## Tech Stack

### Backend
- Node.js (Express.js) - Microservices
- Python (Flask) - AI module
- MongoDB - Database (single instance)
- JWT - Authentication
- Axios - Inter-service communication

### Frontend
- React 18
- React Router
- Context API
- CSS3

### AI and Blockchain
- Custom blockchain (SHA-256, PoW)
- Rule-based AI recommendations
- Demand prediction

## Project Structure

```
airline-reservation-system/
├── backend/
│   ├── api-gateway/              # Single entry point (Port 5000)
│   ├── services/
│   │   ├── user-service/         # Authentication (Port 5001)
│   │   ├── reservation-service/  # Bookings (Port 5002)
│   │   ├── payment-service/      # Payments (Port 5003)
│   │   ├── ai-module/            # AI (Port 5004, Python)
│   │   └── blockchain-module/    # Blockchain (Port 5005)
│   └── shared/                   # Common utilities
├── frontend/                     # React app (Port 3000)
├── scripts/                      # Setup scripts
└── docs/                         # Documentation
```

## Quick Start

### Prerequisites

- Node.js v18+
- Python v3.9+
- MongoDB v6+
- npm or yarn

### Installation

1) Clone the repo

```bash
git clone <repository-url>
cd airline-reservation-system
```

2) Start MongoDB

```bash
mongod
```

3) Seed database

```bash
cd scripts
node seed-database.js
```

4) Install dependencies

Backend services:

```bash
cd backend/services/user-service && npm install
cd ../reservation-service && npm install
cd ../payment-service && npm install
cd ../blockchain-module && npm install
cd ../../api-gateway && npm install
```

AI module (Python):

```bash
cd backend/services/ai-module
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Frontend:

```bash
cd frontend
npm install
```

5) Start all services

Linux and macOS:

```bash
chmod +x scripts/start-all-services.sh
./scripts/start-all-services.sh
```

Windows:

```bash
scripts\start-all-services.bat
```

Manual start (separate terminals):

```bash
# Terminal 1 - User Service
cd backend/services/user-service
npm start

# Terminal 2 - Reservation Service
cd backend/services/reservation-service
npm start

# Terminal 3 - Payment Service
cd backend/services/payment-service
npm start

# Terminal 4 - Blockchain Module
cd backend/services/blockchain-module
npm start

# Terminal 5 - AI Module
cd backend/services/ai-module
python src/app.py

# Terminal 6 - API Gateway
cd backend/api-gateway
npm start

# Terminal 7 - Frontend
cd frontend
npm start
```

## Access URLs

- Frontend: http://localhost:3000
- API Gateway: http://localhost:5000
- User Service: http://localhost:5001/health
- Reservation Service: http://localhost:5002/health
- Payment Service: http://localhost:5003/health
- AI Module: http://localhost:5004/health
- Blockchain Module: http://localhost:5005/health

## Sample Credentials

```
Email: john.doe@example.com
Password: password123

Email: jane.smith@example.com
Password: password123
```

## Features

- Microservices architecture with API Gateway
- JWT authentication and role-based access
- AI-based flight recommendations
- Blockchain-backed booking transactions
- Responsive UI with search and booking flow
- Rate limiting and validation

## API Endpoints

Authentication:

```
POST   /api/users/register      - Register new user
POST   /api/users/login         - User login
GET    /api/users/profile       - Get user profile (Protected)
PUT    /api/users/profile       - Update profile (Protected)
```

Flights and bookings:

```
GET    /api/flights             - Get all flights
GET    /api/flights/search      - Search flights
POST   /api/bookings            - Create booking (Protected)
GET    /api/bookings            - Get user bookings (Protected)
PUT    /api/bookings/:id/cancel - Cancel booking (Protected)
```

Payments:

```
POST   /api/payments/process    - Process payment (Protected)
GET    /api/payments/history    - Payment history (Protected)
```

AI recommendations:

```
POST   /api/ai/recommendations      - Get flight recommendations
GET    /api/ai/popular-destinations - Popular destinations
```

Blockchain:

```
GET    /api/blockchain/chain    - View entire blockchain
GET    /api/blockchain/stats    - Blockchain statistics
GET    /api/blockchain/validate - Validate chain integrity
```

## Testing

Manual checklist:

1) Register and log in
2) Search flights and view AI recommendations
3) Book a flight and complete payment
4) View booking history and blockchain verification
5) Open the blockchain viewer

API testing:

```bash
# Health Check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'

# Get flights
curl http://localhost:5000/api/flights
```

## Improvements

Implemented:
- Microservices architecture
- JWT authentication
- AI recommendations
- Blockchain integration
- Rate limiting
- Error handling
- Responsive UI

Suggested:
- Docker containerization
- WebSocket updates
- Redis caching
- Email notifications
- Admin dashboard
- Real payment provider (Stripe/PayPal)
- Automated tests (Jest/Mocha)
- CI/CD pipeline
- Swagger API docs
- Kubernetes deployment

## Database Schema

Users:

```javascript
{
  firstName, lastName, email, password (hashed),
  phone, dateOfBirth, address, preferences
}
```

Flights:

```javascript
{
  flightNumber, airline, origin, destination,
  departureTime, arrivalTime, duration,
  price: { economy, business, firstClass },
  availableSeats, status
}
```

Bookings:

```javascript
{
  bookingReference, userId, flightId,
  passengers, seatClass, totalPrice,
  status, paymentId, blockchainTransactionId
}
```

Payments:

```javascript
{
  transactionId, bookingId, amount,
  paymentMethod, cardDetails, status,
  paidAt
}
```

---

## 🛡️ Security Features

- **Password Hashing** - bcrypt with salt
- **JWT Tokens** - Secure authentication
- **Rate Limiting** - DDoS protection
- **Input Validation** - XSS protection
- **CORS Configuration** - Cross-origin security
- **Card Number Masking** - PCI compliance

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -ti:5000
# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check MongoDB status
mongod --version
# Start MongoDB
mongod
```

### Python Module Not Found
```bash
cd backend/services/ai-module
pip install -r requirements.txt
```

### React Build Errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Project Highlights for Presentation

1. **Architecture Diagram** - Show microservices interaction
2. **Live Demo** - Register → Search → Book → Pay → Verify Blockchain
3. **Code Walkthrough** - Explain key classes
4. **AI Demonstration** - Show recommendation algorithm
5. **Blockchain Validation** - Demonstrate chain integrity
6. **Security Features** - JWT, encryption, validation

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

[Your Name]
[Your College]
[Year]

---

## 🙏 Acknowledgments

- **Express.js** - Web framework
- **React** - UI library
- **MongoDB** - Database
- **Flask** - Python web framework

---

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Email: [your-email@example.com]

---

**⭐ If this project helped you, please give it a star!**

---

## 🎯 Evaluation Checklist

- [x] Microservices Architecture
- [x] RESTful APIs
- [x] Database Integration
- [x] Authentication & Authorization
- [x] OOP Concepts
- [x] AI/ML Integration
- [x] Blockchain Implementation
- [x] Frontend Development
- [x] Error Handling
- [x] Code Documentation
- [x] Project Documentation
- [x] Live Demonstration Ready

**Estimated Project Completion: 95%+**
#   A I R L I N E - R e s e r v a t i o n - s y s t e m - u s i n g - B l o c k c h a i n 
 
<<<<<<< HEAD
 
=======
 
>>>>>>> 8bed901 (done updateed file)
