import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Updated service data with standardized 'unit' pricing
const serviceData = {
  // All prices are now 'per unit' as requested
  wash: { name: "Wash & Fold", pricePerUnit: 50 }, 
  dry: { name: "Dry Cleaning", pricePerUnit: 75 }, 
  iron: { name: "Ironing", pricePerUnit: 100 },
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

  // Auto-select service if passed via query param and standardize to 'Unit'
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service");

    if (service && serviceData[service]) {
      setSelectedServices([service]);
      setOrderForms({
        [service]: { quantity: 1, unit: "Unit", specialInstructions: "" }, 
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
        [serviceId]: { quantity: 1, unit: "Unit", specialInstructions: "" },
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
    // --- Validation ---
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }
    for (const id of selectedServices) {
      if (!orderForms[id] || orderForms[id].quantity <= 0) {
        toast.error(`Please enter a valid quantity for ${serviceData[id].name}.`);
        return;
      }
    }
    if (!addressData.street || !addressData.city || !addressData.pincode) {
      toast.error("Please fill in the address details.");
      return;
    }
    if (!pickupTime || !deliveryTime) {
      toast.error("Please select pickup and delivery times.");
      return;
    }
    // --------------------

    // Structure the order to be easily consumable by the Payment component
    const servicesMap = {};
    selectedServices.forEach(id => {
      servicesMap[id] = {
        quantity: Number(orderForms[id].quantity),
        // Unit is fixed to "Unit"
        unit: "Unit",
        instructions: orderForms[id].specialInstructions,
      };
    });

    const order = {
      services: servicesMap, // Storing as a map for easier calculation in Payment.js
      address: addressData,
      pickupTime,
      deliveryTime,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    // Save the current order to localStorage for the Payment component
    localStorage.setItem("currentOrder", JSON.stringify(order));
    
    // Redirect to payment page
    navigate("/payment");
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
            <div key={id} className="mb-2 p-2 border border-gray-200 rounded-md">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(id)}
                  onChange={() => handleServiceSelect(id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700 font-medium">
                  {serviceData[id].name} - ₹{serviceData[id].pricePerUnit} per **Unit**
                </span>
              </label>
              {selectedServices.includes(id) && (
                <div className="ml-6 mt-3 flex items-center space-x-4">
                  {/* Quantity Input */}
                  <label className="text-sm font-medium text-gray-700">Units:</label>
                  <input
                    type="number"
                    min="1"
                    value={orderForms[id]?.quantity}
                    onChange={(e) =>
                      handleInputChange(id, "quantity", e.target.value)
                    }
                    className="border p-2 rounded w-20 text-center"
                    required
                  />
                  <span className="text-gray-500">Unit(s)</span>
                  
                  {/* Special Instructions Input */}
                  <input
                    type="text"
                    placeholder="Special Instructions (Optional)"
                    value={orderForms[id]?.specialInstructions}
                    onChange={(e) =>
                      handleInputChange(id, "specialInstructions", e.target.value)
                    }
                    className="border p-2 rounded w-full max-w-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Address Section */}
        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Address Details:</h3>
          <input
            type="text"
            name="street"
            placeholder="Street/House No."
            value={addressData.street}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={addressData.city}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={addressData.pincode}
            onChange={handleAddressChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Pickup & Delivery Times */}
        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Pickup & Delivery Time:</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Pickup Time</label>
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Delivery Time</label>
              <input
                type="datetime-local"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;