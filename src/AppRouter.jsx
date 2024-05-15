import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import ToggleRole from './pages/ToggleRole';
import Page from './components/Page';
import VehicleList from './pages/VehicleList'; // New import for the vehicle listing
import VehicleDetails from './pages/VehicleDetails'; // New import for viewing a specific vehicle
import VehicleManagement from './pages/VehicleManagement'; // New import for vehicle CRUD operations
import  useAuthToken  from './hooks/useAuthToken'; // Ensure correct import
import EditVehicle from './pages/EditVehicle';
import BookingForm from './pages/BookingForm';
import Sidebar from './components/Sidebar'; // Import the Sidebar component
import BookingDetails from './pages/BookingDetails';

const AppRouter = () => {
  useAuthToken(); // Make sure this is used within the AuthProvider context

  return (
    <Router>
      <Header />
      <Sidebar /> {/* Include the Sidebar component */}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/page/:pageName" element={<Page />} />
        <Route path="/toggle-role" element={<ToggleRole />} />
        <Route path="/vehicles" element={<VehicleList />} /> {/* List all vehicles */}
        <Route path="/vehicles/:id" element={<VehicleDetails />} /> {/* View a specific vehicle */}
        <Route path="/manage-vehicles" element={<VehicleManagement />} /> {/* Vehicle management */}
        <Route path="/edit-vehicle/:id"  element={<EditVehicle />} />  {/*Edit Vehicle */}
        <Route path='/booking-form' element={<BookingForm />} />
        <Route path='/booking/:id' element={<BookingDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
