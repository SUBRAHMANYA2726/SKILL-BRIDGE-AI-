import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full z-50 glass-dark border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-xl tracking-tight text-white">SkillBridge <span className="text-blue-500">AI</span></span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-blue-400 text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              {isHome && (
                <>
                  <a href="#features" className="hover:text-blue-400 text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
                  <a href="#opportunities" className="hover:text-blue-400 text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Opportunities</a>
                </>
              )}
              {isLoggedIn && (
                <>
                  <Link to="/dashboard" className="hover:text-blue-400 text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                  <Link to="/resources" className="hover:text-blue-400 text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Resources</Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="text-gray-300 hover:text-red-400 px-4 py-2 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-dark border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="hover:text-blue-400 text-gray-300 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/login" className="hover:text-blue-400 text-gray-300 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
            <Link to="/register" className="hover:text-blue-400 text-gray-300 block px-3 py-2 rounded-md text-base font-medium">Register</Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
