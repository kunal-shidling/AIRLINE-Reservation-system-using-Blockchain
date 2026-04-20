# 🚀 Complete Setup & Run Guide - Airline Reservation System

## ✅ All Upgrades Complete!

All components have been upgraded with **Awwwards-level UI**:
- ✅ Tailwind CSS integration (3.4)
- ✅ Premium design system (Dark, Gold, Cyan, Purple)
- ✅ Glassmorphism effects throughout
- ✅ Smooth animations (GSAP + Lenis)
- ✅ 3D interactive elements (React Three Fiber)
- ✅ Responsive mobile design

**Components Updated:**
- Navigation (Navbar)
- Authentication (Login, Register)
- Flight Search (FlightList, FlightCard)
- Booking (BookingForm, BookingHistory)
- Payment (PaymentModal)
- Dashboard
- Blockchain Viewer
- 3D Scenes (HeroScene, HomeScene, etc.)

---

## 🎨 UI Components Status

| Component | Status | Features |
|-----------|--------|----------|
| Navbar | ✅ Complete | Glassmorphic, responsive, auth-aware |
| Login | ✅ Complete | Premium card, gradient fields |
| Register | ✅ Complete | Multi-field form, smooth validation |
| FlightCard | ✅ Complete | Interactive card, price breakdown |
| BookingForm | ✅ Complete | Modal, passenger management, seat selection |
| PaymentModal | ✅ Complete | Multi-payment methods, crypto support |
| Dashboard | ✅ Complete | Stats grid, quick actions, profile |
| FlightList | ✅ Complete | Search console, flight display |
| BookingHistory | ✅ Complete | Booking cards, blockchain verification |
| BlockchainViewer | ✅ Complete | Block/transaction display |
| PremiumLanding | ✅ Complete | Hero, features, CTA sections |

---

## 📋 Prerequisites

Before running, ensure you have:
- **Node.js** 16+ (Check: `node --version`)
- **npm** 8+ (Check: `npm --version`)
- **Git** (Check: `git --version`)

### Optional (for Blockchain):
- **MetaMask** - For Ethereum payments (Chrome extension)
- **Sepolia Testnet** - Test network configured

---

## 🔧 Setup Instructions

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

This will install:
- React 18.2
- Tailwind CSS 3.4
- GSAP 3.15 + ScrollTrigger
- Lenis 1.3
- React Three Fiber + Drei
- And all other required dependencies

**Expected Time**: 2-3 minutes

### Step 2: Install Backend Dependencies

#### API Gateway
```bash
cd backend/api-gateway
npm install
```

#### Reservation Service
```bash
cd backend/services/reservation-service
npm install
```

#### Payment Service
```bash
cd backend/services/payment-service
npm install
```

#### Blockchain Service
```bash
cd backend/services/blockchain-module
npm install
```

---

## 🚀 Running the Application

### Option A: Run Everything at Once (Recommended)

#### Terminal 1 - Seed Database
```bash
cd backend/services/reservation-service
npm run seed
```
✅ Output: "4 flights seeded successfully"

#### Terminal 2 - API Gateway
```bash
cd backend/api-gateway
npm start
```
✅ Expected: "✓ API Gateway running on http://localhost:5000"

#### Terminal 3 - Reservation Service
```bash
cd backend/services/reservation-service
npm start
```
✅ Expected: "✓ Reservation Service running on http://localhost:5002"

#### Terminal 4 - Payment Service
```bash
cd backend/services/payment-service
npm start
```
✅ Expected: "✓ Payment Service running on http://localhost:5003"

#### Terminal 5 - Blockchain Service
```bash
cd backend/services/blockchain-module
npm start
```
✅ Expected: "✓ Blockchain running on http://localhost:5005"

#### Terminal 6 - React Frontend
```bash
cd frontend
npm start
```
✅ Expected: App opens at **http://localhost:3000**

---

