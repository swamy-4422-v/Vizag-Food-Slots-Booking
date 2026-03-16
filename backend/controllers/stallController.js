const FoodStall = require('../models/FoodStall');
const Booking = require('../models/Booking');

// @desc    Get stalls within 10km radius
// @route   GET /api/stalls/nearby
// @access  Public
exports.getNearbyStalls = async (req, res) => {
  const { lat, lon, maxDistance = 10000 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ 
      success: false,
      message: "Please provide latitude and longitude" 
    });
  }

  try {
    const stalls = await FoodStall.aggregate([
      {
        $geoNear: {
          near: { 
            type: "Point", 
            coordinates: [parseFloat(lon), parseFloat(lat)] 
          },
          distanceField: "distance",
          maxDistance: parseInt(maxDistance),
          spherical: true,
          distanceMultiplier: 0.001 // Convert meters to km
        }
      },
      {
        $match: { isActive: true }
      },
      {
        $sort: { distance: 1 }
      }
    ]);

    // Update available slots for each stall
    for (let stall of stalls) {
      const today = new Date().toISOString().split('T')[0];
      const bookedCount = await Booking.countDocuments({
        stall: stall._id,
        date: today,
        status: { $in: ['confirmed', 'pending'] }
      });
      stall.availableSlots = Math.max(0, stall.totalSlots - bookedCount);
    }

    res.status(200).json({
      success: true,
      count: stalls.length,
      stalls
    });
  } catch (err) {
    console.error("GeoNear Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error searching for stalls" 
    });
  }
};

// @desc    Add a new stall
// @route   POST /api/stalls
// @access  Private/Admin
exports.createStall = async (req, res) => {
  try {
    const { 
      name, 
      address, 
      lon, 
      lat, 
      openingTime, 
      closingTime,
      category,
      description,
      totalSlots,
      image
    } = req.body;

    // Validate required fields
    const requiredFields = { name, address, lon, lat, category };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate coordinates
    const longitude = parseFloat(lon);
    const latitude = parseFloat(lat);
    
    if (isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid coordinates. Please provide valid numbers.' 
      });
    }

    // Create stall
    const stall = await FoodStall.create({
      name,
      address,
      description,
      category,
      openingTime: openingTime || '17:00',
      closingTime: closingTime || '22:00',
      totalSlots: totalSlots || 20,
      availableSlots: totalSlots || 20,
      image: image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500',
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    res.status(201).json({
      success: true,
      message: 'Stall created successfully',
      stall
    });
  } catch (err) {
    console.error("Create Stall Error:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: err.message || 'Error creating stall'
    });
  }
};

// @desc    Get all stalls
// @route   GET /api/stalls
// @access  Public
exports.getAllStalls = async (req, res) => {
  try {
    const { category, isActive, limit = 50 } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const stalls = await FoodStall.find(query)
      .limit(parseInt(limit))
      .sort({ rating: -1, name: 1 });

    // Update available slots
    const today = new Date().toISOString().split('T')[0];
    for (let stall of stalls) {
      const bookedCount = await Booking.countDocuments({
        stall: stall._id,
        date: today,
        status: { $in: ['confirmed', 'pending'] }
      });
      stall.availableSlots = Math.max(0, stall.totalSlots - bookedCount);
    }

    res.status(200).json({
      success: true,
      count: stalls.length,
      stalls
    });
  } catch (err) {
    console.error("Get All Stalls Error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Get single stall by ID
// @route   GET /api/stalls/:id
// @access  Public
exports.getStallById = async (req, res) => {
  try {
    const stall = await FoodStall.findById(req.params.id);
    
    if (!stall) {
      return res.status(404).json({ 
        success: false,
        message: 'Stall not found' 
      });
    }

    // Update available slots
    const today = new Date().toISOString().split('T')[0];
    const bookedCount = await Booking.countDocuments({
      stall: stall._id,
      date: today,
      status: { $in: ['confirmed', 'pending'] }
    });
    stall.availableSlots = Math.max(0, stall.totalSlots - bookedCount);

    res.status(200).json({
      success: true,
      stall
    });
  } catch (err) {
    console.error("Get Stall By ID Error:", err);
    
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid stall ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update stall
// @route   PUT /api/stalls/:id
// @access  Private/Admin
exports.updateStall = async (req, res) => {
  try {
    const stall = await FoodStall.findById(req.params.id);
    
    if (!stall) {
      return res.status(404).json({ 
        success: false,
        message: 'Stall not found' 
      });
    }

    // Update fields
    const allowedUpdates = [
      'name', 'address', 'category', 'description', 'image',
      'openingTime', 'closingTime', 'totalSlots', 'rating', 'isActive'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        stall[field] = req.body[field];
      }
    });

    // Update location if provided
    if (req.body.lon && req.body.lat) {
      stall.location = {
        type: "Point",
        coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)]
      };
    }

    await stall.save();

    res.status(200).json({
      success: true,
      message: 'Stall updated successfully',
      stall
    });
  } catch (err) {
    console.error("Update Stall Error:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Delete stall
// @route   DELETE /api/stalls/:id
// @access  Private/Admin
exports.deleteStall = async (req, res) => {
  try {
    const stall = await FoodStall.findById(req.params.id);
    
    if (!stall) {
      return res.status(404).json({ 
        success: false,
        message: 'Stall not found' 
      });
    }

    // Check if there are any active bookings for this stall
    const activeBookings = await Booking.countDocuments({
      stall: stall._id,
      date: { $gte: new Date().toISOString().split('T')[0] },
      status: { $in: ['confirmed', 'pending'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete stall with active bookings. Deactivate it instead.' 
      });
    }

    // Soft delete by setting isActive to false
    stall.isActive = false;
    await stall.save();

    // Alternatively, for hard delete:
    // await stall.remove();

    res.status(200).json({ 
      success: true,
      message: 'Stall deleted successfully' 
    });
  } catch (err) {
    console.error("Delete Stall Error:", err);
    
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid stall ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Search stalls by text
// @route   GET /api/stalls/search
// @access  Public
exports.searchStalls = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide search query' 
      });
    }

    const stalls = await FoodStall.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(20);

    res.status(200).json({
      success: true,
      count: stalls.length,
      stalls
    });
  } catch (err) {
    console.error("Search Stalls Error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};