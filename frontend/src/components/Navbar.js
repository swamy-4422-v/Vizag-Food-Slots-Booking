import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ];

    if (!user) return baseLinks;

    if (user.role === 'admin') {
      return [
        ...baseLinks,
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Admin Panel', path: '/admin' },
        { name: 'Manage Stalls', path: '/admin/stalls' },
      ];
    }

    return [
      ...baseLinks,
      { name: 'Find Food 📍', path: '/find-stalls' },
      { name: 'My Passes', path: '/bookings' },
      { name: 'Dashboard', path: '/dashboard' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`fixed w-full z-[1000] transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group relative">
            <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🌊</span>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-gray-900 leading-none">
                VIZAG<span className="text-orange-600">SLOTS</span>
              </span>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">skip the queue</span>
            </div>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-auto mr-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-3 lg:px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl relative group ${
                  location.pathname === link.path 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-orange-50 rounded-full pl-1 pr-3 py-1 transition-all group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md group-hover:shadow-lg transition-all">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] font-black text-gray-400 uppercase">{user.role}</p>
                      <p className="text-xs font-black text-gray-900 leading-none">{user.name?.split(' ')[0]}</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-black text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="text-xl">👤</span>
                        <div>
                          <p className="font-black text-sm">My Profile</p>
                          <p className="text-[8px] text-gray-400">View and edit profile</p>
                        </div>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="text-xl">📊</span>
                        <div>
                          <p className="font-black text-sm">Dashboard</p>
                          <p className="text-[8px] text-gray-400">Your activity overview</p>
                        </div>
                      </Link>
                      <Link
                        to="/bookings"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="text-xl">🎫</span>
                        <div>
                          <p className="font-black text-sm">My Passes</p>
                          <p className="text-[8px] text-gray-400">View your bookings</p>
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="text-xl">🚪</span>
                        <div>
                          <p className="font-black text-sm">Logout</p>
                          <p className="text-[8px] text-gray-400">End your session</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-[11px] font-black text-gray-500 hover:text-orange-600 px-4 py-2 uppercase tracking-widest transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-[11px] hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 uppercase tracking-widest flex items-center gap-2 group"
                >
                  <span className="group-hover:rotate-12 transition-transform">✨</span>
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* User Profile Section (Mobile) */}
            {user && (
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-4 border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{user.name}</p>
                    <p className="text-[10px] text-gray-400">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[8px] font-black uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="bg-gray-50 rounded-2xl p-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === link.path 
                      ? 'bg-orange-600 text-white' 
                      : 'text-gray-900 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">
                    {link.name.includes('Home') && '🏠'}
                    {link.name.includes('About') && 'ℹ️'}
                    {link.name.includes('Find') && '📍'}
                    {link.name.includes('Passes') && '🎫'}
                    {link.name.includes('Dashboard') && '📊'}
                    {link.name.includes('Admin') && '⚙️'}
                    {link.name.includes('Manage') && '🏪'}
                  </span>
                  <span className="font-black text-sm">{link.name}</span>
                  {location.pathname === link.path && (
                    <span className="ml-auto text-white">✓</span>
                  )}
                </Link>
              ))}
            </div>
            
            {/* Mobile Auth Section */}
            <div className="bg-gray-50 rounded-2xl p-4">
              {user ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/profile"
                      className="flex items-center justify-center gap-2 bg-white text-gray-900 p-4 rounded-xl font-black text-xs hover:bg-orange-50 hover:text-orange-600 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>👤</span>
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }} 
                      className="flex items-center justify-center gap-2 bg-red-500 text-white p-4 rounded-xl font-black text-xs hover:bg-red-600 transition-all"
                    >
                      <span>🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center gap-2 bg-white text-gray-900 p-4 rounded-xl font-black text-sm hover:bg-orange-50 hover:text-orange-600 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>🔐</span>
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center gap-2 bg-orange-600 text-white p-4 rounded-xl font-black text-sm hover:bg-orange-700 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>✨</span>
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Social Links */}
            <div className="flex justify-center gap-4 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl hover:bg-orange-100 hover:text-orange-600 hover:scale-110 transition-all"
              >
                📸
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl hover:bg-orange-100 hover:text-orange-600 hover:scale-110 transition-all"
              >
                🐦
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl hover:bg-orange-100 hover:text-orange-600 hover:scale-110 transition-all"
              >
                📘
              </a>
            </div>

            {/* Mobile App Version */}
            <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-widest pt-2">
              Vizag Food Slots v2.0
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;