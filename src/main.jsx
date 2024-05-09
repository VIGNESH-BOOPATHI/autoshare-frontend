import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap for styling
import './index.css'; // Global styles

// Get the root element where the React app will mount
const rootElement = document.getElementById('root');

// Create a root using createRoot
const root = createRoot(rootElement);

// Render the React app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
