import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use `Routes` instead of `Switch`
import Home from './pages/Home';
import Page from './components/Page';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

const AppRouter = () => (
  <AuthProvider>
    <Router>
      <Header /> {/* Header with navigation */}
      <Routes> {/* Use `Routes` to define your routes */}
        <Route exact path="/" element={<Home />} /> {/* Use `element` instead of `component` */}
        <Route path="/page/:pageName" element={<Page />} />
      </Routes>
      <Footer /> {/* Footer at the bottom */}
    </Router>
  </AuthProvider>
);

export default AppRouter;
