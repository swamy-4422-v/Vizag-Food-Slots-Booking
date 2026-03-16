const Booking = require('../models/Booking');
const FoodStall = require('../models/FoodStall');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { stallId, date, slotTime } = req.body;

    // Validate required fields
    if (!stallId || !date || !slotTime) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide stallId, date, and slotTime' 
      });
    }

    // Verify stall exists and is active
    const stall = await FoodStall.findById(stallId);
    if (!stall) {
      return res.status(404).json({ 
        success: false,
        message: 'Food stall not found' 
      });
    }

    if (!stall.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'This stall is currently inactive' 
      });
    }

    // Check if stall has available slots
    await stall.updateAvailableSlots();
    if (stall.availableSlots <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No slots available for today' 
      });
    }

    // Create the booking
    const newBooking = new Booking({
      user: req.user.id,
      stall: stallId,
      date,
      slotTime,
      status: 'confirmed'
    });

    await newBooking.save();

    // Populate stall details for response
    await newBooking.populate('stall', 'name address category location openingTime closingTime image rating');

    res.status(201).json({ 
      success: true,
      message: 'Booking confirmed!', 
      booking: newBooking 
    });

  } catch (err) {
    // Handle MongoDB Duplicate Key Error
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'This slot is already booked. Please choose another time.' 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }

    console.error("Booking Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during booking' 
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.getUserBookings(req.user.id);
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    console.error("Fetch Bookings Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching your booking history' 
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('stall')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this booking' 
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (err) {
    console.error("Fetch Booking Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching booking' 
    });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to cancel this booking' 
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false,
        message: 'Booking is already cancelled' 
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel completed booking' 
      });
    }

    // Check if booking date is in the past
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel past bookings' 
      });
    }

    // Cancel the booking
    await booking.cancel(reason || 'Cancelled by user');

    res.status(200).json({ 
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (err) {
    console.error("Cancel Booking Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error cancelling booking' 
    });
  }
};

// @desc    Update booking status (admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status' 
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ 
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });

  } catch (err) {
    console.error("Update Booking Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating booking' 
    });
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (date) query.date = date;

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('stall', 'name address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      bookings
    });

  } catch (err) {
    console.error("Fetch All Bookings Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching bookings' 
    });
  }
};