import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import {BookingProvider} from './context/BookingContext';
import AppRouter from './AppRouter';
import './App.css';

const App = () => (
  <AuthProvider> {/* Provide authentication context */}
    <DataProvider> {/* Provide data context */}
    <BookingProvider>
      <AppRouter />
      </BookingProvider>
    </DataProvider>
  </AuthProvider>
);

export default App;

