import React, { useState, useEffect } from 'react';
import { stallAPI } from '../services/api';
import StallCard from '../components/StallCard';
import MapComponent from '../components/MapComponent';

const FindStalls = () => {
  const [stalls, setStalls] = useState([]);
  const [filteredStalls, setFilteredStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from stalls
  const categories = ['All', ...new Set(stalls.map(s => s.category).filter(Boolean))];

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation not supported. Showing general Vizag stalls.");
        fetchNearbyStalls(17.6868, 83.2185); // Vizag center
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          };
          setUserLocation(coords);
          fetchNearbyStalls(coords.lat, coords.lng);
        },
        (err) => {
          setLocationError("Location access denied. Showing central Vizag stalls.");
          fetchNearbyStalls(17.6868, 83.2185);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    };
    
    getLocation();
  }, []);

  const fetchNearbyStalls = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await stallAPI.getNearby(lat, lon);
      // Handle different response structures
      const stallsData = res.data.stalls || res.data || [];
      setStalls(stallsData);
      setFilteredStalls(stallsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching stalls:", err);
      setError("Failed to fetch stalls. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...stalls];
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(s => s.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(query) || 
        s.address?.toLowerCase().includes(query) ||
        s.category?.toLowerCase().includes(query)
      );
    }
    
    setFilteredStalls(filtered);
  }, [activeCategory, searchQuery, stalls]);

  const handleRefresh = () => {
    if (userLocation) {
      fetchNearbyStalls(userLocation.lat, userLocation.lng);
    } else {
      fetchNearbyStalls(17.6868, 83.2185);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation & Filters */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
              Explore <span className="text-orange-600">Vizag Stalls</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {filteredStalls.length} vendors found
              {userLocation ? ' near you' : ''}
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search stalls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-50 rounded-full hover:bg-orange-50 transition-colors"
            title="Refresh stalls"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* LEFT: STALL LIST */}
        <div className="lg:w-1/2 overflow-y-auto p-6 lg:p-10 bg-[#F8F9FB]">
          {/* Error Messages */}
          {locationError && (
            <div className="mb-6 p-4 bg-yellow-50 text-yellow-600 rounded-2xl text-xs font-bold uppercase tracking-widest text-center border border-yellow-100">
              ⚠️ {locationError}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-[2.5rem]"></div>
              ))}
            </div>
          ) : filteredStalls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStalls.map(stall => (
                <StallCard key={stall._id} stall={stall} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">🌮</span>
              <h3 className="text-xl font-black text-gray-900 uppercase">No stalls found</h3>
              <p className="text-gray-400 font-medium">Try selecting a different category or area.</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-full text-sm font-black uppercase tracking-widest hover:bg-orange-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: MAP VIEW */}
        <div className="lg:w-1/2 h-[400px] lg:h-auto sticky top-20">
          <MapComponent 
            stalls={filteredStalls}
            userLoc={userLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default FindStalls;