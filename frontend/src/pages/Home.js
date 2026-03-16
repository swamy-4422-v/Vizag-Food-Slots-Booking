import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeUsers, setActiveUsers] = useState(124);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100">
      {/* --- HERO SECTION --- */}
      <header className="relative py-16 md:py-32 bg-[#FDFCFB] overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] md:text-xs font-black tracking-[0.2em] text-orange-600 uppercase bg-orange-50 border border-orange-100 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
            </span>
            {activeUsers} Foodies Online in Vizag
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
            Wait Less. <br />
            <span className="text-orange-600">Eat More.</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            The smartest way to enjoy Vizag street food. Reserve your slot at RK Beach, MVP, or Siripuram and skip the humid queues.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            {/* FIXED: Changed /Dashboard to /dashboard */}
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-12 py-5 text-lg font-black text-white bg-gray-900 rounded-[2rem] shadow-2xl shadow-gray-200 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest"
            >
              Explore Stalls 📍
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-12 py-5 text-lg font-black text-gray-900 bg-white border-2 border-gray-100 rounded-[2rem] hover:border-orange-200 hover:bg-orange-50 transition-all uppercase tracking-widest"
            >
              Join the Scene
            </Link>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 translate-x-1/4 translate-y-1/4"></div>
      </header>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                Three Steps to <br /><span className="text-orange-600">Foodie Heaven</span>
              </h2>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.3em]">Revolutionizing Street Food Culture</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureItem step="01" icon="🔍" title="Discover" desc="Browse verified stalls around you. Filter by category—from spicy Punugulu to beachside Maggi." />
            <FeatureItem step="02" icon="🎟️" title="Reserve" desc="Pick a 30-minute time slot. Our algorithm prevents overcrowding, so you get fresh food faster." />
            <FeatureItem step="03" icon="✨" title="Enjoy" desc="Show your digital QR token at the counter. No waiting, no hassle, just authentic Vizag taste." />
          </div>
        </div>
      </section>

      {/* --- LIVE STATUS PREVIEW --- */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl bg-gray-900 rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-tight">Empowering <br />Local Vendors</h2>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg font-medium">We're helping stalls at Siripuram, Jagadamba, and Gajuwaka digitize their operations.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 shadow-2xl">
              <div className="space-y-4">
                <LiveRow name="MVP Punugulu Center" status="Available" color="text-green-400" />
                <LiveRow name="Beach Road Maggi" status="8 Slots Left" color="text-orange-400" />
                {/* FIXED: Changed /dashboard to lowercase */}
                <Link to="/dashboard" className="block text-center mt-10 py-4 bg-white text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                  View Real-time Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sub-components
const FeatureItem = ({ step, icon, title, desc }) => (
  <div className="group flex flex-col p-12 bg-[#FBFBFB] rounded-[3.5rem] border border-transparent hover:border-orange-100 hover:bg-white transition-all duration-500">
    <div className="flex justify-between items-start mb-8">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-50">{icon}</div>
      <span className="text-4xl font-black text-gray-100 group-hover:text-orange-50">{step}</span>
    </div>
    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium text-sm">{desc}</p>
  </div>
);

const LiveRow = ({ name, status, color }) => (
  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
    <span className="font-bold text-sm tracking-tight">{name}</span>
    <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{status}</span>
  </div>
);

export default Home;