import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please login first to view the dashboard.");
      navigate("/login");
    }
  }, [navigate]);
      


  

  const handleStart = () => {
    navigate("/services");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 relative transition-colors duration-300">
      <ToastContainer />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `url('/images/laundry-background.svg')`
        }}
      ></div>


      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-lg p-8 text-center transition-colors duration-300">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Welcome to the Dashboard!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your clothes are just a few clicks away from being fresh and clean.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleStart}
                className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                Start New Order
              </button>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Click "Start New Order" to choose your laundry services.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
