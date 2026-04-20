import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-effect border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-accent-cyan flex items-center justify-center font-bold text-dark-900 group-hover:shadow-lg group-hover:shadow-gold-500/50 transition-all">
              ✈
            </div>
            <span className="text-xl font-bold font-playfair hidden sm:inline gradient-text">
              JetAirline
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/flights"
              className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gold-500/10 text-white/80 hover:text-gold-500"
            >
              Flights
            </Link>
            <Link
              to="/blockchain"
              className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-accent-cyan/10 text-white/80 hover:text-accent-cyan"
            >
              Blockchain
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/bookings"
                  className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-accent-purple/10 text-white/80 hover:text-accent-purple"
                >
                  My Bookings
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gold-500/10 text-white/80 hover:text-gold-500"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg glass-effect border border-white/20 flex items-center justify-center text-white/80 hover:text-gold-500 hover:border-gold-500 transition-all duration-300"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.464 7.464a1 1 0 001.414-1.414L6.171 5.05a1 1 0 00-1.414 1.414l.707.707zm0 9.172a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg text-white/80 border border-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-semibold hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-white/60 hidden lg:inline">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg glass-effect"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-white/10">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-gold-500 transition-all"
            >
              {isDark ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.464 7.464a1 1 0 001.414-1.414L6.171 5.05a1 1 0 00-1.414 1.414l.707.707zm0 9.172a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <Link
              to="/flights"
              className="block px-4 py-2 rounded-lg hover:bg-gold-500/10"
              onClick={() => setMenuOpen(false)}
            >
              Flights
            </Link>
            <Link
              to="/blockchain"
              className="block px-4 py-2 rounded-lg hover:bg-accent-cyan/10"
              onClick={() => setMenuOpen(false)}
            >
              Blockchain
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/bookings"
                  className="block px-4 py-2 rounded-lg hover:bg-accent-purple/10"
                  onClick={() => setMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 rounded-lg hover:bg-gold-500/10"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-lg hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg bg-red-500/20 text-red-400"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
