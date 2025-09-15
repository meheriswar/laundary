import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./Components/signup";
import Login from "./Components/login";
import ForgotPassword from "./Components/ForgotPassword";
import Dashboard from "./Components/dashboard"; // Capital D
import ServiceSelection from "./Components/ServiceSelection";
import OrderDetails from "./Components/OrderDetails";
import Payment from "./Components/Payment";
import MyOrders from "./Components/Myorders"; // New Page

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Auth Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Service & Order Pages */}
        <Route path="/service-selection" element={<ServiceSelection />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/my-orders" element={<MyOrders />} /> {/* New route */}

        {/* Catch-all 404 Page */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-3xl font-bold">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
