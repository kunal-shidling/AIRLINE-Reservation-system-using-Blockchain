# ✈️ Smart Airline Reservation System

A production-ready **microservices-based airline reservation system** featuring **AI-powered recommendations** and **blockchain-based transaction logging**.

## 🎯 Project Overview
 
This is a comprehensive college project demonstrating:
- **Microservices Architecture** with independent services
- **AI-Based Flight Recommendations** using rule-based algorithms
- **Blockchain Integration** for immutable transaction logs
- **Modern Full-Stack Development** (React + Node.js + Python)
- **RESTful API Design** with API Gateway pattern
- **JWT Authentication** for secure user management

---

## 🏗️ Architecture

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

## 🛠️ Tech Stack

### Backend
- **Node.js** (Express.js) - Microservices
- **Python** (Flask) - AI Module
- **MongoDB** - Database (Single instance)
- **JWT** - Authentication
- **Axios** - Inter-service communication

### Frontend
- **React 18** - UI Framework
- **React Router** - Navigation
- **Context API** - State Management
- **CSS3** - Styling

### AI & Blockchain
- **Custom Blockchain** - SHA-256, Proof of Work
- **Rule-Based AI** - Flight recommendations
- **Demand Prediction** - Travel analytics

---

## 📁 Project Structure

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
├── frontend/                     # React application (Port 3000)
├── scripts/                      # Setup scripts
└── docs/                         # Documentation
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have installed:
- **Node.js** (v18+)
- **Python** (v3.9+)
- **MongoDB** (v6+)
- **npm** or **yarn**

### Installation

#### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd airline-reservation-system
```

#### 2️⃣ Start MongoDB

```bash
mongod
```

#### 3️⃣ Seed Database

```bash
cd scripts
node seed-database.js
```

#### 4️⃣ Install Dependencies

**Backend Services:**
```bash
cd backend/services/user-service && npm install
cd ../reservation-service && npm install
cd ../payment-service && npm install
cd ../blockchain-module && npm install
cd ../../api-gateway && npm install
```

**AI Module (Python):**
```bash
cd backend/services/ai-module
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

#### 5️⃣ Start All Services

**Option A: Using Script (Linux/Mac)**
```bash
chmod +x scripts/start-all-services.sh
./scripts/start-all-services.sh
```

**Option B: Using Batch (Windows)**
```bash
scripts\start-all-services.bat
```

**Option C: Manual Start (Each service in separate terminal)**

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

---

## 🌐 Access Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **User Service**: http://localhost:5001/health
- **Reservation Service**: http://localhost:5002/health
- **Payment Service**: http://localhost:5003/health
- **AI Module**: http://localhost:5004/health
- **Blockchain Module**: http://localhost:5005/health

---

## 👤 Sample Credentials

```
Email: john.doe@example.com
Password: password123

Email: jane.smith@example.com
Password: password123
```

---

## 🎓 Key Features Demonstrated

### 1. **Microservices Architecture**
- Independent deployable services
- Service-to-service communication
- API Gateway pattern
- Database per service (simulated with collections)

### 2. **OOP Principles**
- **Encapsulation**: Service classes with private methods
- **Inheritance**: Base service patterns
- **Polymorphism**: Multiple payment methods
- **Abstraction**: Database abstraction layers

### 3. **AI Integration**
- Rule-based flight recommendations
- Demand prediction algorithms
- Price trend analysis
- Personalized suggestions

### 4. **Blockchain Technology**
- SHA-256 hashing
- Proof of Work (mining)
- Chain validation
- Immutable transaction logs
- Block persistence

### 5. **Security**
- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- Secure payment handling

### 6. **RESTful API Design**
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Status codes
- Error handling
- Request/Response patterns

---

## 📡 API Endpoints

### Authentication
```
POST   /api/users/register      - Register new user
POST   /api/users/login         - User login
GET    /api/users/profile       - Get user profile (Protected)
PUT    /api/users/profile       - Update profile (Protected)
```

### Flights & Bookings
```
GET    /api/flights             - Get all flights
GET    /api/flights/search      - Search flights
POST   /api/bookings            - Create booking (Protected)
GET    /api/bookings            - Get user bookings (Protected)
PUT    /api/bookings/:id/cancel - Cancel booking (Protected)
```

### Payments
```
POST   /api/payments/process    - Process payment (Protected)
GET    /api/payments/history    - Payment history (Protected)
```

### AI Recommendations
```
POST   /api/ai/recommendations  - Get flight recommendations
GET    /api/ai/popular-destinations - Popular destinations
```

### Blockchain
```
GET    /api/blockchain/chain    - View entire blockchain
GET    /api/blockchain/stats    - Blockchain statistics
GET    /api/blockchain/validate - Validate chain integrity
```

---

## 🧪 Testing

### Manual Testing

1. **Register & Login**
   - Navigate to http://localhost:3000/register
   - Create account or use sample credentials

2. **Search Flights**
   - Browse available flights
   - View AI recommendations

3. **Book Flight**
   - Select a flight
   - Add passenger details
   - Complete payment

4. **View Bookings**
   - Check booking history
   - View blockchain verification

5. **Blockchain Viewer**
   - Navigate to `/blockchain`
   - Validate chain integrity

### API Testing (Postman/cURL)

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

# Get Flights
curl http://localhost:5000/api/flights
```

---

## 💡 Improvements for Higher Marks

### Implemented Features
✅ Microservices architecture
✅ JWT authentication
✅ AI-based recommendations
✅ Blockchain integration
✅ OOP design patterns
✅ Rate limiting
✅ Error handling
✅ Responsive UI

### Suggested Enhancements
- **Docker Containerization** - Add `Dockerfile` for each service
- **WebSocket Integration** - Real-time booking updates
- **Redis Caching** - Cache flight searches
- **Email Notifications** - Booking confirmations
- **Admin Dashboard** - Flight management
- **Payment Gateway** - Real payment integration (Stripe/PayPal)
- **Testing Suite** - Jest/Mocha unit tests
- **CI/CD Pipeline** - GitHub Actions
- **Swagger Documentation** - API docs
- **Kubernetes Deployment** - Orchestration

---

## 📊 Database Schema

### Users Collection
```javascript
{
  firstName, lastName, email, password (hashed),
  phone, dateOfBirth, address, preferences
}
```

### Flights Collection
```javascript
{
  flightNumber, airline, origin, destination,
  departureTime, arrivalTime, duration,
  price: { economy, business, firstClass },
  availableSeats, status
}
```

### Bookings Collection
```javascript
{
  bookingReference, userId, flightId,
  passengers, seatClass, totalPrice,
  status, paymentId, blockchainTransactionId
}
```

### Payments Collection
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
 
