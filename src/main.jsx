import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initApiInterceptor } from './utils/apiInterceptor.js';

// Initialize the client-side API interceptor for live static deployments (Surge)
initApiInterceptor();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
