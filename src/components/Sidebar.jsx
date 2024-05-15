import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons

const Sidebar = () => {
  const { user, authToken } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "https://autoshare-backend.onrender.com/bookings",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the authToken in the request headers
            },
          }
        );
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user, authToken]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
      </button>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/"><h4>Home</h4></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/vehicles"><h4>Vehicles</h4></Link>
        </li>
      </ul>
      <div className="sidebar-content">
        <h4 onClick={() => setDropdownOpen(!dropdownOpen)}>Your Bookings</h4>
        {dropdownOpen && (
          <ul className="list-unstyled">
            {loading ? (
              <p>Loading...</p>
            ) : (
              bookings.map((booking) => (
                <li key={booking._id}>
                  <Link to={`/booking/${booking._id}`} className="text-decoration-none">
                    {booking._id}
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
