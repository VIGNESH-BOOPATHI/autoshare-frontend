import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { BookingContext } from "../context/BookingContext";
import ReviewFormModal from "./ReviewFormModal";

const BookingDetails = () => {
  const { id } = useParams();
  const { authToken, user } = useContext(AuthContext);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const { deleteBooking } = useContext(BookingContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://autoshare-backend.onrender.com/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Failed to fetch booking details");
      }
    };

    fetchData();
  }, [id, authToken]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://autoshare-backend.onrender.com/reviews/${bookingDetails.vehicleId._id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const reviews = response.data;
        const reviewed = reviews.some((review) => review.bookingId === id);
        setHasReviewed(reviewed);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (bookingDetails) {
      fetchReviews();
    }
  }, [bookingDetails, id, authToken]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bookingDetails) {
    return <div>Loading booking details...</div>;
  }

  const handleCancelBooking = async () => {
    try {
      await deleteBooking(id);
      navigate("/");
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleAddReview = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await axios.post(
        "https://autoshare-backend.onrender.com/reviews/",
        {
          bookingId: id,
          vehicleId: bookingDetails.vehicleId._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setHasReviewed(true); // Update the state to reflect that the user has reviewed
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <Container>
      <h2 className="mt-4">Booking Details</h2>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={bookingDetails.vehicleId.imageUrl} />
            <Card.Body>
              <Card.Title>{bookingDetails.vehicleId.name}</Card.Title>
              <Card.Text>
                Category: {bookingDetails.vehicleId.category}
                <br />
                Price Per Day(Rs):{" "}
                {bookingDetails.vehicleId.pricePerDay.toFixed(2)}
                <br />
                Available: {bookingDetails.vehicleId.available ? "Yes" : "No"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Booking Information</Card.Title>
              <Card.Text>
                Booking ID: {bookingDetails._id}
                <br />
                Booked At: {new Date(bookingDetails.bookedAt).toLocaleString()}
                <br />
                Duration: {bookingDetails.duration} day(s)
                <br />
                Completed: {bookingDetails.completed ? "Yes" : "No"}
                <br />
                End Time: {new Date(bookingDetails.endTime).toLocaleString()}
              </Card.Text>
              {user &&
                user.userId === bookingDetails.userId &&
                !bookingDetails.vehicleId.available && (
                  <Button variant="danger" onClick={handleCancelBooking}>
                    Cancel Booking
                  </Button>
                )}
            </Card.Body>
          </Card>
          
          {user && !hasReviewed && (
            <Button variant="primary" onClick={handleAddReview}>
              Add Review
            </Button>
          )}
        </Col>
      </Row>
      <ReviewFormModal
        show={showReviewModal}
        handleClose={handleCloseReviewModal}
        submitReview={handleSubmitReview}
      />
    </Container>
  );
};

export default BookingDetails;
