import React from 'react';
import { Link } from 'react-router-dom';

const StallCard = ({ stall }) => {
  // Use actual data from backend with fallbacks
  const imageUrl = stall.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500';
  const rating = stall.rating || 4.5;
  const availableSlots = stall.availableSlots !== undefined ? stall.availableSlots : stall.totalSlots || 20;
  const locationName = stall.locationName || stall.address?.split(',')[0] || 'Vizag';
  
  // Logic to show "Filling Fast" if slots are low
  const isFillingFast = availableSlots < 5;

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(255,100,0,0.1)]">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl}
          alt={stall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500';
          }}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-black text-gray-900">⭐ {rating.toFixed(1)}</span>
        </div>
        {isFillingFast && (
          <div className="absolute bottom-4 left-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg animate-pulse">
            Filling Fast 🔥
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">
              {stall.name}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {locationName}
            </p>
          </div>
          <span className="text-2xl">
            {stall.category === 'Snacks' && '🍿'}
            {stall.category === 'Fast Food' && '🍔'}
            {stall.category === 'Tiffins' && '🍛'}
            {stall.category === 'Beverages' && '☕'}
            {stall.category === 'Meals' && '🍱'}
            {stall.category === 'Chaat' && '🥘'}
            {stall.category === 'Chinese' && '🥡'}
            {!stall.category && '🍲'}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>🕒 {stall.openingTime} - {stall.closingTime}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Slots</p>
            <p className="text-xl font-black text-gray-900">
              {availableSlots} <span className="text-xs text-gray-400">left</span>
            </p>
          </div>
          <Link 
            to={`/book/${stall._id}`}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-colors"
          >
            Book Slot
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StallCard;