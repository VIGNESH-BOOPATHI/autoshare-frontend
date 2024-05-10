import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap'; // Bootstrap components for styling

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null); // To capture errors

  useEffect(() => {
    axios
      .get('https://autoshare-backend.onrender.com/vehicles') // Fetch vehicles from the backend
      .then((response) => {
        if (Array.isArray(response.data)) { // Ensure response is an array
          setVehicles(response.data);
        } else {
          setError('Invalid response format'); // Handle unexpected response
        }
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', err);
        setError('Error fetching vehicles'); // Capture the error
      });
  }, []);

  if (error) {
    return (
      <Container>
        <p>{error}</p> {/* Display the error message */}
      </Container>
    );
  }

  return (
    <Container>
      <h2>Available Vehicles</h2>
      <Row>
        {vehicles.length === 0 ? ( // Check if the array is empty
          <p>No vehicles available</p> // Message if no vehicles
        ) : (
          vehicles.map((vehicle) => (
            <Col key={vehicle._id} md={4} className="mb-3">
              <Card>
                <Card.Img variant="top" src={vehicle.imageUrl} alt={vehicle.name} />
                <Card.Body>
                  <Card.Title>{vehicle.name}</Card.Title>
                  <Card.Text>
                    Category: {vehicle.category} <br />
                    Price Per Day: ${vehicle.pricePerDay.toFixed(2)}
                  </Card.Text>
                  <Link to={`/vehicles/${vehicle._id}`}>
                    <Button variant="primary">View Details</Button> {/* Link to view details */}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default VehicleList;
