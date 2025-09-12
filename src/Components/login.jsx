import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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
      toast.error("Email/Mobile and password are required!");
      return;
    }

    // Check if user exists in localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("No account found. Please sign up first.");
      return;
    }

    const user = JSON.parse(userData);
    
    // Determine if the input is email or mobile
    const isEmail = formData.emailOrMobile.includes('@');
    const isMobile = /^\d+$/.test(formData.emailOrMobile);
    
    // Validate based on how user signed up
    if (user.isMobile) {
      // User signed up with mobile number
      if (!isMobile) {
        toast.error("Please enter your mobile number to login");
        return;
      }
      
      if (user.nameOrMobile !== formData.emailOrMobile) {
        toast.error("Invalid mobile number!");
        return;
      }
    } else {
      // User signed up with email
      if (!isEmail) {
        toast.error("Please enter your email address to login");
        return;
      }
      
      if (user.email !== formData.emailOrMobile) {
        toast.error("Invalid email address!");
        return;
      }
    }

    // Check password
    if (user.password !== formData.password) {
      toast.error("Invalid password!");
      return;
    }

    toast.success("Login successful!");
    // Redirect to dashboard or home page after successful login
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        {/* Laundry Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Laundry<span className="text-gray-800">Pro</span></h1>
          <p className="text-gray-600 text-sm">Fresh clothes, effortless service</p>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back
        </h2>
        
        <p className="text-gray-600 text-center mb-8">
          Sign in to your LaundryPro account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="emailOrMobile">
              Email or Mobile Number *
            </label>
            <input
              type="text"
              id="emailOrMobile"
              name="emailOrMobile"
              placeholder="Enter your email or mobile number"
              value={formData.emailOrMobile}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            {/* FIXED: Changed from <a> tag to clickable span */}
            <span 
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-gray-600 mt-8 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;