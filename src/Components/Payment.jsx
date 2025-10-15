import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pricing data
const pricingData = {
  wash: { name: "Wash & Fold", pricePerUnit: 50 },
  dry: { name: "Dry Cleaning", pricePerUnit: 75 },
  iron: { name: "Ironing", pricePerUnit: 100 },
};

const getServiceName = (serviceId) => {
  switch (serviceId) {
    case "wash":
      return pricingData.wash.name;
    case "dry":
      return pricingData.dry.name;
    case "iron":
      return pricingData.iron.name;
    default:
      return "Unknown Service";
  }
};

const Payment = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({ cardNumber: "", expiryDate: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const storedOrder = localStorage.getItem("currentOrder");
    if (!storedOrder) {
      toast.error("No order found. Please start a new one.");
      navigate("/services");
    } else {
      const parsedOrder = JSON.parse(storedOrder);
      setOrder(parsedOrder);
      calculateTotal(parsedOrder);
    }
  }, [navigate]);

  const calculateTotal = (order) => {
    let total = 0;
    for (const id in order.services) {
      if (pricingData[id]) total += order.services[id].quantity * pricingData[id].pricePerUnit;
    }
    setTotalPrice(total);
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "");
      value = value.match(/.{1,4}/g)?.join(" ") || "";
    } else if (name === "expiryDate") {
      value = value.replace(/[^\d/]/g, "");
      if (value.length > 2 && !value.includes("/")) value = value.slice(0, 2) + "/" + value.slice(2, 4);
      value = value.slice(0, 5);
    } else if (name === "cvv") {
      value = value.replace(/\D/g, "");
    }
    setCardData({ ...cardData, [name]: value });
  };

  const validateCardPayment = () => {
    const { cardNumber, expiryDate, cvv } = cardData;
    const clean = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(clean)) return toast.error("Enter valid 16-digit card"), false;
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return toast.error("Enter valid expiry (MM/YY)"), false;
    if (!/^\d{3}$/.test(cvv)) return toast.error("Enter valid 3-digit CVV"), false;
    return true;
  };

  const validateUpiPayment = () => {
    if (!/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      toast.error("Please enter a valid UPI ID (e.g. example@upi)");
      return false;
    }
    return true;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (paymentMethod === "card" && !validateCardPayment()) return;
    if (paymentMethod === "upi" && !validateUpiPayment()) return;

    // Step 1: Build order structure
    const orderArray = Object.entries(order.services).map(([id, details]) => ({
      name: getServiceName(id),
      quantity: details.quantity,
      unit: details.unit || "Unit",
      instructions: details.instructions || "",
    }));

    const newOrder = {
      ...order,
      services: orderArray,
      totalAmount: totalPrice,
      timestamp: new Date().toISOString(),
      status: "Paid",
      orderId: `ORD-${Date.now()}`,
    };

    // Step 2: Save in allOrders
    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    allOrders.push(newOrder);
    localStorage.setItem("allOrders", JSON.stringify(allOrders));

    // Step 3: Save as currentOrder
    localStorage.setItem("currentOrder", JSON.stringify(newOrder));

    // Step 4: Schedule automatic status updates
    scheduleStatusUpdates(newOrder.orderId);

    toast.success("Payment successful! Redirecting to My Orders...", {
      autoClose: 2000,
      onClose: () => navigate("/My-orders"),
    });
  };

  const scheduleStatusUpdates = (orderId) => {
    const updateOrderStatus = (newStatus, delay) => {
      setTimeout(() => {
        const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
        const updatedOrders = allOrders.map((o) =>
          o.orderId === orderId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem("allOrders", JSON.stringify(updatedOrders));
      }, delay);
    };

    // Automatically progress the order
    updateOrderStatus("In Progress", 10 * 1000); // after 10 seconds
    updateOrderStatus("Ready for Pickup", 20 * 1000); // after 20 seconds
    updateOrderStatus("Delivered", 30 * 1000); // after 30 seconds
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="max-w-xl w-full bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Complete Payment
        </h2>

        {/* Order Summary */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h3>
          <ul className="divide-y divide-gray-200">
            {Object.entries(order.services).map(([serviceId, details]) => (
              <li key={serviceId} className="flex justify-between py-2">
                <span className="text-gray-600">
                  {details.quantity} Units of {getServiceName(serviceId)}
                </span>
                <span className="font-medium text-gray-900">
                  ₹{(details.quantity * (pricingData[serviceId]?.pricePerUnit || 0)).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-800">
              Total Amount:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`px-4 py-2 rounded-md border ${
                paymentMethod === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              className={`px-4 py-2 rounded-md border ${
                paymentMethod === "upi"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              UPI
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-6">
          {paymentMethod === "card" ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-3 border rounded-md"
                  maxLength="19"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    className="w-full p-3 border rounded-md"
                    maxLength="5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    className="w-full p-3 border rounded-md"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                className="w-full p-3 border rounded-md"
                required
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate("/OrderDetails")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Back to Order
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Pay ₹{totalPrice.toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
