import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define a new context for data operations
const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]); // Cache vehicles data
  const [users, setUsers] = useState({}); // Cache user data by user ID

  useEffect(() => {
    // Fetch vehicles once when the context is created
    axios
      .get('https://autoshare-backend.onrender.com/vehicles')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setVehicles(response.data);
        } else {
          console.error('Invalid response format for vehicles');
        }
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
      });
  }, []); // Only run this effect once when the component is mounted

  // Function to get a user by ID
  const getUserById = (userId) => {
    if (users[userId]) {
      return Promise.resolve(users[userId]); // Return cached data if available
    }

    // Otherwise, fetch from the server
    return axios
      .get(`https://autoshare-backend.onrender.com/users/${userId}`)
      .then((response) => {
        setUsers((prevUsers) => ({
          ...prevUsers,
          [userId]: response.data, // Cache the fetched user data
        }));
        return response.data;
      })
      .catch((error) => {
        console.error('Error fetching user by ID:', error);
        throw error;
      });
  };

  return (
    <DataContext.Provider value={{ vehicles, getUserById }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };