import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import TrackOrders from "./Components/TrackOrders";
import MyOrders from "./Components/Myorders";
import Services from "./Components/ServiceSelection";
import Profile from "./Components/Profile";
import Login from "./Components/login";
import Signup from "./Components/signup";
import OrderDetails from "./Components/OrderDetails";
import Payment from "./Components/Payment";
import ForgotPassword from "./Components/ForgotPassword";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default first page = Signup */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/track-orders" element={<TrackOrders />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/OrderDetails" element={<OrderDetails/>} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
