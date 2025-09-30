import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const services = [
  {
    id: "wash-and-fold",
    name: "Wash & Fold",
    description: "Your daily laundry, washed and neatly folded.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-2.14 0l-3.571 2.143a2 2 0 01-2.284 0l-3.571-2.143a2 2 0 00-2.14 0m14.286 0a2 2 0 01-2.14 0m14.286 0a2 2 0 01-2.14 0M10 11V9m0 2v4m-5-2V9m0 2v4m10-2V9m0 2v4m1-4l2-2m-2 2h2m0 0a2 2 0 01-2 2h-4a2 2 0 01-2-2m10 0l-2-2m2 2h-2"
        />
      </svg>
    ),
  },
  {
    id: "dry-cleaning",
    name: "Dry Cleaning",
    description: "Professional care for delicate garments and suits.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-purple-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "ironing",
    name: "Ironing",
    description: "Get your clothes wrinkle-free and crisp.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 18.657A8 8 0 016.343 7.343a8 8 0 0111.314 11.314z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 21h4"
        />
      </svg>
    ),
  },
];

const ServiceSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    // Check if there's a service parameter in the URL
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      // Map URL parameter to service ID
      const serviceMapping = {
        'wash-and-fold': 'wash-and-fold',
        'dry-cleaning': 'dry-cleaning',
        'ironing': 'ironing'
      };
      
      const serviceId = serviceMapping[serviceParam];
      if (serviceId && services.find(service => service.id === serviceId)) {
        setSelectedServices([serviceId]);
      }
    }
  }, [searchParams]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  const handleNext = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service to continue.");
      return;
    }
    navigate("/OrderDetails");
  };

  const handleBack = () => {
    navigate(-1); // takes user back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 flex flex-col transition-colors duration-300">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative flex-grow">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              Choose Your Services
            </h2>
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
              Select all the services you need for your laundry order.
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate("/my-orders")}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
            >
              View My Orders
            </button>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 ${
                selectedServices.includes(service.id)
                  ? "border-4 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400"
                  : "border-2 border-transparent"
              }`}
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
                {service.name}
              </h3>
              <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                {service.description}
              </p>

              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  className="h-6 w-6 text-blue-600 dark:text-blue-400 rounded-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-center gap-6">
          <button
            onClick={handleBack}
            className="px-8 py-4 bg-gray-500 dark:bg-gray-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceSelection;
