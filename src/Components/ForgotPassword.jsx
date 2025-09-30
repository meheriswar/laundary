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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    
    // Trim whitespace
    const input = formData.emailOrMobile.trim();
    
    if (!input) {
      toast.error("Please enter your email or mobile number!");
      return;
    }

    // Validate email format
    const isEmail = validateEmail(input);
    const isMobile = validateMobile(input);

    if (!isEmail && !isMobile) {
      toast.error("Please enter a valid email address or 10-digit mobile number!");
      return;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => 
      (isEmail && u.email === input) || 
      (isMobile && u.nameOrMobile === input)
    );

    if (!user) {
      toast.error("No account found with this email/mobile number!");
      return;
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
    
    const otp = formData.otp.trim();
    
    if (!otp) {
      toast.error("Please enter the OTP!");
      return;
    }

    if (otp.length !== 4) {
      toast.error("OTP must be exactly 4 digits!");
      return;
    }

    if (!/^\d{4}$/.test(otp)) {
      toast.error("OTP must contain only numbers!");
      return;
    }

    if (otp !== generatedOtp) {
      toast.error("Invalid OTP! Please try again.");
      return;
    }

    toast.success("OTP verified successfully!");
    setStep(3); // Move to password reset step
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const maxLength = 15;
    
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long!`;
    }
    
    if (password.length > maxLength) {
      return `Password must be no more than ${maxLength} characters!`;
    }
    
    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      return "Password must contain at least one letter!";
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return "Password must contain at least one number!";
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character!";
    }
    
    return null; // Valid password
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    const newPassword = formData.newPassword.trim();
    const confirmPassword = formData.confirmPassword.trim();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields!");
      return;
    }

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Get the user from the users array (not the current logged-in user)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => 
      u.email === formData.emailOrMobile || u.nameOrMobile === formData.emailOrMobile
    );

    if (userIndex === -1) {
      toast.error("User not found!");
      return;
    }

    // Update password in users array
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    // Also update current user if logged in
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.email === formData.emailOrMobile || user.nameOrMobile === formData.emailOrMobile) {
        user.password = newPassword;
        localStorage.setItem("user", JSON.stringify(user));
      }
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
                  placeholder="Enter your email or 10-digit mobile number"
                  value={formData.emailOrMobile}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid email address or 10-digit mobile number starting with 6-9
                </p>
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
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    setFormData({ ...formData, otp: value });
                  }}
                  maxLength={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 4-digit code sent to your email/mobile
                </p>
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
                  placeholder="Enter new password (6-15 characters)"
                  value={formData.newPassword}
                  onChange={handleChange}
                  maxLength={15}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be 6-15 characters with at least one letter, number, and special character
                </p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  maxLength={15}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Re-enter your password to confirm
                </p>
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