import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">AutoShare</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
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
