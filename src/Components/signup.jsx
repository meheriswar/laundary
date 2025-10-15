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
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("🎉 Signup successful! Redirecting to login...");
    setTimeout(() => navigate("/login"), 1200);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <ToastContainer position="top-center" theme="colored" />
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-md p-8 mx-4 transform transition-all duration-500 hover:scale-[1.02]">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/993/993928.png"
              alt="Laundry Logo"
              className="w-10 h-10"
            />
            <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
              Laundry<span className="text-gray-800 dark:text-gray-200">Hub</span>
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Fresh clothes, effortless service
          </p>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Create Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nameOrMobile"
            placeholder="Email or Mobile Number *"
            value={formData.nameOrMobile}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (6–10 characters) *"
            value={formData.password}
            onChange={handleChange}
            maxLength={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChange={handleChange}
            maxLength={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              or sign up with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-5">
          <button
            onClick={() => handleSocialClick("Google")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition"
          >
            <FaGoogle className="text-red-500 text-xl" />
          </button>

          <button
            onClick={() => handleSocialClick("Facebook")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            <FaFacebook className="text-blue-600 text-xl" />
          </button>

          <button
            onClick={() => handleSocialClick("Twitter")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-sky-50 dark:hover:bg-gray-700 transition"
          >
            <FaTwitter className="text-sky-400 text-xl" />
          </button>

          <button
            onClick={() => handleSocialClick("LinkedIn")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            <FaLinkedin className="text-blue-700 text-xl" />
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
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
