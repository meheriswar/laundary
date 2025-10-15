import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaGoogle, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
    rememberMe: false,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.emailOrMobile || !formData.password) {
      toast.error("⚠️ Email/Mobile and password are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

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

    localStorage.setItem("user", JSON.stringify(user));
    toast.success("✅ Login successful!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  // Social login redirect
  const handleSocialLogin = (platform) => {
    let url = "";
    switch (platform) {
      case "google":
        url = "https://accounts.google.com/";
        break;
      case "facebook":
        url = "https://www.facebook.com/login/";
        break;
      case "twitter":
        url = "https://twitter.com/login";
        break;
      case "linkedin":
        url = "https://www.linkedin.com/login";
        break;
      default:
        url = "/";
    }

    toast.info(`Redirecting to ${platform} login...`);
    setTimeout(() => window.open(url, "_blank"), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <ToastContainer position="top-center" theme="colored" />
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-md p-8 mx-4 transform transition-all duration-500 hover:scale-[1.02]">
        {/* Logo & Branding */}
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

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Sign in to your LaundryHub account
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email or Mobile */}
          <div>
            <input
              type="text"
              id="emailOrMobile"
              name="emailOrMobile"
              placeholder="Email or Mobile Number *"
              value={formData.emailOrMobile}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              maxLength={10}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Remember me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 text-sm">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span>Remember me</span>
            </label>

            <span
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              or login with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-5">
          <button
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition"
          >
            <FaGoogle className="text-red-500 text-xl" />
          </button>
          <button
            onClick={() => handleSocialLogin("facebook")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            <FaFacebook className="text-blue-600 text-xl" />
          </button>
          <button
            onClick={() => handleSocialLogin("twitter")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-sky-50 dark:hover:bg-gray-700 transition"
          >
            <FaTwitter className="text-sky-400 text-xl" />
          </button>
          <button
            onClick={() => handleSocialLogin("linkedin")}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            <FaLinkedin className="text-blue-700 text-xl" />
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
