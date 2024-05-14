import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Button, Alert, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import { BookingContext } from "../context/BookingContext";
import BookingForm from "./BookingForm";
import axios from "axios";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, getUserById, deleteVehicle } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const { deleteBooking } = useContext(BookingContext);
  const [vehicle, setVehicle] = useState(null);
  const [ownerName, setOwnerName] = useState(null);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { authToken } = useContext(AuthContext); // Get authToken from AuthContext
  const [refreshKey, setRefreshKey] = useState(true);

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
          console.error("Error fetching owner info:", err);
          setError("Failed to fetch owner details");
        });
    } else {
      setError("Vehicle not found");
    }
  }, [id, vehicles, getUserById, refreshKey]);

  const handleDelete = async () => {
    try {
      await deleteVehicle(id);
      navigate("/vehicles");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Failed to delete vehicle");
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
  };

  const handleShowModal = () => {
    setShowBookingModal(true);
  };

  const handleCancelBooking = async () => {
    try {
      const res = await axios.get('https://autoshare-backend.onrender.com/bookings', {
        headers: {
          Authorization: `Bearer ${authToken}` // Include the authToken in the request headers
        }
      });
      
      const bookingList = res.data;
      const booking = bookingList.find(booking => booking.vehicleId._id === id);
      console.log(booking);
      if (booking) {
        const bookingId = booking._id;
        await deleteBooking(bookingId);
        // Update the state or perform any necessary actions after successful cancellation
        navigate("/vehicles"); // Navigate to the VehicleList component after successful cancellation
      } else {
        console.log("Booking Id is not found");
      }
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      // Handle error
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
    <Container key={refreshKey ? "1" : "2"}>
      <h2>{vehicle.name}</h2>
      <img src={vehicle.imageUrl} alt={vehicle.name} width="300" />
      <p>Owner: {ownerName || "Loading..."}</p>
      <p>Category: {vehicle.category}</p>
      <p>Price Per Day(Rs): {vehicle.pricePerDay.toFixed(2)}</p>
      <p>{vehicle.available ? "Available" : "Not Available"}</p>
      {user &&
        (user.role === "host" || user.role === "admin") &&
        user.userId === vehicle.addedBy && (
          <div>
            <Link
              className="btn btn-outline-success"
              to={`/edit-vehicle/${id}`}
            >
              Edit Vehicle
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete Vehicle
            </Button>
          </div>
        )}
      {user && user.userId === vehicle.addedBy && (
        <p>You are the owner of this vehicle.</p>
      )}

      {user && user.userId !== vehicle.addedBy && vehicle.available && (
        <Button variant="primary" onClick={handleShowModal}>
          Book the vehicle
        </Button>
      )}

      {user && user.userId !== vehicle.addedBy && !vehicle.available && (
        <Button variant="danger" onClick={handleCancelBooking}>
          Cancel Booking
        </Button>
      )}

      <Modal show={showBookingModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Book {vehicle.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingForm vehicleId={id} handleCloseModal={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default VehicleDetails;
