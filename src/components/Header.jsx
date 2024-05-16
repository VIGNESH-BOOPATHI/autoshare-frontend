import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // AuthContext for authentication state

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navigate = useNavigate(); // Navigation to switch routes


  // useEffect(() => {
  //   // Display alert message with OK button
  //   alert('Click the reload icon, whenever Home is shown');
  // }, []);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleRoleClick = () => {
    if (user.role !== "admin") {
      navigate("/toggle-role"); // Navigate to the role toggle component
    }
  };


  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          AutoShare
        </Link>

        {/* Navbar toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isNavbarOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div
          className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/page/about">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/page/contact">
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/page/privacy-policy">
                Privacy Policy
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/page/terms-conditions">
                Terms & Conditions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/page/cancellation-refund">
                Cancellation/Refund Policies
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hello, {user.name}</span>{" "}
                  {/* Display user name */}
                </li>
                {user.role !== "admin" && (
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleRoleClick}
                    >
                      Role: {user.role.toUpperCase()}{" "}
                      {/* Display current role */}
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-success" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;



