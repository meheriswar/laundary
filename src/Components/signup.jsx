import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameOrMobile: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation Function
  const validateForm = () => {
    const { nameOrMobile, password, confirmPassword } = formData;

    if (!nameOrMobile.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("⚠️ Please fill in all required fields!");
      return false;
    }

    const isMobile = /^\d+$/.test(nameOrMobile);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nameOrMobile);

    if (!isMobile && !isEmail) {
      toast.error("⚠️ Enter a valid email or 10-digit mobile number!");
      return false;
    }

    if (isMobile && nameOrMobile.length !== 10) {
      toast.error("⚠️ Mobile number must be exactly 10 digits!");
      return false;
    }

    if (password.length < 6 || password.length > 10) {
      toast.error("⚠️ Password must be between 6–10 characters!");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("⚠️ Password must contain at least 1 uppercase letter!");
      return false;
    }

    if (!/[0-9]/.test(password)) {
      toast.error("⚠️ Password must contain at least 1 number!");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("⚠️ Passwords do not match!");
      return false;
    }

    return true;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(
      (u) => u.nameOrMobile === formData.nameOrMobile
    );

    if (userExists) {
      toast.error("⚠️ User already exists! Please login.");
      return;
    }

    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("🎉 Signup successful! Please login.");
    setTimeout(() => navigate("/login"), 1000);
  };

  // Social Login Redirect
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer />
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-md p-8 transform hover:scale-105 transition-all duration-300">
        {/* Laundry Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            Laundry<span className="text-gray-800 dark:text-gray-200">Hub</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Fresh clothes, effortless service
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Create Account
        </h2>

        {/* Form */}
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
            placeholder="Password (6–10 characters) *"
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

        {/* Social Media */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleSocialClick("Google")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50 shadow-md transition"
          >
            <FaGoogle className="text-red-500 text-xl" />
          </button>
          <button
            onClick={() => handleSocialClick("Facebook")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50 shadow-md transition"
          >
            <FaFacebook className="text-blue-600 text-xl" />
          </button>
          <button
            onClick={() => handleSocialClick("Twitter")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50 shadow-md transition"
          >
            <FaTwitter className="text-sky-400 text-xl" />
          </button>
          <button
            onClick={() => handleSocialClick("LinkedIn")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50 shadow-md transition"
          >
            <FaLinkedin className="text-blue-700 text-xl" />
          </button>
        </div>

        <p className="text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
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
