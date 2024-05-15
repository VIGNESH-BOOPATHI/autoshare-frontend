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
  const [reviews, setReviews] = useState([]);
  const { authToken } = useContext(AuthContext); // Get authToken from AuthContext

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
         // Fetch reviews for the current vehicle
      axios.get(`https://autoshare-backend.onrender.com/reviews/${id}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setError("Failed to fetch reviews");
      });
    } else {
      setError("Vehicle not found");
    }
  }, [id, vehicles, getUserById]);

  const handleDelete = async () => {
    try {
      await deleteVehicle(id);
      navigate("/");
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

  // const handleCancelBooking = async () => {
  //   try {
  //     const res = await axios.get('https://autoshare-backend.onrender.com/bookings', {
  //       headers: {
  //         Authorization: `Bearer ${authToken}` // Include the authToken in the request headers
  //       }
  //     });
      
  //     const bookingList = res.data;
  //     const booking = bookingList.find(booking => booking.vehicleId._id === id);
  //     console.log(booking);
  //     if (booking) {
  //       const bookingId = booking._id;
  //       await deleteBooking(bookingId);
  //       // Update the state or perform any necessary actions after successful cancellation
  //       navigate("/vehicles"); // Navigate to the VehicleList component after successful cancellation
  //     } else {
  //       console.log("Booking Id is not found");
  //     }
      
  //   } catch (error) {
  //     console.error("Error cancelling booking:", error);
  //     // Handle error
  //   }
  // };

  // Function to generate star icons based on rating
  const renderStars = (rating) => {
    const starCount = Math.round(rating);
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    return stars;
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
    <Container>
      <div className="row">
        <div className="col-md-8">
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
            <p className="booked">The Vehicle is Booked</p>
          )}

{/* <Button variant="danger" onClick={handleCancelBooking}>
              Cancel Booking
            </Button> */}
          <Modal show={showBookingModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Book {vehicle.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <BookingForm vehicleId={id} handleCloseModal={handleCloseModal} />
            </Modal.Body>
          </Modal>
        </div>
        {/* Display Reviews Section */}
        <div className="col-md-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews available</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review._id}>
                  <p>User: {getUserById(review.userId).name}</p>
                  <p>Rating: {renderStars(review.rating)}</p>
                  <p>Comment: {review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
};

export default VehicleDetails;
