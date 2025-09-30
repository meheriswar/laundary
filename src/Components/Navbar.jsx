import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.nameOrMobile || user.email);
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
    setIsProfileOpen(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Don't show navbar on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Laundry<span className="text-gray-800 dark:text-gray-200">Hub</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive("/dashboard")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/services"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive("/services")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Services
                </Link>
                <Link
                  to="/my-orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive("/my-orders")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  My Orders
                </Link>
                <Link
                  to="/track-orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive("/track-orders")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Track Orders
                </Link>
              </div>
            </div>

            {/* User Profile & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {userName && (
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Welcome, {userName}
                </span>
              )}
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <FaUserCircle className="text-2xl" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Past Orders
                    </Link>
                    <Link
                      to="/track-orders"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Track Orders
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Dark Mode Toggle for Mobile */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
              </button>
              
              <button
                onClick={toggleMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/dashboard")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/services"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/services")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/my-orders"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/my-orders")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/track-orders"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/track-orders")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Track Orders
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
