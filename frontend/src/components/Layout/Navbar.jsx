import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✈️ AirlineReserve
        </Link>

        <ul className="nav-menu">
          <li><Link to="/">Flights</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
            </>
          )}
          <li><Link to="/blockchain">Blockchain</Link></li>
        </ul>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
