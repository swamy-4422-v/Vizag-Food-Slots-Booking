import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ activePasses: 0, loading: true });

  // Get time-based greeting for that Vizag hospitality
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await bookingAPI.getMyBookings();
        // Filter only future/today's bookings for the "Active" count
        const activeCount = res.data.filter(b => 
          new Date(b.date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)
        ).length;
        
        setStats({ activePasses: activeCount, loading: false });
      } catch (err) {
        console.error("Error loading dashboard stats");
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Top Banner Decoration */}
      <div className="h-32 bg-orange-600 w-full absolute top-0 left-0 -z-10 opacity-5 md:h-48"></div>

      <div className="max-w-7xl mx-auto pt-12 px-6">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-orange-100 rounded-full mb-4 shadow-sm">
              <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live in Visakhapatnam</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              {getGreeting()}, <br/>
              <span className="text-orange-600">{user?.name?.split(' ')[0] || 'Foodie'}!</span>
            </h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">User Dashboard v2.6</p>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Action Card */}
          <div className="md:col-span-2 bg-gray-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-orange-900/20 group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase leading-[0.9] tracking-tighter">
                  Hungry? <br/>
                  <span className="text-orange-500">Discover Stalls</span> <br/>
                  Near RK Beach
                </h2>
                <p className="text-gray-400 font-medium max-w-sm mb-10 leading-relaxed">
                  Real-time slot availability for the best Punugulu, Maggi, and Muri Mixture in the city.
                </p>
              </div>
              <Link 
                to="/find-stalls" 
                className="inline-flex items-center justify-center bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-300 w-fit group-hover:shadow-lg group-hover:shadow-orange-500/30"
              >
                Find Food Near Me 📍
              </Link>
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute right-[-10%] bottom-[-10%] text-[240px] opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
              🍲
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-xl shadow-gray-200/50 flex flex-col justify-between min-h-[280px] hover:border-orange-200 transition-all">
              <div>
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
                  🎫
                </div>
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">My Active Passes</h3>
                {stats.loading ? (
                  <div className="h-16 w-16 bg-gray-100 animate-pulse rounded-lg"></div>
                ) : (
                  <p className="text-7xl font-black text-gray-900 tracking-tighter">{stats.activePasses}</p>
                )}
              </div>
              <Link 
                to="/bookings" 
                className="group flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest mt-6"
              >
                Manage Bookings 
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>

            {/* Weather/Quick Tip Card */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200/40">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">🌊</span>
                <span className="bg-blue-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Vizag Vibes</span>
              </div>
              <p className="font-bold text-sm leading-snug">
                "It's a perfect evening for Muri Mixture by the beach. Don't forget to show your digital pass!"
              </p>
            </div>
          </div>
        </div>

        {/* --- QUICK LINKS --- */}
        <div className="mt-16">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 text-center md:text-left">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickLink to="/profile" icon="👤" label="Profile" />
            <QuickLink to="/history" icon="🕒" label="History" />
            <QuickLink to="/favorites" icon="❤️" label="Saved" />
            <QuickLink to="/about" icon="ℹ️" label="Help" />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ to, icon, label }) => (
  <Link to={to} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-orange-500 transition-all hover:-translate-y-1 shadow-sm">
    <span className="text-2xl mb-2">{icon}</span>
    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{label}</span>
  </Link>
);

export default Dashboard;