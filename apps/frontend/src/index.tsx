import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { HelmetProvider } from 'react-helmet-async';
import { LocalizationProvider } from "@mui/x-date-pickers";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(

  <HelmetProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </HelmetProvider>
);
