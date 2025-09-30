import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-200">LaundryApp</h3>
            <p className="text-gray-300 dark:text-gray-400">
              Professional laundry services at your doorstep. Quality cleaning,
              convenient pickup and delivery.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-200">Services</h3>
            <ul className="space-y-2 text-gray-300 dark:text-gray-400">
              <li>
                <Link to="/services?service=wash-and-fold" className="hover:underline hover:text-white dark:hover:text-gray-200 transition-colors duration-200">
                  Wash & Fold
                </Link>
              </li>
              <li>
                <Link to="/services?service=dry-cleaning" className="hover:underline hover:text-white dark:hover:text-gray-200 transition-colors duration-200">
                  Dry Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services?service=ironing" className="hover:underline hover:text-white dark:hover:text-gray-200 transition-colors duration-200">
                  Ironing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-200">Contact</h3>
            <div className="text-gray-300 dark:text-gray-400">
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@laundryapp.com</p>
              <p>Hours: 7 AM - 10 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 dark:border-gray-600 mt-8 pt-8 text-center text-gray-300 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} LaundryApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
