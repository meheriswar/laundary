import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    setOrders(storedOrders);
  }, []);

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <ToastContainer />
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h2>
          <p className="text-gray-600 mb-6">You have no past orders.</p>
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          My Orders
        </h2>

        {orders.map((order, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Order #{idx + 1}
              </h3>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  order.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-gray-500 mb-2">
              <strong>Timestamp:</strong>{" "}
              {new Date(order.timestamp).toLocaleString()}
            </p>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Services:
              </h4>
              <ul className="list-disc list-inside text-gray-600">
                {Object.entries(order.services).map(([serviceId, details]) => (
                  <li key={serviceId}>
                    {details.quantity} {details.unit} of {serviceId.replace(/-/g, " ")}
                    {details.specialInstructions
                      ? ` (Instructions: ${details.specialInstructions})`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Address:
              </h4>
              <p className="text-gray-600">
                {order.address.streetAddress}, {order.address.city},{" "}
                {order.address.postalCode}
              </p>
              <p className="text-gray-600">
                Pickup: {order.address.pickupDate} at {order.address.pickupTime}
              </p>
              <p className="text-gray-600">
                Delivery: {order.address.deliveryDate} at {order.address.deliveryTime}
              </p>
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
