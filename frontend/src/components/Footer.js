import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Hardcoded for 2026 project timeline or dynamic
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🌊</span>
              <span className="font-black text-xl uppercase tracking-tighter">
                Vizag<span className="text-orange-500">Slots</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The official slot-booking platform for the street food scene in the City of Destiny. From RK Beach to MVP Colony.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon="📸" label="Instagram" url="https://instagram.com/vizagslots" />
              <SocialIcon icon="🐦" label="Twitter" url="https://twitter.com/vizagslots" />
              <SocialIcon icon="📘" label="Facebook" url="https://facebook.com/vizagslots" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-orange-500 mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li><Link to="/find-stalls" className="hover:text-orange-500 transition-colors">Find Food</Link></li>
              <li><Link to="/bookings" className="hover:text-orange-500 transition-colors">My Bookings</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">Our Story</Link></li>
              <li><Link to="/register" className="hover:text-orange-500 transition-colors">Join as Vendor</Link></li>
            </ul>
          </div>

          {/* Vizag Locations */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-orange-500 mb-6">Hotspots</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                <span className="text-gray-500 text-xs">📍</span> RK Beach Road
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                <span className="text-gray-500 text-xs">📍</span> MVP Double Road
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                <span className="text-gray-500 text-xs">📍</span> Siripuram Junction
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                <span className="text-gray-500 text-xs">📍</span> Gajuwaka Main Road
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-orange-500 mb-6">Support</h4>
            <a href="mailto:vizagslots@gmail.com" className="block text-sm font-bold text-gray-300 mb-2 hover:text-orange-500 transition-colors">
              hello@vizagslots.in
            </a>
            <p className="text-sm font-bold text-gray-300">+91 766 093 692</p>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Vizag Tech Park, <br />
              Rushikonda, Visakhapatnam, <br />
              Andhra Pradesh 530045
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            © {currentYear} Vizag Food Slots. Made with ❤️ in Vizag.
          </p>
          <div className="flex gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, label, url }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-orange-600 hover:-translate-y-1 transition-all text-lg" 
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
