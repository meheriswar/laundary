import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hardcoded pricing data in INR for demonstration
const pricingData = {
  "wash-and-fold": { pricePerUnit: 15, unit: "kg" },
  "dry-cleaning": { pricePerUnit: 50, unit: "items" },
  "ironing": { pricePerUnit: 20, unit: "items" },
};

const Payment = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // State for payment method (Card or UPI)
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const storedOrder = localStorage.getItem("currentOrder");
    if (!storedOrder) {
      toast.error("No order found. Please start a new one.");
      navigate("/service-selection");
    } else {
      const parsedOrder = JSON.parse(storedOrder);
      setOrder(parsedOrder);
      calculateTotal(parsedOrder);
    }
  }, [navigate]);

  const calculateTotal = (order) => {
    let total = 0;
    for (const serviceId in order.services) {
      if (order.services.hasOwnProperty(serviceId)) {
        const { quantity } = order.services[serviceId];
        const { pricePerUnit } = pricingData[serviceId];

        if (quantity && pricePerUnit) {
          total += Number(quantity) * pricePerUnit;
        }
      }
    }
    setTotalPrice(total);
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "");
      const formattedValue = value.match(/.{1,4}/g)?.join(" ") || "";
      value = formattedValue;
    }
    setCardData({ ...cardData, [name]: value });
  };

  const validateCardPayment = () => {
    const { cardNumber, expiryDate, cvv } = cardData;

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      toast.error("Please enter a valid 16-digit card number.");
      return false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      toast.error("Please enter a valid expiry date (MM/YY).");
      return false;
    }

    const [inputMonth, inputYear] = expiryDate.split("/");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const year = Number(inputYear);
    const month = Number(inputMonth);

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error("This card has expired. Please enter a valid date.");
      return false;
    }

    if (!/^\d{3}$/.test(cvv)) {
      toast.error("Please enter a valid 3-digit CVV.");
      return false;
    }

    return true;
  };

  const validateUpiPayment = () => {
    if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      toast.error("Please enter a valid UPI ID (e.g. example@upi).");
      return false;
    }
    return true;
  };

  const handlePayment = (e) => {
    e.preventDefault();

    // Validate based on method
    if (paymentMethod === "card" && !validateCardPayment()) return;
    if (paymentMethod === "upi" && !validateUpiPayment()) return;

    const updatedOrder = { ...order, status: "Paid" };
    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));

    toast.success("Payment successful! Redirecting to service selection...", {
      autoClose: 1500,
      onClose: () => navigate("/services"),
    });
  };

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ToastContainer />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-xl p-8">
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
                    {details.quantity} {details.unit} of{" "}
                    {pricingData[serviceId]?.unit === "kg"
                      ? "Wash & Fold"
                      : pricingData[serviceId]?.unit === "items" &&
                        serviceId === "dry-cleaning"
                      ? "Dry Cleaning"
                      : "Ironing"}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹
                    {(
                      details.quantity *
                      pricingData[serviceId]?.pricePerUnit
                    ).toFixed(2)}
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

          {/* Payment Method Selection */}
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
                    : "bg-white text-gray-700"
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
                    : "bg-white text-gray-700"
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
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    placeholder="0000 0000 0000 0000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      id="expiryDate"
                      value={cardData.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      id="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label
                  htmlFor="upiId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
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
    </div>
  );
};

export default Payment;
