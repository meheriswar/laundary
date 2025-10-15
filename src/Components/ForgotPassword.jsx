import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Steps: 1 = Enter Email/Mobile, 2 = Verify OTP, 3 = Reset Password
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [generatedOtp, setGeneratedOtp] = useState("");

  // ✅ Utility Validators
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

  // ✅ Step 1 — Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    const input = formData.emailOrMobile.trim();

    if (!input) {
      toast.error("⚠️ Please enter your email or mobile number!");
      return;
    }

    const isEmail = validateEmail(input);
    const isMobile = validateMobile(input);

    if (!isEmail && !isMobile) {
      toast.error("⚠️ Enter a valid email or 10-digit mobile number!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.nameOrMobile === input || u.email === input
    );

    if (!user) {
      toast.error("❌ No account found with this email or mobile number!");
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    toast.info(`📩 Your OTP is: ${otp}`, { autoClose: 10000 });

    setStep(2);
  };

  // ✅ Step 2 — Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otp = formData.otp.trim();

    if (!otp) return toast.error("⚠️ Please enter the OTP!");
    if (otp.length !== 4) return toast.error("⚠️ OTP must be 4 digits!");
    if (!/^\d+$/.test(otp)) return toast.error("⚠️ OTP must be numeric!");
    if (otp !== generatedOtp)
      return toast.error("❌ Invalid OTP! Please try again.");

    toast.success("✅ OTP verified successfully!");
    setStep(3);
  };

  // ✅ Step 3 — Reset Password
  const validatePassword = (password) => {
    if (password.length < 6 || password.length > 15)
      return "Password must be between 6–15 characters!";
    if (!/[A-Za-z]/.test(password))
      return "Password must contain at least one letter!";
    if (!/\d/.test(password))
      return "Password must contain at least one number!";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must include one special character!";
    return null;
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const newPassword = formData.newPassword.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!newPassword || !confirmPassword)
      return toast.error("⚠️ Please fill in all password fields!");

    const passwordError = validatePassword(newPassword);
    if (passwordError) return toast.error(passwordError);

    if (newPassword !== confirmPassword)
      return toast.error("⚠️ Passwords do not match!");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(
      (u) =>
        u.email === formData.emailOrMobile ||
        u.nameOrMobile === formData.emailOrMobile
    );

    if (userIndex === -1) return toast.error("❌ User not found!");

    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (
      currentUser &&
      (currentUser.email === formData.emailOrMobile ||
        currentUser.nameOrMobile === formData.emailOrMobile)
    ) {
      currentUser.password = newPassword;
      localStorage.setItem("user", JSON.stringify(currentUser));
    }

    toast.success("🎉 Password reset successful!");
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ JSX Return
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer />
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-md p-8 transform hover:scale-105 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            Laundry<span className="text-gray-800 dark:text-gray-200">Hub</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Fresh clothes, effortless service
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Forgot Password
        </h2>

        {/* Step 1 — Enter Email/Mobile */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="text"
              name="emailOrMobile"
              placeholder="Email or Mobile Number *"
              value={formData.emailOrMobile}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2 — OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter 4-digit OTP"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })
              }
              maxLength={4}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
            />
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
                toast.info(`🔁 New OTP: ${newOtp}`, { autoClose: 10000 });
              }}
              className="w-full py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3 — Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password *"
              value={formData.newPassword}
              onChange={handleChange}
              maxLength={15}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={15}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Navigation */}
        <p className="text-gray-600 mt-6 text-center">
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
