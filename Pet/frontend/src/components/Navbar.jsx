import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Pill,
  FileUp,
  Sparkles,
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Calendar,
  Package,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Navbar({ onOpenCart, cartCount = 0, onOpenAuth }) {
  const { user, firstName, userRole, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAvatarDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/consultation', label: 'Doctor Consult', icon: Stethoscope },
    { to: '/pharmacy', label: 'Pharmacy & Store', icon: Pill },
    { to: '/upload-rx', label: 'Upload Rx', icon: FileUp },
    { to: '/symptom-triage', label: 'AI Triage', icon: Sparkles, badge: 'AI' },
    { to: '/dashboard', label: 'Dashboard', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Jamshedpur City Indicator */}
          <Link to="/" className="flex items-center gap-3 group text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 font-['Outfit']">
                  PawCare<span className="text-teal-700">India</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold uppercase tracking-wider">
                  JSR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600" />
                <span>Bistupur Hub • Jamshedpur</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-teal-600'}`} />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Greeting, Cart, Auth / Avatar Dropdown, Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            
            {/* Cart Trigger */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors border border-teal-200 cursor-pointer"
              title="Open Medicine Cart"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-teal-700" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Dynamic Personalized Greeting */}
                <div className="hidden sm:block text-right pr-1">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                    Welcome back, <span className="text-teal-700">{firstName}</span>! 👋
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {userRole === 'VETERINARIAN'
                      ? 'Veterinarian Portal'
                      : userRole === 'PHARMACY_ADMIN'
                      ? 'Pharmacy Retail Hub'
                      : 'Pet Guardian (Bistupur)'}
                  </span>
                </div>

                {/* User Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-expanded={isAvatarDropdownOpen}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs ring-2 ring-teal-500/20">
                      {firstName.substring(0, 2).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isAvatarDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 py-3 text-left z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{user?.full_name || `${firstName} Sharma`}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email || 'pooja@example.com'}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                            {userRole.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsAvatarDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                          >
                            <User className="w-4 h-4 text-teal-600" />
                            <span>Pet Owner Dashboard</span>
                          </Link>
                          <Link
                            to="/consultation"
                            onClick={() => setIsAvatarDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-teal-600" />
                            <span>Book Telehealth Visit</span>
                          </Link>
                          <Link
                            to="/upload-rx"
                            onClick={() => setIsAvatarDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                          >
                            <FileUp className="w-4 h-4 text-teal-600" />
                            <span>Upload Prescription</span>
                          </Link>
                          <Link
                            to="/vet-portal"
                            onClick={() => setIsAvatarDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-cyan-700 transition-colors"
                          >
                            <Stethoscope className="w-4 h-4 text-cyan-600" />
                            <span>Dr. Anjali Vet Portal</span>
                          </Link>
                          <Link
                            to="/pharmacy-admin"
                            onClick={() => setIsAvatarDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                          >
                            <Package className="w-4 h-4 text-emerald-600" />
                            <span>Pharmacy Admin Portal</span>
                          </Link>
                        </div>

                        <div className="pt-2 border-t border-slate-100 px-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAvatarDropdownOpen(false);
                              logout();
                              navigate('/');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Unauthenticated State: Prominent Log In and Sign Up buttons */
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('login') : navigate('/auth')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-teal-800 hover:text-teal-900 hover:bg-teal-50 border border-teal-200 transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('register') : navigate('/auth')}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 shadow-md shadow-teal-700/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl overflow-hidden text-left"
          >
            <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200/60 mb-2">
              <span className="text-xs font-extrabold text-slate-900 block">
                Welcome back, {firstName}!
              </span>
              <span className="text-[11px] text-teal-800">
                PawCare 24/7 Jamshedpur Emergency: +91 657 242 1100
              </span>
            </div>

            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors ${
                    isActive ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/vet-portal"
                className="flex-1 text-center py-2.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold"
              >
                Vet Doctor Portal
              </Link>
              <Link
                to="/pharmacy-admin"
                className="flex-1 text-center py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
              >
                Pharmacy Hub
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
