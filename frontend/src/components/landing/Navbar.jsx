import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch('${import.meta.env.VITE_API_URL || ''}/api/users/notifications', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            setNotifications(await res.json());
          }
        } catch (error) {
          console.error('Error fetching notifications');
        }
      };
      fetchNotifications();
    }
  }, [isLoggedIn]);

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
          
          <div className="hidden md:flex gap-4 items-center relative">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-20 mt-2 w-80 glass-dark border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-white/10">
                        <h3 className="text-white font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(n => (
                            <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-blue-900/20' : ''}`}>
                              <p className="text-sm text-gray-200">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-gray-400">No new notifications</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
              </>
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
