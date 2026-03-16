import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stallAPI, bookingAPI } from '../services/api';

const BookingPage = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Generate time slots based on stall timing
  const availableSlots = useMemo(() => {
    if (!stall) return [];
    
    const slots = [];
    const openHour = parseInt(stall.openingTime.split(':')[0]);
    const openMinute = parseInt(stall.openingTime.split(':')[1] || 0);
    const closeHour = parseInt(stall.closingTime.split(':')[0]);
    const closeMinute = parseInt(stall.closingTime.split(':')[1] || 0);
    
    let currentHour = openHour;
    let currentMinute = openMinute;
    
    // Generate 30-minute slots
    while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
      const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Add 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute -= 60;
      }
      
      const endTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Only add if end time is within closing time
      if (currentHour < closeHour || (currentHour === closeHour && currentMinute <= closeMinute)) {
        slots.push({
          display: `${startTime} - ${endTime}`,
          startTime: startTime,
          endTime: endTime
        });
      }
    }
    
    return slots;
  }, [stall]);

  useEffect(() => {
    const fetchStallDetails = async () => {
      try {
        setLoading(true);
        const res = await stallAPI.getById(stallId);
        setStall(res.data.stall || res.data);
        setError('');
      } catch (err) {
        console.error("Error fetching stall", err);
        setError(err.response?.data?.message || "Stall not found!");
        setTimeout(() => navigate('/find-stalls'), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchStallDetails();
  }, [stallId, navigate]);

  const handleBooking = async () => {
    // Check if user is logged in
    if (!user) {
      alert("Please login to book a slot!");
      return navigate('/login');
    }

    if (!selectedSlot) {
      setError("Please select a time slot!");
      return;
    }
    
    setBookingLoading(true);
    setError('');
    
    try {
      // Find the selected slot object
      const slot = availableSlots.find(s => s.display === selectedSlot);
      
      const bookingData = {
        stallId,
        slotTime: slot.startTime, // Send only the start time
        date: selectedDate
      };
      
      const response = await bookingAPI.create(bookingData);
      
      if (response.data.success) {
        navigate('/bookings'); // Redirect to bookings list
      } else {
        setError(response.data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Booking failed. The slot might be full.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading stall details...</p>
        </div>
      </div>
    );
  }

  if (error && !stall) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-400">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-orange-600 transition-all uppercase tracking-[0.2em]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Map
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Stall Hero Section */}
          <div className="bg-gray-900 p-10 md:p-14 text-white relative">
            <div className="relative z-10">
              <span className="bg-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                {stall?.category || 'Street Food'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tighter leading-tight">{stall?.name}</h1>
              <p className="text-gray-400 flex items-center gap-2 text-sm font-medium">
                <span className="text-orange-500">📍</span> {stall?.address}
              </p>
              {stall?.rating && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-bold">{stall.rating}</span>
                  <span className="text-gray-500 text-sm">• {stall.availableSlots || stall.totalSlots} slots available</span>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          <div className="p-8 md:p-14">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Date Selection */}
            <div className="mb-10">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">
                Choose Date
              </label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 7 days ahead
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-1/2 p-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none font-bold text-gray-700 transition-all"
              />
            </div>

            <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-gray-900">
              Select <span className="text-orange-600">Time Window</span>
            </h3>

            {/* Dynamic Slot Grid */}
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-12">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    onClick={() => setSelectedSlot(slot.display)}
                    className={`group py-5 px-4 rounded-[1.5rem] font-black text-xs transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                      selectedSlot === slot.display 
                        ? 'border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-200 scale-95' 
                        : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-orange-200 hover:bg-white'
                    }`}
                  >
                    <span className={selectedSlot === slot.display ? 'text-white' : 'text-gray-400 group-hover:text-orange-600'}>
                      🕒
                    </span>
                    {slot.display}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-3xl mb-12">
                <p className="text-gray-500">No time slots available for this stall today.</p>
              </div>
            )}

            {/* Booking Summary Box */}
            <div className="bg-orange-50 rounded-[2rem] p-8 mb-10 border border-orange-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-orange-800 font-black text-lg">Wait-Free Guarantee</p>
                <p className="text-orange-600/70 text-xs font-bold uppercase tracking-widest">
                  {selectedSlot ? `Your slot: ${selectedSlot}` : 'Please pick a slot above'}
                </p>
              </div>
              <div className="text-center md:text-right">
                <span className="text-xs text-orange-800 font-bold block uppercase opacity-50">Booking Fee</span>
                <span className="text-2xl font-black text-orange-900">₹0.00</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              disabled={!selectedSlot || bookingLoading}
              onClick={handleBooking}
              className="w-full py-6 bg-gray-900 text-white rounded-[2.2rem] font-black text-xl hover:bg-orange-600 transition-all shadow-2xl shadow-gray-200 disabled:opacity-30 disabled:grayscale uppercase tracking-tighter"
            >
              {bookingLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Securing your spot...
                </span>
              ) : 'Reserve Food Pass'}
            </button>
            
            <p className="text-center mt-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] leading-loose px-6">
              Arrive at the stall within your window. <br />
              Digital pass will be generated instantly upon confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;