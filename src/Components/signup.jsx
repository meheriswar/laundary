import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameOrMobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check all fields are filled
    if (
      !formData.nameOrMobile.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    // Password length validation
    if (formData.password.length > 10) {
      toast.error("Password must be up to 10 characters!");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Check if input is a mobile number
    const isMobile = /^\d+$/.test(formData.nameOrMobile);

    // Validate mobile number format if it is a number
    if (isMobile && formData.nameOrMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return;
    }

    // Save user to localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...formData,
        isMobile: isMobile,
      })
    );

    toast.success("Signup successful! Please login.");
    navigate("/login");
  };

  const handleSocialClick = (platform) => {
    let url = "";
    switch (platform) {
      case "Google":
        url = "https://accounts.google.com/signup";
        break;
      case "Facebook":
        url = "https://www.facebook.com/r.php";
        break;
      case "Twitter":
        url = "https://twitter.com/i/flow/signup";
        break;
      case "LinkedIn":
        url = "https://www.linkedin.com/signup";
        break;
      default:
        url = "/";
    }
    toast.info(`Redirecting to ${platform} signup...`);
    setTimeout(() => {
      window.open(url, "_blank");
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 transform hover:scale-105 transition duration-300">
        {/* Laundry Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Laundry<span className="text-gray-800">Hub</span>
          </h1>
          <p className="text-gray-600 text-sm">Fresh clothes, effortless service</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nameOrMobile"
            placeholder="Email or Mobile Number *"
            value={formData.nameOrMobile}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (up to 10 characters) *"
            value={formData.password}
            onChange={handleChange}
            maxLength={10}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChange={handleChange}
            maxLength={10}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or signup with</span>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 hover:scale-110 shadow-md transition transform duration-300"
            onClick={() => handleSocialClick("Google")}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>

          {/* Facebook, Twitter, LinkedIn buttons can stay the same */}
          {/* ... */}
        </div>

        <p className="text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline hover:scale-105 transition transform duration-200"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
