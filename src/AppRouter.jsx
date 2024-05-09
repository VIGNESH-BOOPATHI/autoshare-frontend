import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Navigation component
import Footer from './components/Footer'; // Footer component
import Home from './pages/Home'; // Home page
import Page from './components/Page'; // Component to dynamically render static pages
import Register from './pages/Register'; // Registration page
import Login from './pages/Login'; // Login with OTP generation
import VerifyOTP from './pages/VerifyOTP'; // OTP verification
import ToggleRole from './pages/ToggleRole'; // Toggle user roles
import AuthContext, { AuthProvider } from './context/AuthContext'; // Context for authentication state

const AppRouter = () => (
  <AuthProvider> {/* Ensure all components have access to AuthContext */}
    <Router>
      <Header /> {/* Navigation bar */}
      <Routes>
        <Route exact path="/" element={<Home />} /> {/* Home page */}
        <Route path="/register" element={<Register />} /> {/* User registration */}
        <Route path="/login" element={<Login />} /> {/* User login with OTP generation */}
        <Route path="/verify-otp" element={<VerifyOTP />} /> {/* OTP verification */}
        <Route path="/page/:pageName" element={<Page />} /> {/* Dynamic routing for static pages */}
        <Route path="/toggle-role" element={<ToggleRole />} /> {/* Toggle between user and host */}
      </Routes>
      <Footer /> {/* Footer at the bottom of the page */}
    </Router>
  </AuthProvider>
);

export default AppRouter; // Default export for use in App.jsx
