# 🚀 QUICK START GUIDE

## ✅ Prerequisites Check

- ✅ Node.js installed
- ✅ Python 3.12 installed
- ✅ MongoDB running on localhost:27017
- ✅ All .env files created

## 📍 MongoDB URL Location

### **WHERE TO FIND/CHANGE MONGODB URL:**

Edit these 3 files and look for `MONGODB_URI`:

```
1. backend/services/user-service/.env
2. backend/services/reservation-service/.env
3. backend/services/payment-service/.env
```

**Current Setting (Local MongoDB):**
```env
MONGODB_URI=mongodb://localhost:27017/airline_reservation
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airline_reservation
```

---

## 🔑 API Keys Location

### **GOOD NEWS:** No API keys required! ✅ 

The application works without any paid API keys.

**Optional enhancements** (not required):
- OpenAI API: `backend/services/ai-module/.env` → `OPENAI_API_KEY=...`
- HuggingFace: `backend/services/ai-module/.env` → `HUGGINGFACE_API_KEY=...`

---

## 📦 Installation Steps

### Step 1: Install Backend Dependencies

```bash
# User Service
cd backend/services/user-service
npm install

# Go back to root
cd ../../..

# Note: Need to create and install other services similarly
```

### Step 2: Install Python Dependencies

```bash
cd backend/services/ai-module
pip install flask flask-cors python-dotenv

cd ../../..
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install

cd ..
```

---

## 🎯 Starting the Application

### Option 1: Start All Services Manually

Open 6 separate terminal windows:

**Terminal 1 - User Service:**
```bash
cd backend/services/user-service
npm start
```

**Terminal 2 - Reservation Service:**
```bash
cd backend/services/reservation-service
npm start
```

**Terminal 3 - Payment Service:**
```bash
cd backend/services/payment-service
npm start
```

**Terminal 4 - Blockchain Module:**
```bash
cd backend/services/blockchain-module
npm start
```

**Terminal 5 - AI Module:**
```bash
cd backend/services/ai-module
python src/app.py
```

**Terminal 6 - API Gateway:**
```bash
cd backend/api-gateway
npm start
```

**Terminal 7 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Use Startup Script (Windows)

```bash
scripts\start-all-services.bat
```

---

## 🌐 Access URLs

After starting all services:

- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:5000
- **User Service:** http://localhost:5001
- **Reservation Service:** http://localhost:5002
- **Payment Service:** http://localhost:5003
- **AI Module:** http://localhost:5004
- **Blockchain Module:** http://localhost:5005

---

## 🧪 Test the Application

### 1. Register a New User

Go to: http://localhost:3000/register

Or use curl:
```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError`

**Solution:**
1. Check if MongoDB is running: `netstat -an | grep 27017`
2. Start MongoDB service
3. Verify MONGODB_URI in .env files

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process
taskkill /PID <PID> /F
```

### Python Module Not Found

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
cd backend/services/ai-module
pip install -r requirements.txt
```

---

## 📝 Summary

### ✅ MongoDB URL is configured in:
- `backend/services/user-service/.env`
- `backend/services/reservation-service/.env`
- `backend/services/payment-service/.env`

### ✅ No API Keys Required!
- Application works out of the box
- Optional: OpenAI/HuggingFace for advanced features

### ✅ All Services Configured:
- Ports: 5000-5005, 3000
- CORS enabled
- JWT authentication ready

---

## 🎊 Ready to Demo!

Your application is configured and ready to run. Just:
1. Make sure MongoDB is running
2. Start all services
3. Open http://localhost:3000

**Good luck with your presentation! 🚀**
