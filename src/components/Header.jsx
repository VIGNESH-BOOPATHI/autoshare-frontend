import React, { useState } from 'react'; // Import useState to manage navbar state
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styling

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State to track navbar status

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen); // Toggle the navbar's open/closed state
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">AutoShare</Link>
        
        {/* Navbar toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar} // Toggle the navbar when clicked
          aria-controls="navbarNav"
          aria-expanded={isNavbarOpen} // True if the navbar is open
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span> {/* Icon for the navbar */}
        </button>
        
        {/* Navbar content */}
        <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarNav"> 
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/page/about">About Us</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/page/contact">Contact Us</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/page/privacy-policy">Privacy Policy</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/page/terms-conditions">Terms & Conditions</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/page/cancellation-refund">Cancellation/Refund Policies</Link></li>
          </ul>
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-success" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
