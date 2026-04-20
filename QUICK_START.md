# 🚀 Quick Run Commands - Airline Reservation System

## ⚡ TL;DR - Start Everything Now

Copy & paste these commands in **separate terminal windows**:

---

## Terminal 1️⃣ - Seed Database (Run First)
```bash
cd "d:\airline reservation\backend\services\reservation-service"
npm run seed
```
**Expected Output:** ✅ "4 flights seeded successfully"

---

## Terminal 2️⃣ - API Gateway
```bash
cd "d:\airline reservation\backend\api-gateway"
npm start
```
**Expected Output:** ✅ "API Gateway running on http://localhost:5000"

---

## Terminal 3️⃣ - Reservation Service
```bash
cd "d:\airline reservation\backend\services\reservation-service"
npm start
```
**Expected Output:** ✅ "Reservation Service running on http://localhost:5002"

---

## Terminal 4️⃣ - Payment Service
```bash
cd "d:\airline reservation\backend\services\payment-service"
npm start
```
**Expected Output:** ✅ "Payment Service running on http://localhost:5003"

---

## Terminal 5️⃣ - Blockchain Service
```bash
cd "d:\airline reservation\backend\services\blockchain-module"
npm start
```
**Expected Output:** ✅ "Blockchain running on http://localhost:5005"

---

## Terminal 6️⃣ - React Frontend (LAST)
```bash
cd "d:\airline reservation\frontend"
npm start
```
**Expected Output:** ✅ Browser opens with http://localhost:3000

---

## 🌐 Check Your Browser

Once all 6 services are running:

### ✅ Open This in Your Browser:
```
http://localhost:3000
```

You should see:
- 🎨 **Premium dark landing page**
- ✈️ **3D airplane rotating/floating**
- 💫 **Smooth scroll animations**
- 🌟 **Glassmorphic cards**
- ✨ **Gradient text and effects**

---

## 🎮 Quick Test Flow

1. **See the App**
   - Landing page loads with premium design
   - 3D airplane model visible
   - Scroll to see animations trigger

2. **Register**
   - Top right: "Sign Up"
   - Fill form: email, password, name, phone
   - Submit and login

3. **Search Flights**
   - Click "Explore Flights" or use navbar
   - Origin: `goa`
   - Destination: `delhi`
   - Date: `2026-04-04`
   - Click "Run Search"
   - **See 3 flights appear!** ✅

4. **Book a Flight**
   - Click "Book Now"
   - Fill passenger info
   - Select seat class
   - Choose seats
   - Proceed to payment

5. **Pay**
   - Choose payment method:
     - 💳 **Credit Card:** 4532123456789010
     - ⟠ **Ethereum:** Connect MetaMask (needs Sepolia ETH)
   - Complete payment

6. **View Bookings**
   - Click "My Bookings" in navbar
   - See your confirmed flight
   - See blockchain transaction hash ⛓️

7. **Verify on Blockchain**
   - Click "Blockchain" in navbar
   - See all blocks and transactions
   - Click "Validate Chain"

---

## 🛑 Stop Everything

Press `Ctrl + C` in each terminal window to stop services.

---

## 🐛 If Something Goes Wrong

### Service won't start?
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Then restart terminal and run again
```

### Port already in use?
```bash
# Kill process on specific port
npx fkill :3000  (Frontend)
npx fkill :5000  (API Gateway)
npx fkill :5002  (Reservation)
npx fkill :5003  (Payment)
npx fkill :5005  (Blockchain)
```

### MongoDB not found?
Ensure MongoDB is installed and running:
```bash
# Check if MongoDB is installed
mongosh --version

# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud) - set MONGO_URI in .env files
```

### npm install failing?
```bash
npm cache clean --force
npm install
```

---

## 📊 Service Status Check

All services should show `Running` status:

| Service | Port | Status |
|---------|------|--------|
| Frontend | 3000 | 🟢 |
| API Gateway | 5000 | 🟢 |
| Reservation | 5002 | 🟢 |
| Payment | 5003 | 🟢 |
| Blockchain | 5005 | 🟢 |

---

## 🎯 What You'll See

### Landing Page
- Dark background with gradients
- 3D rotating airplane model
- Smooth scroll animations
- Luxury typography
- Glassmorphic cards
- Premium CTA buttons

### Flight Search Results
- Beautiful flight cards
- Interactive hover effects
- Price breakdown for each class
- Available seat counts
- Status indicators

### Booking Modal
- Professional booking form
- Passenger management
- Seat selection with 3D preview
- Real-time price calculation
- Glassmorphic design

### Payment Modal
- Multiple payment methods
- Card form with validation
- Ethereum/MetaMask integration
- Price breakdown with charges
- Security indicator

### Dashboard
- Welcome message with your name
- Stats grid (bookings, spend, upcoming flights)
- 3D flight explorer
- Quick action buttons
- User profile information

### Blockchain Viewer
- All blocks displayed
- Transaction details
- Block validation
- Chain integrity check

---

## 📝 Login Credentials (After Registration)

Create your own during signup, or use test:
```
Email: test@demo.com
Password: password123
```

---

## 🎨 UI Features to Try

1. **Hover Effects** - Button shine animations
2. **Form Focus** - Input field glow on focus
3. **Scroll** - GSAP animations trigger
4. **3D Model** - Drag airplane with mouse
5. **Mobile** - Resize browser to see responsive design
6. **Dark Mode** - Already implemented (premium dark aesthetic)

---

## ✅ Success Indicators

- ✅ Frontend loads at 3000
- ✅ Navbar visible with logo
- ✅ Can register/login
- ✅ Flight search returns 3 results
- ✅ Can complete booking
- ✅ Payment processes
- ✅ Booking appears in history
- ✅ Blockchain shows transactions
- ✅ All animations smooth
- ✅ Mobile responsive

---

## 📚 Documentation

For detailed info, check:
- `COMPLETE_SETUP_GUIDE.md` - Full setup instructions
- `PREMIUM_UI_GUIDE.md` - UI component documentation
- `COMPLETION_CHECKLIST.md` - Testing checklist

---

## 🎉 You're All Set!

Just run the 6 commands above in separate terminal windows and you're ready to explore the premium airline reservation system!

**Expected Total Setup Time:** 5-10 minutes
**Expected First Load Time:** 1-2 seconds

---

**Happy Travels! ✈️**
