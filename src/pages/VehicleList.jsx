import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { DataContext } from '../context/DataContext';

const VehicleList = () => {
  const { vehicles, getUserById } = useContext(DataContext); // Get data from context
  const [ownerNames, setOwnerNames] = useState({}); // Cache owner names
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    vehicles.forEach((vehicle) => {
      const ownerId = vehicle.addedBy;
      if (!ownerNames[ownerId]) {
        getUserById(ownerId)
          .then((user) => {
            setOwnerNames((prev) => ({
              ...prev,
              [ownerId]: user.name,
            }));
          })
          .catch((err) => {
            console.error('Error fetching owner name:', err);
            setError('Failed to fetch owner names');
          });
      }
    });
  }, [vehicles, getUserById]); // Run this effect when vehicles or getUserById changes

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
                    Owner: {ownerNames[vehicle.addedBy] || 'Loading...'} <br />
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
