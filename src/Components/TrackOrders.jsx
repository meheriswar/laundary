import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrackOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    setOrders(storedOrders);
  }, []);

  // 🗑️ Delete a specific order
  const handleDeleteOrder = (indexToDelete) => {
    const updatedOrders = orders.filter((_, index) => index !== indexToDelete);
    setOrders(updatedOrders);
    localStorage.setItem("allOrders", JSON.stringify(updatedOrders));
  };

  // 🗑️ Delete all orders
  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all orders?")) {
      setOrders([]);
      localStorage.removeItem("allOrders");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header with Back & Delete All Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Track Orders</h2>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              🗑️ Delete All
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← Back
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center text-lg mt-6">
            No active orders to track.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="border-b pb-4 mb-4 border-gray-200 relative bg-gray-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-800 font-semibold">
                      Order #{index + 1}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Services:</strong>{" "}
                      {order.services
                        .map((s) => `${s.name} (${s.quantity} ${s.unit})`)
                        .join(", ")}
                    </p>
                    <p className="text-sm font-semibold mb-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`${
                          order.status.toLowerCase() === "delivered"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Placed: {new Date(order.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {/* Individual Delete Button */}
                  <button
                    onClick={() => handleDeleteOrder(index)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                    title="Delete this order"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrders;
