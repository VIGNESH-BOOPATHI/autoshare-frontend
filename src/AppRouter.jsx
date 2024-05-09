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
import useAuthToken from './hooks/useAuthToken'; // Ensure correct import

const AppRouter = () => {
  useAuthToken(); // Make sure this is used within the AuthProvider context

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/page/:pageName" element={<Page />} />
        <Route path="/toggle-role" element={<ToggleRole />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
