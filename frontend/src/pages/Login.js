import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setError(result.error || "Invalid email or password. Please try again.");
      }
      // No need to navigate - useEffect will handle it
      
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-orange-200 rotate-12 transform hover:rotate-6 transition-transform duration-300">
            🍕
          </div>
        </div>
        <h2 className="text-center text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
          Welcome <span className="text-orange-600">Back</span>
        </h2>
        <p className="mt-3 text-center text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">
          The City of Destiny is Hungry
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 md:px-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[3rem] border border-gray-50 backdrop-blur-sm bg-white/90">
          
          {/* Quick Demo Credentials (remove in production) */}
          <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded-xl">
                <p className="font-bold text-gray-700">User</p>
                <p className="text-gray-400">user@demo.com</p>
                <p className="text-gray-400">password123</p>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <p className="font-bold text-gray-700">Admin</p>
                <p className="text-gray-400">admin@demo.com</p>
                <p className="text-gray-400">admin123</p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[11px] rounded-2xl border border-red-100 font-black uppercase tracking-wider animate-shake flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-[1.5rem] outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                  placeholder="rahul@vizag.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-[1.5rem] outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 text-xs font-bold transition-colors"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center">
                <input 
                  id="remember-me"
                  name="remember-me"
                  type="checkbox" 
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Remember Me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-black rounded-[1.5rem] shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm mt-6 group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AUTHORIZING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                  <span>🔐</span>
                  SECURE LOGIN
                  <span>→</span>
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-100 pt-8">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              New to Vizag Food Slots?
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 mt-4 px-8 py-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-sm hover:bg-orange-100 transition-all group"
            >
              <span>✨</span>
              <span>CREATE FREE ACCOUNT</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Social Login Options (Optional) */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="flex justify-center items-center py-3 px-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
              </button>
              <button className="flex justify-center items-center py-3 px-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                <span className="text-xl group-hover:scale-110 transition-transform">🔄</span>
              </button>
              <button className="flex justify-center items-center py-3 px-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                <span className="text-xl group-hover:scale-110 transition-transform">📧</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-sm">🔒</span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">256-bit Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 text-sm">🛡️</span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Privacy Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-sm">⚡</span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Instant Access</span>
          </div>
        </div>

        <p className="text-center mt-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] leading-relaxed">
          © 2024 Vizag Food Slots. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;