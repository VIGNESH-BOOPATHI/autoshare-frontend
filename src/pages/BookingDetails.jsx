import React, { useEffect, useContext, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BookingContext } from "../context/BookingContext";

const BookingDetails = () => {
    const { id } = useParams();
    const { authToken, user } = useContext(AuthContext); // Access the user from AuthContext
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);
    const { deleteBooking } = useContext(BookingContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://autoshare-backend.onrender.com/bookings/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                setBookingDetails(response.data);
            } catch (error) {
                console.error("Error fetching booking details:", error);
                setError("Failed to fetch booking details");
            }
        };

        fetchData();

    }, [id, authToken]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!bookingDetails) {
        return <div>Loading booking details...</div>;
    }

    const handleCancelBooking = async () => {
        try{
            await deleteBooking(id);
            navigate("/vehicles");
        }catch (error){
            console.error("Error cancelling booking:", error);
             // Handle error
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
                                Category: {bookingDetails.vehicleId.category}<br />
                                Price Per Day(Rs): {bookingDetails.vehicleId.pricePerDay.toFixed(2)}<br />
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
                                Booking ID: {bookingDetails._id}<br />
                                Booked At: {new Date(bookingDetails.bookedAt).toLocaleString()}<br />
                                Duration: {bookingDetails.duration} day(s)<br />
                                Completed: {bookingDetails.completed ? "Yes" : "No"}<br />
                                End Time: {new Date(bookingDetails.endTime).toLocaleString()}
                            </Card.Text>
                            {user && user.userId === bookingDetails.userId && !bookingDetails.vehicleId.available && (
                                <Button variant="danger" onClick={handleCancelBooking}>Cancel Booking</Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BookingDetails;
