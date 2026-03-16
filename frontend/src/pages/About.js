import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-orange-50/50 to-white -z-10"></div>
      
      {/* Floating Decorative Orbs */}
      <div className="absolute top-20 right-[-5%] w-72 h-72 md:w-96 md:h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-40 left-[-5%] w-72 h-72 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce-slow"></div>

      <div className="container mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-orange-100 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-orange-600 font-black text-[10px] tracking-[0.2em] uppercase">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
            Digitalizing the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Vizag Street Food</span> Scene
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
            From the bustling lines at <strong>RK Beach</strong> to the morning tiffins in <strong>MVP Colony</strong>, 
            we're ensuring you spend more time eating and less time waiting in the humidity.
          </p>
        </div>

        {/* --- FEATURE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <AboutCard 
            icon="📍" 
            title="Discovery" 
            desc="Our smart GPS system finds verified street food vendors within 10km of your location in the City of Destiny."
            accent="orange"
          />
          <AboutCard 
            icon="🕒" 
            title="Precision" 
            desc="Pick a 30-minute window. Arrive at the stall, show your digital token, and grab your food instantly."
            accent="gray"
          />
          <AboutCard 
            icon="🤝" 
            title="Vendor Growth" 
            desc="We empower local Vizag vendors with data tools to manage crowds and scale their business digitally."
            accent="orange"
          />
        </div>

        {/* --- MISSION STATEMENT SECTION --- */}
        <div className="bg-gray-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-orange-900/20">
          {/* Subtle Wave Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 md:gap-16">
            <div className="lg:w-3/5">
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-orange-500 uppercase tracking-tighter">Why we started?</h3>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-6 font-light">
                Street food is the soul of Visakhapatnam, but unpredictability and long queues often deter people from enjoying it. 
              </p>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-bold">
                Our platform bridges the gap, making the street food experience <span className="text-orange-500">Smart, Social, and Seamless.</span>
              </p>
            </div>
            
            <div className="lg:w-2/5 grid grid-cols-2 gap-4 w-full">
              <StatBox count="100%" label="Vizag Built" />
              <StatBox count="Zero" label="Wait Policy" />
              <StatBox count="50+" label="Verified Stalls" />
              <StatBox count="24/7" label="Cloud Support" />
            </div>
          </div>
        </div>

        {/* --- CTA SECTION --- */}
        <div className="text-center mt-24">
          <button 
            onClick={() => navigate('/find-stalls')}
            className="group relative bg-orange-600 text-white px-10 md:px-16 py-5 md:py-6 rounded-2xl font-black text-xl md:text-2xl hover:bg-gray-900 transition-all shadow-xl hover:shadow-orange-200 hover:-translate-y-1 active:scale-95 uppercase tracking-tighter"
          >
            Start Exploring Now 🍕
          </button>
          <p className="mt-8 text-gray-400 font-bold tracking-[0.3em] text-[10px] uppercase flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-gray-200"></span>
            Born in the City of Destiny
            <span className="w-8 h-[1px] bg-gray-200"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

const AboutCard = ({ icon, title, desc, accent }) => (
  <div className="group bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-gray-50 hover:border-orange-200 transition-all duration-500 hover:shadow-orange-100/50">
    <div className={`w-16 h-16 md:w-20 md:h-20 ${accent === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-700'} rounded-2xl md:rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl mb-8 group-hover:rotate-12 transition-transform duration-500`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
      {desc}
    </p>
  </div>
);

const StatBox = ({ count, label }) => (
  <div className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 text-center hover:bg-white/10 transition-colors">
    <div className="text-2xl md:text-3xl font-black text-orange-500 mb-1">{count}</div>
    <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{label}</div>
  </div>
);

export default About;