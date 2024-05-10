import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [owners, setOwners] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://autoshare-backend.onrender.com/vehicles')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setVehicles(response.data);

          // Fetch the owner details
          response.data.forEach((vehicle) => {
            const ownerId = vehicle.addedBy;
            if (!owners[ownerId]) {
              axios
                .get(`https://autoshare-backend.onrender.com/users/${ownerId}`)
                .then((res) => {
                  setOwners((prevOwners) => ({
                    ...prevOwners,
                    [ownerId]: res.data.name,
                  }));
                })
                .catch((err) => {
                  console.error('Error fetching owner info:', err);
                });
            }
          });
        } else {
          setError('Invalid response format');
        }
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
        setError('Error fetching vehicles');
      });
  }, []);

  if (error) {
    return (
      <Container>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <h2>Available Vehicles</h2>
      <Row>
        {vehicles.length === 0 ? (
          <p>No vehicles available</p>
        ) : (
          vehicles.map((vehicle) => (
            <Col key={vehicle._id} md={4} className="mb-3">
              <Card>
                <Card.Img variant="top" src={vehicle.imageUrl} alt={vehicle.name} />
                <Card.Body>
                  <Card.Title>{vehicle.name}</Card.Title>
                  <Card.Text>
                    Owner: {owners[vehicle.addedBy] || 'Loading...'} <br />
                    Category: {vehicle.category} <br />
                    Price Per Day: ${vehicle.pricePerDay.toFixed(2)}
                  </Card.Text>
                  <Link to={`/vehicles/${vehicle._id}`}>
                    <Button variant="primary">View Details</Button>
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
