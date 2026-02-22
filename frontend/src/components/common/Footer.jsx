import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/Images/Logo.png" 
                alt="New Saptari Madira Trader" 
                className="h-10 w-auto object-contain"
              />
              <div>
                <h3 className="text-white font-bold">New Saptari Madira Trader</h3>
                <p className="text-gray-400 text-xs">Premium Alcohol Distribution</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Your trusted partner for premium alcohol distribution in Nepal. 
              Operating since 20+ years with multiple godowns across the country.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                Viber
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                  Place Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-red-500 mt-1" />
                <span className="text-gray-400 text-sm">
                  Rajbiraj, Saptari<br />
                  Province 2, Nepal
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-red-500" />
                <span className="text-gray-400 text-sm">9842822810</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-red-500" />
                <span className="text-gray-400 text-sm">kunal.singh7445@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiClock className="text-red-500" />
                <span className="text-gray-400 text-sm">Sun - Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} New Saptari Madira Trader. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-500 hover:text-red-500 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-red-500 text-sm">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
