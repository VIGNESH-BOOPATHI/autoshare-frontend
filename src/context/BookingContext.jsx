import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Assuming AuthContext is exported from 'AuthContext'

const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const { authToken } = useContext(AuthContext); // Get authToken from AuthContext

   

  const createBooking = async (bookingData) => {
    try {
      const response = await axios.post('https://autoshare-backend.onrender.com/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${authToken}` // Include the authToken in the request headers
        }
      });
      setBookings([...bookings, response.data.booking]);
      return response.data.booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const updateBooking = async (bookingId, bookingData) => {
    try {
      await axios.put(`https://autoshare-backend.onrender.com/bookings/${bookingId}`, bookingData, {
        headers: {
          Authorization: `Bearer ${authToken}` // Include the authToken in the request headers
        }
      });
      const updatedBookings = bookings.map((booking) =>
        booking._id === bookingId ? { ...booking, ...bookingData } : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await axios.delete(`https://autoshare-backend.onrender.com/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${authToken}` // Include the authToken in the request headers
        }
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export { BookingContext, BookingProvider };
