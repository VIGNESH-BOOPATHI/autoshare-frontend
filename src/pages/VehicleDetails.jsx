import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const VehicleDetails = () => {
  const { id } = useParams(); // Get the vehicle ID from the URL parameters
  const [vehicle, setVehicle] = useState(null); // Vehicle details state
  const [error, setError] = useState(null); // Error state
  const { user } = useContext(AuthContext); // Access user role

  useEffect(() => {
    // Fetch the vehicle details by ID
    axios
      .get(`https://autoshare-backend.onrender.com/vehicles/${id}`)
      .then((response) => {
        setVehicle(response.data);
      })
      .catch((error) => {
        console.error('Error fetching vehicle by ID:', error);
        setError('Failed to fetch vehicle details'); // Display an error message
      });
  }, [id]); // Only run this effect when the ID changes

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert> {/* Display error */}
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container>
        <p>Loading vehicle details...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h2>{vehicle.name}</h2>
      <img src={vehicle.imageUrl} alt={vehicle.name} width="300" />
      <p>Category: {vehicle.category}</p>
      <p>Price Per Day: ${vehicle.pricePerDay.toFixed(2)}</p>
      <p>{vehicle.available ? 'Available' : 'Not Available'}</p>

      {user && (user.role === 'host' || user.role === 'admin') && ( // Only allow hosts and admins to update or delete
        <div>
          <Button variant="warning">Edit Vehicle</Button> {/* Link to edit vehicle */}
          <Button variant="danger">Delete Vehicle</Button> {/* Button to delete vehicle */}
        </div>
      )}
    </Container>
  );
};

export default VehicleDetails;