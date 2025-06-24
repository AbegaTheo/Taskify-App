// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import About from "./pages/About";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-center" autoClose={2000} />
      <Router>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
