import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { bookingAPI } from '../services/api';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getUserBookings();
      // Handle different response structures
      const bookingsData = res.data.bookings || res.data || [];
      setBookings(bookingsData);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this food pass? This will free up the slot for someone else.")) {
      return;
    }
    
    setCancellingId(id);
    try {
      await bookingAPI.cancelBooking(id);
      // Refresh list after successful cancellation
      await fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel pass. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="font-black text-xs text-gray-400 uppercase tracking-widest">Retrieving Passes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest">Active Wallet</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              My <span className="text-orange-600">Passes</span>
            </h1>
            <p className="text-gray-500 font-medium">Show these tokens at the vendor stall</p>
          </div>
        </header>

        {bookings.length > 0 ? (
          <div className="grid gap-8">
            {bookings.map((booking) => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onCancel={() => handleCancel(booking._id)}
                isCancelling={cancellingId === booking._id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3.5rem] p-12 md:p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
              🎫
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">No Active Reservations</h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
              Your wallet is empty. Explore the best street food in Vizag and reserve your spot!
            </p>
            <Link 
              to="/find-stalls" 
              className="inline-block bg-gray-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all hover:-translate-y-1 active:scale-95"
            >
              Find Food Near Me
            </Link>
          </div>
        )}

        <p className="text-center mt-12 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Powered by Vizag Tech Park Cloud
        </p>
      </div>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ booking, onCancel, isCancelling }) => {
  // Check if booking is for today/future
  const bookingDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = bookingDate < today;
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';
  
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-600',
    confirmed: 'bg-green-100 text-green-600',
    cancelled: 'bg-gray-100 text-gray-600',
    completed: 'bg-blue-100 text-blue-600'
  }[booking.status] || 'bg-gray-100 text-gray-600';

  // Get stall details from populated stall field
  const stall = booking.stall || {};

  return (
    <div className={`relative flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl ${
      isPast || isCancelled || isCompleted ? 'opacity-60 grayscale' : ''
    }`}>
      
      {/* Left Section: Info */}
      <div className="flex-1 p-8 md:p-10 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-gray-50 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
              {booking.status}
            </span>
            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">
              ID: {booking._id.slice(-6)}
            </span>
          </div>
          {booking.status === 'confirmed' && !isPast && (
            <button 
              onClick={onCancel}
              disabled={isCancelling}
              className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isCancelling ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          {stall.name || "Vizag Vendor"}
        </h2>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-8">
          <span className="text-orange-600">📍</span> {stall.address || "Visakhapatnam"}
        </div>

        <div className="flex gap-10 flex-wrap">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
            <p className="text-lg font-black text-gray-800">
              {new Date(booking.date).toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
            <p className="text-lg font-black text-orange-600 tracking-tight">{booking.slotTime}</p>
          </div>
          {booking.cancelledAt && (
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Cancelled</p>
              <p className="text-sm font-black text-gray-500">
                {new Date(booking.cancelledAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Notches for Ticket Effect */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F8F9FB] rounded-full hidden md:block"></div>
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F8F9FB] rounded-full hidden md:block"></div>
      </div>

      {/* Right Section: QR Code */}
      <div className={`p-8 md:w-64 bg-gray-50 flex flex-col items-center justify-center text-center ${
        isPast || isCancelled || isCompleted ? 'bg-gray-100' : ''
      }`}>
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
          <QRCode 
            value={booking.qrCode || `booking:${booking._id}`} 
            size={100} 
            level="H"
            fgColor={isPast || isCancelled || isCompleted ? "#9CA3AF" : "#111827"}
          />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-tight">
          {booking.status === 'cancelled' ? 'Pass Cancelled' :
           booking.status === 'completed' ? 'Pass Used' :
           isPast ? 'Pass Expired' : 'Scan at Stall'}
        </p>
      </div>
    </div>
  );
};

export default Booking;