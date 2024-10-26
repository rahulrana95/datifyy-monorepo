import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Helmet } from 'react-helmet-async';

function App() {
  return (
    <div className="App">
       <Helmet>
        <title>Datifyy</title> {/* Dynamically set title */}
        <meta name="description" content="A simple counter application" /> {/* Optional meta tags */}
      </Helmet>his
      
    </div>
  );
}

export default App;
