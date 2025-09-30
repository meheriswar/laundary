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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.emailOrMobile || !formData.password) {
      toast.error("⚠️ Email/Mobile and password are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Find user with BOTH email/mobile + password
    const user = users.find(
      (u) =>
        ((u.email === formData.emailOrMobile) ||
          (u.nameOrMobile === formData.emailOrMobile)) &&
        u.password === formData.password
    );

    if (!user) {
      toast.error("❌ Invalid email/mobile or password!");
      return;
    }

    // ✅ Save logged-in user in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("✅ Login successful!");
    setTimeout(() => {
      navigate("/dashboard"); // ✅ Redirect to Dashboard
    }, 1000);
  };

  // ✅ Social Login Redirect
  const handleSocialLogin = (platform) => {
    let url = "";
    switch (platform) {
      case "google":
        url = "https://accounts.google.com/";
        break;
      case "facebook":
        url = "https://www.facebook.com/login/";
        break;
      case "linkedin":
        url = "https://www.linkedin.com/login";
        break;
      case "twitter":
        url = "https://twitter.com/login";
        break;
      default:
        url = "/";
    }
    toast.info(`Redirecting to ${platform} login...`);
    setTimeout(() => {
      window.open(url, "_blank"); // opens in new tab
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer />
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-md p-8 transition-colors duration-300">
        {/* App Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            Laundry<span className="text-gray-800 dark:text-gray-200">Pro</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Fresh clothes, effortless service
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Sign in to your LaundryPro account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email / Mobile */}
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
              htmlFor="emailOrMobile"
            >
              Email or Mobile Number *
            </label>
            <input
              type="text"
              id="emailOrMobile"
              name="emailOrMobile"
              placeholder="Enter your email or mobile number"
              value={formData.emailOrMobile}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              maxLength={10}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <span
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or login with</span>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
          >
            <FaGoogle className="text-red-500 text-xl" />
          </button>
          <button
            onClick={() => handleSocialLogin("facebook")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
          >
            <FaFacebook className="text-blue-600 text-xl" />
          </button>
          <button
            onClick={() => handleSocialLogin("twitter")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
          >
            <FaTwitter className="text-sky-400 text-xl" />
          </button>
          <button
            onClick={() => handleSocialLogin("linkedin")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
          >
            <FaLinkedin className="text-blue-700 text-xl" />
          </button>
        </div>

        {/* Signup Redirect */}
        <p className="text-gray-600 dark:text-gray-400 mt-6 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
