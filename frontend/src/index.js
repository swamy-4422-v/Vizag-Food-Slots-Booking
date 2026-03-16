import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. GLOBAL STYLES
// Tailwind and custom animations
import './index.css'; 

// 2. EXTERNAL LIBRARY STYLES
// Crucial for Leaflet maps to render correctly
import 'leaflet/dist/leaflet.css';

// 3. MAIN APPLICATION
import App from './App';

/**
 * MOUNTING LOGIC
 * We check for the root element to ensure the DOM is ready.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure index.html has <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement);

// 4. RENDERING
// StrictMode helps identify side effects and deprecated APIs during development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);