### Option B: Using npm-run-all (Faster Setup)

Install globally:
```bash
npm install -g npm-run-all
```

Root directory one-liner:
```bash
npm-run-all --parallel "npm:start:*"
```

---

## 🌐 Access Points

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | 🎨 React App |
| **API Gateway** | http://localhost:5000 | 🔌 API Entry Point |
| **Reservation** | http://localhost:5002 | ✈️ Flight Booking |
| **Payment** | http://localhost:5003 | 💳 Payments |
| **Blockchain** | http://localhost:5005 | ⛓️ Blockchain |

---

## 🎮 Testing the Application

### 1. Home Page
- Navigate to http://localhost:3000
- See premium landing with 3D airplane scene
- Scroll and observe animations (Lenis smooth scroll + GSAP)

### 2. Create Account
```
URL: http://localhost:3000/register
- Fill form with test data
- Email: test@demo.com
- Password: password123
- Click "Create Account"
```

### 3. Search Flights
```
URL: http://localhost:3000/flights
- Origin: goa
- Destination: delhi
- Date: 2026-04-04
- Click "Run Search"
✅ See 3 flights (pre-seeded)
```

### 4. Book a Flight
```
- Click "Book Now" on any flight
- Fill passenger details
- Select seat class
- Proceed to payment
```

### 5. Make Payment
```
Method 1: Credit Card
- Card: 4532123456789010
- Holder: John Doe
- Expiry: 12/25
- CVV: 123

Method 2: Crypto (MetaMask)
- Have Sepolia ETH in wallet
- Follow MetaMask prompts
```

### 6. View Bookings
```
URL: http://localhost:3000/bookings
- See all your confirmed flights
- View blockchain transaction hashes
```

### 7. Blockchain Verification
```
URL: http://localhost:3000/blockchain
- See all blocks
- View transactions
- Click "Validate Chain"
```

---

## ✨ Premium UI Features to Try

### Smooth Scroll
- Scroll any page
- Notice inertial scrolling (Lenis)
- No jank, buttery smooth

### 3D Interactions
- **Landing Page**: Drag airplane model with mouse
- **Dashboard**: Watch 3D flight explorer
- **Booking**: 3D booking scene animation

### Responsive Design
- Open DevTools (F12)
- Toggle device toolbar
- See design adapt to mobile/tablet/desktop

### Hover Animations
- Flight cards expand on hover
- Buttons with shine effect
- Form fields glow on focus

### Glassmorphism
- See transparent glass-effect cards throughout
- Backdrop blur on dark background
- Premium luxury aesthetic

---

## 🔌 Database Connection

The application uses **MongoDB**. Ensure:

1. MongoDB is running locally or remote URI is configured
2. Check `backend/services/reservation-service/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/flight-booking
   # or your remote MongoDB connection
   ```

3. If MongoDB isn't running locally, start it:
   ```bash
   # Windows
   mongod

   # Mac
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

---

## 📊 Network Requests

### Example API Call
```bash
curl http://localhost:5000/api/flights/search \
  -X GET \
  -H "Content-Type: application/json"
  -d "{
    "origin": "goa",
    "destination": "delhi",
    "date": "2026-04-04",
    "passengers": 1
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "flight123",
      "flightNumber": "AI101",
      "airline": "Air India",
      "origin": { "city": "Goa", "code": "GOA" },
      "destination": { "city": "Delhi", "code": "DEL" },
      "price": { "economy": 5000, "business": 15000 },
      "availableSeats": { "economy": 150, "business": 40 }
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Frontend)
npx fkill :3000

# Kill process on port 5000 (API Gateway)
npx fkill :5000

# Kill all Node processes
taskkill /F /IM node.exe (Windows)
killall node (Mac/Linux)
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not running, start it
mongod
```

### npm install stuck
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Port 3000 shows blank page
```bash
# Check browser console for errors (F12)
# Clear cache: Ctrl+Shift+Delete
# Restart frontend: npm start
```

### API calls failing
```bash
# Check all services are running
# Open http://localhost:5000/api/health (should be OK)

