import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  // password change form states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // ✅ fetch logged-in user
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      toast.error("No user found! Please login.");
      navigate("/login");
    } else {
      setUser(loggedUser);
    }

    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    setOrders(allOrders);
  }, [navigate]);

  const handleLogout = () => {
    toast.info("Logging out...");
    localStorage.removeItem("user"); // clear session
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (oldPassword !== user.password) {
      toast.error("Old password is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    // update password in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email || u.nameOrMobile === user.nameOrMobile
        ? { ...u, password: newPassword }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // clear fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    toast.success("Password updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">User Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Login Name/Email:</label>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {user?.email ? user.email : user?.nameOrMobile}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Password:</label>
              <p className="text-lg font-mono text-gray-800 dark:text-gray-200">
                {"*".repeat(user?.password?.length || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Password length: {user?.password?.length || 0} characters</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-6 p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Change Password</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="w-full px-6 py-3 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No orders placed yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Address:</strong> {order.address.street},{" "}
                    {order.address.city}, {order.address.pincode}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Services:</strong>
                  </p>
                  <ul className="list-disc ml-6 text-gray-800 dark:text-gray-200">
                    {order.services.map((s, i) => (
                      <li key={i}>
                        {s.name} - {s.quantity} {s.unit} ({s.instructions})
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Order Time:</strong>{" "}
                    {new Date(order.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/services")}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Place New Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
