# 📍 WHERE TO PLACE MONGODB URL & API KEYS

## 🗺️ VISUAL DIRECTORY MAP

```
airline-reservation-system/
│
├── backend/
│   │
│   ├── api-gateway/
│   │   └── .env  ⚙️ [JWT_SECRET]
│   │       ├── JWT_SECRET=your-jwt-secret-here
│   │       └── (No MongoDB URL needed here)
│   │
│   └── services/
│       │
│       ├── user-service/
│       │   └── .env  🔴 [MONGODB_URI + JWT_SECRET]
│       │       ├── MONGODB_URI=mongodb://localhost:27017/airline_reservation
│       │       └── JWT_SECRET=your-jwt-secret-here
│       │
│       ├── reservation-service/
│       │   └── .env  🔴 [MONGODB_URI]
│       │       └── MONGODB_URI=mongodb://localhost:27017/airline_reservation
│       │
│       ├── payment-service/
│       │   └── .env  🔴 [MONGODB_URI]
│       │       └── MONGODB_URI=mongodb://localhost:27017/airline_reservation
│       │
│       ├── blockchain-module/
│       │   └── .env  ⚙️ [No MongoDB needed]
│       │       └── (File-based storage)
│       │
│       └── ai-module/
│           └── .env  🔑 [OPTIONAL API KEYS]
│               ├── (No keys required for basic functionality)
│               ├── OPENAI_API_KEY=sk-... (OPTIONAL)
│               └── HUGGINGFACE_API_KEY=hf_... (OPTIONAL)
│
└── frontend/
    └── .env  🌐 [API Gateway URL]
        └── REACT_APP_API_URL=http://localhost:5000

```

---

## 🔴 PRIORITY 1: MongoDB URL Configuration

### **📁 Files That NEED MongoDB URL:**

#### 1️⃣ **User Service**
**File:** `backend/services/user-service/.env`
```env
MONGODB_URI=mongodb://localhost:27017/airline_reservation
```

#### 2️⃣ **Reservation Service**
**File:** `backend/services/reservation-service/.env`
```env
MONGODB_URI=mongodb://localhost:27017/airline_reservation
```

#### 3️⃣ **Payment Service**
**File:** `backend/services/payment-service/.env`
```env
MONGODB_URI=mongodb://localhost:27017/airline_reservation
```

### 📝 **How to Change MongoDB URL:**

#### **Option A: Local MongoDB (Default - Already Configured ✅)**
```env
MONGODB_URI=mongodb://localhost:27017/airline_reservation
```
- Works if MongoDB is installed locally
- Default port: 27017
- Database name: airline_reservation

#### **Option B: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/airline_reservation?retryWrites=true&w=majority
```

**Steps to get MongoDB Atlas URL:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create FREE account
3. Create a cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>` and `<password>` with your credentials
7. Paste into all 3 .env files above

---

## 🔑 PRIORITY 2: API Keys (ALL OPTIONAL!)

### ✅ **GOOD NEWS:** Application works WITHOUT API keys!

### 🤖 **Optional: OpenAI API Key (For Advanced AI Features)**

**File:** `backend/services/ai-module/.env`
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**How to get:**
1. Visit: https://platform.openai.com/
2. Sign up / Login
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy key and paste in .env file

**Cost:** ~$5 trial credit (optional, not required)

---

### 🤗 **Optional: HuggingFace API Key (For ML Models)**

**File:** `backend/services/ai-module/.env`
```env
HUGGINGFACE_API_KEY=hf_your-token-here
```

**How to get:**
1. Visit: https://huggingface.co/
2. Create account (FREE)
3. Go to Settings → Access Tokens
4. Click "New token"
5. Copy and paste in .env file

**Cost:** FREE

---

## ⚙️ PRIORITY 3: JWT Secret (Already Configured ✅)

### **Files:**
- `backend/api-gateway/.env`
- `backend/services/user-service/.env`

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

**⚠️ Security Note:**
- Default value works for development
- For production: Change to a strong random string
- Generate one: https://www.uuidgenerator.net/

---

## 📊 CONFIGURATION CHECKLIST

### ✅ **Essential (Must Have):**
- [✅] MongoDB URL in user-service/.env
- [✅] MongoDB URL in reservation-service/.env
- [✅] MongoDB URL in payment-service/.env
- [✅] JWT_SECRET in api-gateway/.env
- [✅] JWT_SECRET in user-service/.env

### ⭐ **Optional (Nice to Have):**
- [ ] OpenAI API Key (AI module)
- [ ] HuggingFace API Key (AI module)

---

## 🎯 QUICK EDIT COMMANDS

### **To edit MongoDB URLs:**

**Windows:**
```cmd
notepad backend\services\user-service\.env
notepad backend\services\reservation-service\.env
notepad backend\services\payment-service\.env
```

**Linux/Mac:**
```bash
nano backend/services/user-service/.env
nano backend/services/reservation-service/.env
nano backend/services/payment-service/.env
```

### **What to change:**

Find this line:
```env
MONGODB_URI=mongodb://localhost:27017/airline_reservation
```

Replace with your MongoDB connection string.

---

## ✅ CURRENT STATUS

Your application is configured with:
- ✅ **MongoDB:** Local connection (localhost:27017)
- ✅ **JWT Secret:** Configured for development
- ✅ **API Keys:** Not required
- ✅ **All .env files:** Created and ready

---

## 🚀 READY TO RUN!

Your configuration is complete. No API keys needed!

**Next step:** Start all services and access at http://localhost:3000

See `QUICK_START_GUIDE.md` for startup instructions.

