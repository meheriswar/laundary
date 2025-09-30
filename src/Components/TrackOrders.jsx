import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrackOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    setOrders(storedOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Track Orders</h2>
          <button
            onClick={() => navigate(-1)} // ⬅️ Back to previous page
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← Back
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-600">No active orders to track.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="border-b pb-4 mb-4 border-gray-200"
              >
                <p className="text-gray-800 font-semibold">
                  Order #{index + 1}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Services:</strong>{" "}
                  {order.services
                    .map((s) => `${s.name} (${s.quantity} ${s.unit})`)
                    .join(", ")}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="text-gray-600 text-sm">
                  Placed: {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrders;
