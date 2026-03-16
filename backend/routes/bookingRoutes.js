const express = require('express');
const { 
    createBooking, 
    getMyBookings 
} = require('../controllers/bookingController');

const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   /api/bookings
 * @access  Private (All booking routes require login)
 */
router.use(protect);

// POST /api/bookings - Confirm a new slot
router.post('/', createBooking);

// GET /api/bookings/user - Get history for the logged-in foodie
// Note: Changed from '/my' to '/user' to match frontend api.js service
router.get('/user', getMyBookings);

module.exports = router;