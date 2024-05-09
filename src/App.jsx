import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Correct import
import AppRouter from './AppRouter';
import './App.css';

const App = () => (
  <AuthProvider> {/* Ensure this wraps all other components */}
    <AppRouter />
  </AuthProvider>
);

export default App;

