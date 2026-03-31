# 🚀 HOW TO RUN THE APPLICATION

## ✅ Prerequisites Check

Before running, ensure:
- ✅ MongoDB is running (port 27017)
- ✅ Node.js installed
- ✅ Python installed

---

## 📝 STEP-BY-STEP COMMANDS TO RUN

### ✅ STEP 1: User Service (Already Running ✅)

The User Service is already active on port 5001.

To verify:
```bash
curl http://localhost:5001/health
```

---

### 🔥 STEP 2: Start Frontend (React)

Open a **NEW terminal** window:

```bash
cd "d:\airline reservation\frontend"
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view airline-reservation-frontend in the browser.
Local:            http://localhost:3000
```

**Access:** http://localhost:3000

---

### ⚡ OPTIONAL: Start Other Backend Services

If you want full functionality, open separate terminals for each:

#### Terminal 2 - API Gateway
```bash
cd "d:\airline reservation\backend\api-gateway"
npm install
npm start
```
**Port:** 5000

#### Terminal 3 - Reservation Service
```bash
cd "d:\airline reservation\backend\services\reservation-service"
npm install
npm start
```
**Port:** 5002

#### Terminal 4 - Payment Service
```bash
cd "d:\airline reservation\backend\services\payment-service"
npm install
npm start
```
**Port:** 5003

#### Terminal 5 - Blockchain Module
```bash
cd "d:\airline reservation\backend\services\blockchain-module"
npm install
npm start
```
**Port:** 5005

#### Terminal 6 - AI Module (Python)
```bash
cd "d:\airline reservation\backend\services\ai-module"
pip install flask flask-cors python-dotenv
python src/app.py
```
**Port:** 5004

---

## 🌐 ACCESS THE APPLICATION

Once frontend is running:

1. **Open browser:** http://localhost:3000
2. **Register new account** or **Login**
3. **Explore features:**
   - Flight search
   - Dashboard
   - Bookings
   - Blockchain viewer

---

## 🧪 TEST THE APPLICATION

### Test User Service (Already running)
```bash
# Register a user
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"phone\":\"1234567890\"}"

# Login
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

---

## 🛠️ TROUBLESHOOTING

### Port Already in Use

```bash
# Windows - Find process on port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Cannot find module errors

```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### MongoDB connection error

```bash
# Check if MongoDB is running
netstat -an | findstr :27017

# Start MongoDB (if not running)
# Windows: Start "MongoDB" service
# Linux/Mac: mongod
```

---

## ✅ CURRENT STATUS

| Service | Port | Status | Command |
|---------|------|--------|---------|
| **Frontend** | 3000 | Installing | `cd frontend && npm start` |
| **User Service** | 5001 | ✅ Running | Already started |
| **API Gateway** | 5000 | ⏳ Ready | `cd backend/api-gateway && npm start` |
| **Reservation** | 5002 | ⏳ Ready | Manual start needed |
| **Payment** | 5003 | ⏳ Ready | Manual start needed |
| **AI Module** | 5004 | ⏳ Ready | Manual start needed |
| **Blockchain** | 5005 | ⏳ Ready | Manual start needed |

---

## 🎯 QUICK START (Minimum Setup)

**For basic demonstration, you only need:**

1. ✅ User Service (already running on 5001)
2. ✅ Frontend (run: `cd frontend && npm start`)

Then access: http://localhost:3000

---

## 📊 WHAT YOU CAN DO NOW

With just User Service + Frontend:
- ✅ Register new user
- ✅ Login/Logout
- ✅ View dashboard
- ✅ See sample flights
- ✅ View profile

For full features (booking, payment, blockchain), start other services.

---

## 📞 NEED HELP?

Check these files:
- `EXECUTION_STATUS.md` - Current status
- `WHERE_TO_PLACE_CONFIGURATIONS.md` - Configuration guide
- `START_HERE.md` - Quick reference

---

🎊 **Your application is ready to run!**