# Verify MongoDB connection
# Check terminal logs for connection errors
```

---

## 📱 Device Testing

### Desktop
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

### Mobile
- iOS Safari (12+)
- Chrome Android
- Samsung Internet

**Responsive Breakpoints:**
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

---

## 🎯 Performance Tips

1. **Use Chrome DevTools**
   - Open DevTools (F12)
   - Performance tab to see 60 FPS animations
   - Network tab to monitor API calls

2. **Disable Extensions**
   - Some extensions block animations
   - Test in incognito mode

3. **Check Network Speed**
   - DevTools → Network → Throttling
   - Test on 3G to see how app performs

4. **Monitor Memory**
   - DevTools → Memory
   - Watch for memory leaks during navigation

---

## 📚 Key Files

```
directory-tree/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/              (Login, Register)
│   │   │   ├── Layout/            (Navbar)
│   │   │   ├── Landing/           (PremiumLanding)
│   │   │   ├── Flights/           (FlightList, FlightCard)
│   │   │   ├── Booking/           (BookingForm, BookingHistory)
│   │   │   ├── Payment/           (PaymentModal)
│   │   │   ├── Dashboard/         (Dashboard)
│   │   │   ├── Blockchain/        (BlockchainViewer)
│   │   │   ├── 3D/                (HeroScene, HomeScene, etc.)
│   │   ├── hooks/                 (useLenis, useScrollAnimation)
│   │   ├── index.css              (Tailwind + globals)
│   │   └── App.jsx
│   ├── tailwind.config.js         (Theme configuration)
│   ├── postcss.config.js
│   └── package.json
│
├── backend/
│   ├── api-gateway/               (Express server)
│   ├── services/
│   │   ├── reservation-service/
│   │   ├── payment-service/
│   │   ├── blockchain-module/
│   │   └── ...
│   └── ...
│
└── README.md
```

---

## ✅ Final Checklist

Before declaring success:

- [ ] Frontend loads at http://localhost:3000
- [ ] Navbar displays with logo
- [ ] Landing page shows 3D airplane
- [ ] Smooth scroll works (visible on scroll)
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Flight search returns results (3 flights)
- [ ] Can view individual flight details
- [ ] Can book a flight
- [ ] Payment form appears
- [ ] Can complete payment (card or crypto)
- [ ] Booking appears in "My Bookings"
- [ ] Blockchain viewer shows transaction
- [ ] Dashboard stats update
- [ ] All buttons are responsive
- [ ] Mobile design is responsive
- [ ] No console errors (F12)

---

## 🎉 Success!

Once you see the app running with all features working:

1. **Observe the Premium UI:**
   - Glassmorphic cards
   - Smooth animations
   - Gradient texts and glows
   - Responsive layout

2. **Test Interactions:**
   - Hover over buttons (shine effect)
   - Click form fields (glow animation)
   - Scroll pages (GSAP animations trigger)
   - Drag 3D model (mouse interaction)

3. **Verify Backend:**
   - Check console logs for successful requests
   - Verify MongoDB inserts
   - Confirm blockchain transactions

---

## 🆘 Need Help?

Check these files for configuration:

1. **Backend Configuration**
   - `backend/api-gateway/.env`
   - `backend/services/*/env`
   - Verify port numbers match

2. **Frontend Configuration**
   - `frontend/.env` (if exists)
   - API endpoints in service files

3. **Database Configuration**
   - MongoDB URI in service `.env`
   - Database name matches seeding script

4. **3D Models**
   - Check `frontend/public/models/` exists
   - Models loading in Network tab (DevTools)

---

**Last Updated:** 2026-03-31
**Status:** ✅ Complete & Ready to Run
**All 12+ Components:** ✅ Premium Styled
