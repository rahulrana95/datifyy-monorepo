import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { initializeApp } from './utils/appInitializer';

// Initialize app (including auth token from cookies)
initializeApp().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
});
