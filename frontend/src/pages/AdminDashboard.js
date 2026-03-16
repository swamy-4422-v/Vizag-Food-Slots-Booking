import React, { useState, useEffect } from 'react';
import { stallAPI, bookingAPI } from '../services/api';

const AdminDashboard = () => {
  const [stalls, setStalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalStalls: 0,
    activeBookings: 0,
    totalUsers: 0,
    todayBookings: 0
  });
  const [formData, setFormData] = useState({
    name: '', address: '', lon: '', lat: '', 
    openingTime: '17:00', closingTime: '22:00', 
    category: 'Snacks', description: '', totalSlots: 20
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStalls();
    fetchBookings();
    fetchStats();
  }, []);

  const fetchStalls = async () => {
    try {
      const res = await stallAPI.getAll();
      setStalls(res.data.stalls || res.data || []);
    } catch (err) {
      console.error("Error fetching stalls", err);
      setError("Failed to fetch stalls");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getAllBookings(1, 5);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const fetchStats = async () => {
    try {
      // You might want to create a dedicated stats endpoint
      const stallsRes = await stallAPI.getAll();
      const bookingsRes = await bookingAPI.getAllBookings(1, 1000);
      
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookingsRes.data.bookings?.filter(b => b.date === today).length || 0;
      
      setStats({
        totalStalls: stallsRes.data.stalls?.length || 0,
        activeBookings: bookingsRes.data.total || 0,
        totalUsers: 0, // Add user count if you have an endpoint
        todayBookings
      });
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.address || !formData.lat || !formData.lon) {
      setError("Please fill in all required fields");
      return;
    }

    if (isNaN(formData.lat) || isNaN(formData.lon)) {
      setError("Please provide valid coordinates");
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await stallAPI.create(formData);
      setFormData({ 
        name: '', address: '', lon: '', lat: '', 
        openingTime: '17:00', closingTime: '22:00', 
        category: 'Snacks', description: '', totalSlots: 20
      });
      await fetchStalls();
      await fetchStats();
      setSuccess("Stall added successfully!");
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add stall.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stall? This action cannot be undone.")) {
      return;
    }
    
    try {
      await stallAPI.delete(id);
      await fetchStalls();
      await fetchStats();
      setSuccess("Stall deleted successfully!");
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete stall");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await stallAPI.update(id, { isActive: !currentStatus });
      await fetchStalls();
    } catch (err) {
      setError("Failed to update stall status");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
              System Admin
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
            Control <span className="text-orange-600">Center</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">
            Managing street food infrastructure for the City of Destiny
          </p>
        </header>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100">
            ✅ {success}
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Stalls" value={stats.totalStalls} icon="🏪" />
          <StatCard title="Active Bookings" value={stats.activeBookings} icon="🎟️" />
          <StatCard title="Today's Bookings" value={stats.todayBookings} icon="📅" />
          <StatCard title="Total Users" value={stats.totalUsers || 'N/A'} icon="👥" />
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Add Form */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                Register Vendor
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <AdminInput 
                  label="Stall Name *" 
                  placeholder="e.g. MVP Punugulu Point" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
                
                <AdminInput 
                  label="Street Address *" 
                  placeholder="e.g. Near Double Road Junction" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  required 
                />

                <AdminInput 
                  label="Description" 
                  placeholder="Brief description of the stall" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />

                <div className="grid grid-cols-2 gap-4">
                  <AdminInput 
                    label="Longitude *" 
                    placeholder="83.31" 
                    value={formData.lon} 
                    onChange={(e) => setFormData({...formData, lon: e.target.value})} 
                    required 
                  />
                  <AdminInput 
                    label="Latitude *" 
                    placeholder="17.72" 
                    value={formData.lat} 
                    onChange={(e) => setFormData({...formData, lat: e.target.value})} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AdminInput 
                    label="Opens" 
                    type="time" 
                    value={formData.openingTime} 
                    onChange={(e) => setFormData({...formData, openingTime: e.target.value})} 
                  />
                  <AdminInput 
                    label="Closes" 
                    type="time" 
                    value={formData.closingTime} 
                    onChange={(e) => setFormData({...formData, closingTime: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">
                    Category *
                  </label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl outline-none appearance-none font-bold text-sm text-gray-700 transition-all"
                    required
                  >
                    <option value="Snacks">Snacks</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Tiffins">Tiffins</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Meals">Meals</option>
                    <option value="Chaat">Chaat</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>

                <AdminInput 
                  label="Total Slots" 
                  type="number" 
                  min="1" 
                  max="100"
                  value={formData.totalSlots} 
                  onChange={(e) => setFormData({...formData, totalSlots: parseInt(e.target.value)})} 
                />

                <button 
                  type="submit"
                  disabled={loading} 
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4"
                >
                  {loading ? 'Processing...' : 'Add Stall'}
                </button>
              </form>
            </div>
          </div>

          {/* Stall Inventory */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-tight">Live Inventory</h3>
                <button 
                  onClick={fetchStalls} 
                  className="bg-gray-50 hover:bg-orange-50 text-orange-600 p-2 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Vendor Detail</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">GPS Fix</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Schedule</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stalls.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-20 text-center text-gray-400 font-bold italic">
                          No stalls registered in the Vizag network yet.
                        </td>
                      </tr>
                    ) : (
                      stalls.map(stall => (
                        <tr key={stall._id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="p-6">
                            <div className="font-black text-gray-900 leading-none mb-1">{stall.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              {stall.category} • {stall.address?.substring(0, 30)}...
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md inline-block">
                              {stall.location?.coordinates[0]?.toFixed(3)}°E, {stall.location?.coordinates[1]?.toFixed(3)}°N
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-xs font-black text-gray-600 uppercase">
                              {stall.openingTime} - {stall.closingTime}
                            </span>
                          </td>
                          <td className="p-6">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                              stall.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {stall.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleToggleActive(stall._id, stall.isActive)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                  stall.isActive 
                                    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                                title={stall.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {stall.isActive ? '🔴' : '🟢'}
                              </button>
                              <button 
                                onClick={() => handleDelete(stall._id)}
                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                title="Delete Stall"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="mt-8 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-black uppercase tracking-tight">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">User</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Stall</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date/Time</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-20 text-center text-gray-400 font-bold italic">
                          No recent bookings
                        </td>
                      </tr>
                    ) : (
                      bookings.map(booking => (
                        <tr key={booking._id}>
                          <td className="p-6">
                            <div className="font-bold text-gray-900">{booking.user?.name || 'Unknown'}</div>
                            <div className="text-[10px] text-gray-400">{booking.user?.email}</div>
                          </td>
                          <td className="p-6">
                            <div className="font-bold text-gray-900">{booking.stall?.name}</div>
                          </td>
                          <td className="p-6">
                            <div>{new Date(booking.date).toLocaleDateString()}</div>
                            <div className="text-[10px] text-gray-400">{booking.slotTime}</div>
                          </td>
                          <td className="p-6">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center group hover:border-orange-200 transition-all duration-300">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <p className="text-3xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">{value}</p>
    </div>
    <div className="text-3xl opacity-40 group-hover:opacity-100 transition-all transform group-hover:scale-110">{icon}</div>
  </div>
);

const AdminInput = ({ label, ...props }) => (
  <div className="relative">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">{label}</label>
    <input 
      {...props} 
      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300" 
    />
  </div>
);

export default AdminDashboard;