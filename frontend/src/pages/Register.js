import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '',
    role: 'user' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, user, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    // Validate password strength
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address.");
    }

    // Validate name
    if (formData.name.trim().length < 2) {
      return setError("Name must be at least 2 characters long.");
    }

    setError('');
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...registrationData } = formData;
      const result = await registerUser(registrationData);
      
      if (!result.success) {
        setError(result.error || "Registration failed. Please try again.");
      }
      // No need to navigate - useEffect will handle it
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Account might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center py-12 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-40"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-white rounded-[2rem] shadow-xl shadow-orange-100 mb-6 rotate-3">
            <span className="text-3xl">🌊</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            Join the <span className="text-orange-600">Scene</span>
          </h2>
          <p className="mt-2 text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
            Visakhapatnam Street Food Network
          </p>
        </header>

        <div className="bg-white py-10 px-8 md:px-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[3rem] border border-gray-100">
          {/* Role Toggle */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'user'})} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.role === 'user' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              I'm a Foodie
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'admin'})} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.role === 'admin' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              I'm a Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-wider rounded-2xl border border-red-100 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">
                Full Name
              </label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                required
                placeholder="john@example.com"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">
                Password
              </label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">
                Confirm Password
              </label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>

            <div className="flex items-center px-2">
              <input 
                type="checkbox" 
                id="terms"
                required
                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
              />
              <label htmlFor="terms" className="ml-2 block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                I agree to the Terms of Service
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-50 pt-8">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Already have an account? <br/>
              <Link to="/login" className="text-orange-600 hover:text-gray-900 transition-colors inline-block mt-2 font-black text-sm">
                Log In Here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-10 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] leading-relaxed">
          Securely connecting 500+ daily foodies <br/> to Vizag's finest vendors
        </p>
      </div>
    </div>
  );
};

export default Register;