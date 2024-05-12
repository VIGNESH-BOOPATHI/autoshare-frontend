import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use navigate hook for navigation
  const { vehicles, getUserById, deleteVehicle } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [vehicle, setVehicle] = useState(null);
  const [ownerName, setOwnerName] = useState(null);
  const [error, setError] = useState(null);
  const[refreshKey, getRefreshKey] = useState(true);

  useEffect(() => {
    const vehicleDetails = vehicles.find((v) => v._id === id);
    if (vehicleDetails) {
      setVehicle(vehicleDetails);
      const ownerId = vehicleDetails.addedBy;
      getUserById(ownerId)
        .then((user) => {
          setOwnerName(user.name);
        })
        .catch((err) => {
          console.error('Error fetching owner info:', err);
          setError('Failed to fetch owner details');
        });
    } else {
      setError('Vehicle not found');
    }
  }, [id, vehicles, getUserById, refreshKey]);

  const handleDelete = async () => {
    try {
      await deleteVehicle(id);
      // Navigate to vehicle list component after successful deletion
      navigate('/vehicles');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setError('Failed to delete vehicle');
    }
  };

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
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
    <Container key={refreshKey ? '1' : '2'}>
      <h2>{vehicle.name}</h2>
      <img src={vehicle.imageUrl} alt={vehicle.name} width="300" />
      <p>Owner: {ownerName || 'Loading...'}</p>{/* Display owner name */}
      <p>Category: {vehicle.category}</p>
      <p>Price Per Day: ${vehicle.pricePerDay.toFixed(2)}</p>
      <p>{vehicle.available ? 'Available' : 'Not Available'}</p>
      {user && (user.role === 'host' || user.role === 'admin') && (
        <div>
          <Link className="btn btn-outline-success" to={`/edit-vehicle/${id}`}>
            Edit Vehicle
          </Link>
          <Button variant="danger" onClick={handleDelete}>Delete Vehicle</Button>
        </div>
      )}
    </Container>
  );
};

export default VehicleDetails;
