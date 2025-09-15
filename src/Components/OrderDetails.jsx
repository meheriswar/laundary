import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable service data for dynamic rendering
const serviceData = {
  "wash-and-fold": { name: "Wash & Fold", defaultUnit: "kg" },
  "dry-cleaning": { name: "Dry Cleaning", defaultUnit: "items" },
  "ironing": { name: "Ironing", defaultUnit: "items" },
};

// Hardcoded pricing data in INR
const pricingData = {
  "wash-and-fold": { pricePerUnit: 150, unit: "kg" },
  "dry-cleaning": { pricePerUnit: 500, unit: "items" },
  "ironing": { pricePerUnit: 200, unit: "items" },
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedServices = searchParams.get("services")?.split(",") || [];

  const [orderForms, setOrderForms] = useState(() => {
    const initialForms = {};
    selectedServices.forEach((id) => {
      initialForms[id] = {
        quantity: "",
        unit: serviceData[id]?.defaultUnit || "items",
        specialInstructions: "",
      };
    });
    return initialForms;
  });

  const [addressData, setAddressData] = useState({
    streetAddress: "",
    city: "",
    postalCode: "",
    pickupDate: "",
    pickupTime: "",
    deliveryDate: "",
    deliveryTime: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      toast.error("Please log in to continue your order.");
      navigate("/login");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("No services selected. Please choose from the list.");
      navigate("/service-selection");
    }
  }, [selectedServices, navigate]);

  const handleFormChange = (serviceId, e) => {
    const { name, value } = e.target;
    setOrderForms((prevForms) => ({
      ...prevForms,
      [serviceId]: {
        ...prevForms[serviceId],
        [name]: value,
      },
    }));
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFormsValid = selectedServices.every((id) => {
      const form = orderForms[id];
      const quantity = Number(form.quantity);
      return !isNaN(quantity) && quantity > 0 && quantity <= 999;
    });

    const allAddressFieldsValid = Object.values(addressData).every((val) => val);

    if (!allFormsValid) {
      toast.error("Please enter valid quantities (1-999) for all services.");
      return;
    }

    if (!allAddressFieldsValid) {
      toast.error("Please fill in all address and timing fields.");
      return;
    }

    const order = {
      services: orderForms,
      address: addressData,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("currentOrder", JSON.stringify(order));
    toast.success("Order details saved! Proceeding to payment.");
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ToastContainer />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            Complete Your Order
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {selectedServices.map((serviceId) => (
              <div key={serviceId} className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-medium text-blue-600 mb-2">
                  {serviceData[serviceId]?.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Price: ₹{pricingData[serviceId]?.pricePerUnit} per {pricingData[serviceId]?.unit}
                </p>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`quantity-${serviceId}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity *
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="number"
                        name="quantity"
                        id={`quantity-${serviceId}`}
                        value={orderForms[serviceId]?.quantity || ""}
                        onChange={(e) => handleFormChange(serviceId, e)}
                        placeholder="Enter quantity"
                        min="1"
                        step="1"
                        className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                        required
                      />
                      <select
                        name="unit"
                        value={orderForms[serviceId]?.unit || "items"}
                        onChange={(e) => handleFormChange(serviceId, e)}
                        className="rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                      >
                        <option value="kg">kg</option>
                        <option value="items">items</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor={`instructions-${serviceId}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Special Instructions (optional)
                    </label>
                    <textarea
                      name="specialInstructions"
                      id={`instructions-${serviceId}`}
                      rows="3"
                      value={orderForms[serviceId]?.specialInstructions || ""}
                      onChange={(e) => handleFormChange(serviceId, e)}
                      placeholder="e.g., use fabric softener, starch shirts, etc."
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}

            <hr className="border-gray-300" />

            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-800">
                Pickup & Delivery Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="streetAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    id="streetAddress"
                    value={addressData.streetAddress}
                    onChange={handleAddressChange}
                    placeholder="123 Main St"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      placeholder="New York"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      value={addressData.postalCode}
                      onChange={handleAddressChange}
                      placeholder="10001"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="pickupDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    id="pickupDate"
                    value={addressData.pickupDate}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="pickupTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pickup Time *
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    id="pickupTime"
                    value={addressData.pickupTime}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="deliveryDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    id="deliveryDate"
                    value={addressData.deliveryDate}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="deliveryTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Time *
                  </label>
                  <input
                    type="time"
                    name="deliveryTime"
                    id="deliveryTime"
                    value={addressData.deliveryTime}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/service-selection")}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;