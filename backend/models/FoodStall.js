const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Stall name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    trim: true 
  },
  category: {
    type: String,
    enum: {
      values: ['Snacks', 'Fast Food', 'Tiffins', 'Beverages', 'Meals', 'Chaat', 'Chinese'],
      message: '{VALUE} is not a valid category'
    },
    default: 'Snacks',
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500'
  },
  // GeoJSON format for location
  location: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    // Note: MongoDB uses [Longitude, Latitude] order
    coordinates: { 
      type: [Number], 
      required: [true, 'Coordinates [Lon, Lat] are required'],
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // Longitude range
                 v[1] >= -90 && v[1] <= 90;     // Latitude range
        },
        message: 'Invalid coordinates. Longitude must be between -180/180 and Latitude -90/90.'
      }
    }
  },
  openingTime: { 
    type: String, 
    default: "17:00",
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  closingTime: { 
    type: String, 
    default: "22:00",
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  rating: { 
    type: Number, 
    default: 4.5,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalSlots: {
    type: Number,
    default: 20,
    min: [1, 'Must have at least 1 slot']
  },
  availableSlots: {
    type: Number,
    default: 20,
    min: [0, 'Available slots cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index for geospatial queries
stallSchema.index({ location: '2dsphere' });

// Index for text search
stallSchema.index({ name: 'text', address: 'text', category: 'text' });

// Virtual for location name (if needed)
stallSchema.virtual('locationName').get(function() {
  const areas = ['RK Beach', 'MVP Colony', 'Siripuram', 'Gajuwaka', 'Rushikonda'];
  for (let area of areas) {
    if (this.address.includes(area)) return area;
  }
  return 'Vizag';
});

// Method to update available slots
stallSchema.methods.updateAvailableSlots = async function() {
  const Booking = mongoose.model('Booking');
  const today = new Date().toISOString().split('T')[0];
  
  const bookedCount = await Booking.countDocuments({
    stall: this._id,
    date: today,
    status: { $in: ['confirmed', 'pending'] }
  });
  
  this.availableSlots = Math.max(0, this.totalSlots - bookedCount);
  await this.save();
  return this.availableSlots;
};

module.exports = mongoose.model('FoodStall', stallSchema);