import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AppRouter from './AppRouter';
import './App.css';

const App = () => (
  <AuthProvider> {/* Provide authentication context */}
    <DataProvider> {/* Provide data context */}
      <AppRouter />
    </DataProvider>
  </AuthProvider>
);

export default App;

