import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { FaSync } from 'react-icons/fa'; // Importing the refresh icon
import AuthContext from '../context/AuthContext';

// Images used in the carousel
import image1 from './photos/lance-asper-50cIn5ELxLo-unsplash.jpg';
import image2 from './photos/pixel-blast-Nynx8Z9Y-mQ-unsplash.jpg';
import image3 from './photos/william-daigneault-WPNm2A_lAQo-unsplash.jpg';

const Home = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Display alert message with OK button
    alert('Click the reload icon, whenever Home is shown');
  }, []);

  const handleReload = () => {
    window.location.reload(); // Reload the website
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome to AutoShare</h1>
        <div onClick={handleReload} style={{ cursor: 'pointer' }}>
          <FaSync size={20} />
        </div>
      </div>
      <p>Rent vehicles of all types quickly and easily.</p>

      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={image1} alt="First slide" />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Discover our latest vehicles.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={image2} alt="Second slide" />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Experience top-notch quality.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={image3} alt="Third slide" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Book now and enjoy amazing offers!</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {user ? (
        <Link to="/vehicles" className="btn btn-primary">
          View Vehicles
        </Link>
      ) : (
        <Link to="/login" className="btn btn-primary">
          View Vehicles
        </Link>
      )}
    </div>
  );
};

export default Home;
