import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serviceData = {
  wash: { name: "Washing", pricePerUnit: 50 },
  dry: { name: "Dry Cleaning", pricePerUnit: 100 },
  iron: { name: "Ironing", pricePerUnit: 30 },
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedServices, setSelectedServices] = useState([]);
  const [orderForms, setOrderForms] = useState({});
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    pincode: "",
  });
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // ✅ Auto-select service if passed via query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service");

    if (service && serviceData[service]) {
      setSelectedServices([service]);
      setOrderForms({
        [service]: { quantity: 1, unit: "kg", specialInstructions: "" },
      });
    }
  }, [location.search]);

  const handleServiceSelect = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId));
      const updatedForms = { ...orderForms };
      delete updatedForms[serviceId];
      setOrderForms(updatedForms);
    } else {
      setSelectedServices([...selectedServices, serviceId]);
      setOrderForms({
        ...orderForms,
        [serviceId]: { quantity: 1, unit: "kg", specialInstructions: "" },
      });
    }
  };

  const handleInputChange = (serviceId, field, value) => {
    setOrderForms({
      ...orderForms,
      [serviceId]: { ...orderForms[serviceId], [field]: value },
    });
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }
    if (!addressData.street || !addressData.city || !addressData.pincode) {
      toast.error("Please fill in the address details.");
      return;
    }
    if (!pickupTime || !deliveryTime) {
      toast.error("Please select pickup and delivery times.");
      return;
    }

    const order = {
      services: selectedServices.map((id) => ({
        name: serviceData[id]?.name,
        quantity: orderForms[id].quantity,
        unit: orderForms[id].unit,
        instructions: orderForms[id].specialInstructions,
        price: serviceData[id]?.pricePerUnit,
      })),
      address: addressData,
      pickupTime,
      deliveryTime,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    allOrders.push(order);
    localStorage.setItem("allOrders", JSON.stringify(allOrders));

    // ✅ Redirect to payment page with order details
    navigate("/payment", { state: { order } });
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Order Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* Service Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Choose Services:</h3>
          {Object.keys(serviceData).map((id) => (
            <div key={id} className="mb-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(id)}
                  onChange={() => handleServiceSelect(id)}
                />
                <span>
                  {serviceData[id].name} - ₹{serviceData[id].pricePerUnit} per unit
                </span>
              </label>
              {selectedServices.includes(id) && (
                <div className="ml-6 mt-2 space-y-2">
                  <input
                    type="number"
                    min="1"
                    value={orderForms[id]?.quantity}
                    onChange={(e) =>
                      handleInputChange(id, "quantity", e.target.value)
                    }
                    className="border p-2 rounded w-20"
                  />
                  <select
                    value={orderForms[id]?.unit}
                    onChange={(e) =>
                      handleInputChange(id, "unit", e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option value="kg">Kg</option>
                    <option value="pcs">Pieces</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Special Instructions"
                    value={orderForms[id]?.specialInstructions}
                    onChange={(e) =>
                      handleInputChange(id, "specialInstructions", e.target.value)
                    }
                    className="border p-2 rounded w-64"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Address Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Address Details:</h3>
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={addressData.street}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={addressData.city}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={addressData.pincode}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Pickup & Delivery Times */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Pickup & Delivery Time:</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Pickup Time</label>
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Delivery Time</label>
              <input
                type="datetime-local"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
     