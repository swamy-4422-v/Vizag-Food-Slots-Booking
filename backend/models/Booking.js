const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required for a booking'],
    index: true
  },
  stall: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FoodStall', 
    required: [true, 'Stall ID is required for a booking'],
    index: true
  },
  date: { 
    type: String, 
    required: [true, 'Date is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Please use YYYY-MM-DD format'],
    validate: {
      validator: function(v) {
        return new Date(v) >= new Date(new Date().setHours(0,0,0,0));
      },
      message: 'Date cannot be in the past'
    }
  },
  slotTime: { 
    type: String, 
    required: [true, 'Slot time is required'],
    match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
    index: true
  },
  cancellationReason: {
    type: String,
    maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
  },
  cancelledAt: {
    type: Date
  },
  qrCode: {
    type: String
  }
}, { 
  timestamps: true 
});

// Compound index to prevent double booking
bookingSchema.index({ stall: 1, date: 1, slotTime: 1 }, { 
  unique: true,
  partialFilterExpression: { status: { $ne: 'cancelled' } }
});

// Pre-save middleware to generate QR code
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate simple QR code data (you can use a proper QR library)
    this.qrCode = `booking:${this._id}:${this.user}:${this.stall}:${this.date}:${this.slotTime}`;
    
    // Update stall available slots
    const FoodStall = mongoose.model('FoodStall');
    const stall = await FoodStall.findById(this.stall);
    if (stall) {
      await stall.updateAvailableSlots();
    }
  }
  next();
});

// Method to cancel booking
bookingSchema.methods.cancel = async function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  await this.save();
  
  // Update stall available slots
  const FoodStall = mongoose.model('FoodStall');
  const stall = await FoodStall.findById(this.stall);
  if (stall) {
    await stall.updateAvailableSlots();
  }
  
  return this;
};

// Static method to get user bookings with stall details
bookingSchema.statics.getUserBookings = async function(userId) {
  return this.find({ user: userId })
    .populate('stall', 'name address category location openingTime closingTime image rating')
    .sort({ date: -1, slotTime: 1 });
};

module.exports = mongoose.model('Booking', bookingSchema);