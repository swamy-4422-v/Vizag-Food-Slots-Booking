# Vizag Food Stall Booking - MERN App

Location-based booking for Visakhapatnam food stalls. GPS → Nearby stalls → Book slots → No queues!

## Features
- Haversine distance sorting
- Leaflet interactive map
- Anti-double booking (Mongo atomic check)
- JWT auth (httpOnly cookies)
- Tailwind UI
- Admin panel

## Quick Start

1. **Backend**
```bash
cd location-food-booking/backend
copy .env.example .env
# Edit .env: MONGO_URI, JWT_SECRET
npm install
npm run dev  # port 5000
```

2. **Seed DB**
```bash
node backend/db/seed.js
```

3. **Frontend**
```bash
cd ../frontend
npm install
npm start  # port 3000
```

## Usage Flow
1. http://localhost:3000 → Register/Login
2. /dashboard → Allow GPS → See map + stalls (sorted by dist)
3. Click stall marker/card → /book/:id → Pick date/slot → Confirm
4. Backend validates slot free → Success!

## Testing Data
Stalls:
- MVP Punugulu: 17.741, 83.330
- RK Beach Maggi: 17.716, 83.332  
- Siripuram Tiffins: 17.721, 83.315

## MongoDB
Local: `mongod`
Or Atlas free cluster.

## API Endpoints
- POST /api/auth/register | login
- GET /api/stalls/nearby?lat=17.7&lon=83.3
- POST /api/bookings {stallId, slotTime, date}

Enjoy Vizag street food without waiting! 🍢

