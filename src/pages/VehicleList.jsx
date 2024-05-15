import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { Formik, Field } from "formik";
import "../App.css";

const VehicleList = () => {
  const { vehicles, getUserById } = useContext(DataContext);
  const [ownerNames, setOwnerNames] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false); // State for showing/hiding filter modal

  useEffect(() => {
    setFilteredVehicles(vehicles);
  }, [vehicles]);

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
            if (error.response && error.response.status === 404) {
              // Do something to handle the 404 Not Found error, or simply ignore it
              console.error("Resource not found.");
          } else {
              // Handle other errors
              console.error("Error fetching booking details:", error);
              setError("Failed to fetch booking details");
          }
          });
      }
    });
  }, [vehicles, getUserById]);

  const applyFilters = (values) => {
    let filtered = [...vehicles];

    if (values.searchQuery) {
      const query = values.searchQuery.toLowerCase();
      filtered = filtered.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(query)
      );
    }

    if (values.minPrice) {
      filtered = filtered.filter(
        (vehicle) => vehicle.pricePerDay >= parseInt(values.minPrice)
      );
    }

    if (values.maxPrice) {
      filtered = filtered.filter(
        (vehicle) => vehicle.pricePerDay <= parseInt(values.maxPrice)
      );
    }

    if (values.sortBy) {
      const [field, order] = values.sortBy.split(":");
      filtered.sort((a, b) => {
        if (order === "asc") {
          return a[field] - b[field];
        } else {
          return b[field] - a[field];
        }
      });
    }

    setFilteredVehicles(filtered);
    setShowFilterModal(false); // Close the modal after applying filters
  };

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
      {user && (user.role === "host" || user.role === "admin") && (
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => navigate("/manage-vehicles")}
        >
          Add Vehicle
        </Button>
      )}
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowFilterModal(true)}
      >
        Open Filter
      </Button>
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Vehicles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              sortBy: "name:asc",
              minPrice: "",
              maxPrice: "",
              searchQuery: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              applyFilters(values);
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={3}>
                    <Field as="select" name="sortBy" className="form-control">
                      <option value="name:asc">Name: A-Z</option>
                      <option value="name:desc">Name: Z-A</option>
                      <option value="pricePerDay:asc">
                        Price: Low to High
                      </option>
                      <option value="pricePerDay:desc">
                        Price: High to Low
                      </option>
                    </Field>
                  </Col>
                  <Col md={3}>
                    <Field
                      type="number"
                      placeholder="Min Price"
                      name="minPrice"
                      className="form-control"
                    />
                  </Col>
                  <Col md={3}>
                    <Field
                      type="number"
                      placeholder="Max Price"
                      name="maxPrice"
                      className="form-control"
                    />
                  </Col>
                  <Col md={3}>
                    <Field
                      type="text"
                      placeholder="Search by Name"
                      name="searchQuery"
                      className="form-control"
                    />
                  </Col>
                </Row>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  Apply Filters
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <Row>
        {filteredVehicles.length === 0 ? (
          <p>No vehicles available</p>
        ) : (
          filteredVehicles.map((vehicle) => (
            <Col key={vehicle._id} md={4} className="mb-3">
              <Card className="vehicle-card">
                {user && user.userId === vehicle.addedBy && (
                  <span className="owned-badge">Owned</span>
                )}
                {!vehicle.available && (
            <span className="unavailable-badge">Not Available</span>
          )}

                <Card.Img
                  className="card-img"
                  variant="top"
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                />
                <Card.Body>
                  <Card.Title>{vehicle.name}</Card.Title>
                  <Card.Text>
                    Owner: {ownerNames[vehicle.addedBy] || "Loading..."} <br />
                    Category: {vehicle.category} <br />
                    Price Per Day(Rs): {vehicle.pricePerDay.toFixed(2)}
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
