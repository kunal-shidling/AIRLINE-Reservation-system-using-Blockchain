# 🔧 Configuration Guide

## 📍 Where to Place MongoDB URL and API Keys

### ✅ **MongoDB Configuration**

**Location:** All `.env` files in backend services

```
backend/services/user-service/.env
backend/services/reservation-service/.env
backend/services/payment-service/.env
```

**Parameter:** `MONGODB_URI`

#### Option 1: Local MongoDB (Already Configured ✅)
```env
MONGODB_URI=mongodb://localhost:27017/airline_reservation
```

#### Option 2: MongoDB Atlas (Cloud)
If you want to use cloud MongoDB:

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Replace in all .env files:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/airline_reservation?retryWrites=true&w=majority
```

---

### 🔑 **API Keys (None Required for Basic Functionality!)**

This project works **WITHOUT any paid API keys**. However, for advanced features you can optionally add:

#### Optional: OpenAI API (for Advanced AI Recommendations)

**Location:** `backend/services/ai-module/.env`

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**How to get:**
1. Go to: https://platform.openai.com/
2. Sign up
3. Generate API key
4. Paste in .env file

#### Optional: HuggingFace API (for ML Models)

**Location:** `backend/services/ai-module/.env`

```env
HUGGINGFACE_API_KEY=hf_your-huggingface-token-here
```

**How to get:**
1. Go to: https://huggingface.co/
2. Create account
3. Go to Settings > Access Tokens
4. Create new token
5. Paste in .env file

---

### 🔐 **JWT Secret (Already Configured ✅)**

**Location:** 
- `backend/api-gateway/.env`
- `backend/services/user-service/.env`

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

**⚠️ Security Note:** Change this to a strong random string in production!

---

## 📂 **All .env File Locations**

```
airline-reservation-system/
├── backend/
│   ├── api-gateway/.env                    ✅ Created
│   └── services/
│       ├── user-service/.env               ✅ Created
│       ├── reservation-service/.env        ✅ Created
│       ├── payment-service/.env            ✅ Created
│       ├── ai-module/.env                  ✅ Created
│       └── blockchain-module/.env          ✅ Created
└── frontend/.env                           ✅ Created
```

---

## ✅ **Current Configuration Status**

- ✅ MongoDB: Configured for localhost:27017
- ✅ JWT Authentication: Configured
- ✅ All Services: Configured with correct ports
- ✅ No API Keys Required: Works out of the box!
- ⚠️ Optional Enhancements: Can add OpenAI/HuggingFace keys

---

## 🚀 **Ready to Run!**

Your application is fully configured and ready to start. No additional API keys needed for basic functionality.

```bash
# Start all services
scripts\start-all-services.bat
```

---

## 🔄 **Need to Change MongoDB URL?**

Edit these 3 files and replace MONGODB_URI:
1. `backend/services/user-service/.env`
2. `backend/services/reservation-service/.env`
3. `backend/services/payment-service/.env`

That's it! 🎉
