import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter email/mobile, 2: Enter OTP, 3: Reset password
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [generatedOtp, setGeneratedOtp] = useState("");

  const generateOtp = () => {
    // Generate a 4-digit random OTP
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    
    if (!formData.emailOrMobile) {
      toast.error("Please enter your email or mobile number!");
      return;
    }

    // Check if user exists in localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("No account found with this email/mobile number.");
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
        toast.error("Please enter your mobile number");
        return;
      }
      
      if (user.nameOrMobile !== formData.emailOrMobile) {
        toast.error("No account found with this mobile number!");
        return;
      }
    } else {
      // User signed up with email
      if (!isEmail) {
        toast.error("Please enter your email address");
        return;
      }
      
      if (user.email !== formData.emailOrMobile) {
        toast.error("No account found with this email address!");
        return;
      }
    }

    // Generate and store OTP
    const otp = generateOtp();
    setGeneratedOtp(otp);
    
    // Show OTP to user (in real app, this would be sent via email/SMS)
    toast.info(`Your OTP is: ${otp}`, { autoClose: 10000 });
    
    // Move to OTP verification step
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    
    if (!formData.otp) {
      toast.error("Please enter the OTP!");
      return;
    }

    if (formData.otp !== generatedOtp) {
      toast.error("Invalid OTP! Please try again.");
      return;
    }

    toast.success("OTP verified successfully!");
    setStep(3); // Move to password reset step
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all password fields!");
      return;
    }

    if (formData.newPassword.length > 10) {
      toast.error("Password must be up to 10 characters!");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Update password in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      user.password = formData.newPassword;
      localStorage.setItem("user", JSON.stringify(user));
    }

    toast.success("Password reset successfully!");
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Laundry<span className="text-gray-800">Pro</span></h1>
          <p className="text-gray-600 text-sm">Fresh clothes, effortless service</p>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Forgot Password</h2>
        
        {step === 1 && (
          <>
            <p className="text-gray-600 text-center mb-8">Enter your email or mobile number to reset your password</p>
            <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email or Mobile Number *</label>
                <input
                  type="text"
                  name="emailOrMobile"
                  placeholder="Enter your email or mobile number"
                  value={formData.emailOrMobile}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-600 text-center mb-8">Enter the 4-digit OTP sent to your email/mobile</p>
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">OTP *</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 4-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Verify OTP
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const newOtp = generateOtp();
                  setGeneratedOtp(newOtp);
                  toast.info(`New OTP is: ${newOtp}`, { autoClose: 10000 });
                }}
                className="w-full py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Resend OTP
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-gray-600 text-center mb-8">Set your new password</p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password (max 10 characters)"
                  value={formData.newPassword}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </form>
          </>
        )}

        <p className="text-gray-600 mt-8 text-center">
          Remember your password?{" "}
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

export default ForgotPassword;