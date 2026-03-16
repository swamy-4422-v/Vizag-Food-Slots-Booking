import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Navigating to home and forcing a reload to clear all states across the app
    navigate('/');
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-12 px-6 relative overflow-hidden">
      {/* Decorative background element to match Home/Register style */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-gray-900">
              Your <span className="text-orange-600">Profile</span>
            </h1>
            <p className="mt-2 text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              Vizag Street Food Network Identity
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            Logout Session 🚪
          </button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: USER CARD --- */}
          <div className="md:col-span-1">
            <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 text-center sticky top-8">
              <div className="inline-block p-6 bg-orange-50 rounded-[2rem] shadow-sm mb-6 rotate-3 border border-orange-100">
                <span className="text-5xl">
                  {user.role === 'admin' ? '👨‍🍳' : '🍕'}
                </span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">
                {user.name}
              </h3>
              <p className="mt-2 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] bg-orange-50 inline-block px-3 py-1 rounded-full">
                {user.role === 'admin' ? 'Vendor Partner' : 'Elite Foodie'}
              </p>
              
              <div className="mt-10 pt-8 border-t border-gray-50 text-left space-y-6">
                <div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Email Address</p>
                  <p className="text-sm font-bold text-gray-700 break-words">{user.email}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Account Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-sm font-bold text-gray-700">Verified Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: ACTIVITY --- */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 min-h-[500px]">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-xl font-black uppercase tracking-tighter text-gray-900">Recent Slot History</h4>
                <div className="w-12 h-1 bg-orange-100 rounded-full"></div>
              </div>

              <div className="space-y-4">
                {/* Manual examples for UI preview */}
                <BookingRow stall="MVP Punugulu Center" time="06:30 PM" date="Today" status="Confirmed" />
                <BookingRow stall="RK Beach Maggi Point" time="08:15 PM" date="14 Mar 2026" status="Completed" />
                <BookingRow stall="Siripuram Egg Bundu" time="07:00 PM" date="12 Mar 2026" status="Completed" />
                
                {/* Empty State Message */}
                <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-[2rem]">
                  <p className="text-gray-300 font-black text-[10px] uppercase tracking-[0.3em]">
                    End of recent activity
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <p className="text-center mt-12 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
          VizagFoodSlots Secure Profile Environment
        </p>
      </div>
    </div>
  );
};

// Reusable UI Component for Booking Rows
const BookingRow = ({ stall, time, date, status }) => (
  <div className="flex items-center justify-between p-6 bg-[#FDFCFB] rounded-[2rem] border border-gray-50 hover:border-orange-200 hover:bg-white transition-all group cursor-pointer shadow-sm hover:shadow-md">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform duration-300">
        📍
      </div>
      <div>
        <h5 className="font-black text-sm uppercase tracking-tight text-gray-900">{stall}</h5>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
          {date} <span className="mx-1 text-gray-200">•</span> {time}
        </p>
      </div>
    </div>
    <div className="text-right">
      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
        status === 'Confirmed' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export default Profile;