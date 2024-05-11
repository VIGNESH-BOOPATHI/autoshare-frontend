import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

const VehicleDetails = () => {
  const { id } = useParams(); // Get the vehicle ID from the URL parameters
  const { vehicles, getUserById } = useContext(DataContext); // Get data and functions from context
  const { user } = useContext(AuthContext); // Access user role
  const [vehicle, setVehicle] = useState(null); // Vehicle details state
  const [ownerName, setOwnerName] = useState(null); // Owner's name
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const vehicleDetails = vehicles.find((v) => v._id === id); // Find the vehicle in the context data
    if (vehicleDetails) {
      setVehicle(vehicleDetails);

      const ownerId = vehicleDetails.addedBy;
      getUserById(ownerId)
        .then((user) => {
          setOwnerName(user.name); // Set the owner's name
        })
        .catch((err) => {
          console.error('Error fetching owner info:', err);
          setError('Failed to fetch owner details');
        });
    } else {
      setError('Vehicle not found');
    }
  }, [id, vehicles, getUserById]); // Only run this effect when ID or vehicles data changes

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
      <p>Owner: {ownerName || 'Loading...'}</p>{/* Display owner name */}
      <p>Category: {vehicle.category}</p>
      <p>Price Per Day: ${vehicle.pricePerDay.toFixed(2)}</p>
      <p>{vehicle.available ? 'Available' : 'Not Available'}</p>

      {user && (user.role === 'host' || user.role === 'admin') && (
        <div>
          <Button variant="warning">Edit Vehicle</Button> {/* Edit vehicle */}
          <Button variant="danger">Delete Vehicle</Button> {/* Delete vehicle */}
        </div>
      )}
    </Container>
  );
};

export default VehicleDetails;
