import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.nameOrMobile || user.email);
    } else {
      // If no user data, redirect to the login page
      toast.error("Please login first to view the dashboard.");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage and redirect to login
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const handleStart = () => {
    // Navigate to the service selection page
    navigate("/service-selection");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer />
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                Laundry<span className="text-gray-800">Pro</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Hello, {userName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white shadow-xl rounded-xl w-full max-w-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to the Dashboard!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your clothes are just a few clicks away from being fresh and clean.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleStart}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start New Order
              </button>
              <p className="text-gray-500 text-sm">
                Click "Start New Order" to choose your laundry services.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {new Date().getFullYear()} LaundryPro. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;