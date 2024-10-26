import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home/home";

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Datifyy</title> {/* Dynamically set title */}
        <meta name="description" content="A simple counter application" />{" "}
        {/* Optional meta tags */}
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
