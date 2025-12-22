
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

import { useSettings } from "../../context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-gray-300 pt-16 pb-8 font-outfit border-t border-gray-100 dark:border-gray-800">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Pitch */}
          <div className="col-span-1 md:col-span-1">
             <h1 className="text-3xl font-bold tracking-tighter mb-4 dark:text-white">
                {settings?.siteName || "boAt"}
                <span className="text-primary absolute -mt-1 ml-0 text-3xl">.</span>
             </h1>
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
               {settings?.metaDescription || "Subscribe to our email alerts!"}
             </p>
             <div className="flex bg-white rounded-md border border-gray-300 overflow-hidden max-w-xs">
                <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="flex-grow px-3 py-2 outline-none text-sm"
                />
                <button className="bg-black text-white px-4 py-2 text-sm font-bold">
                    →
                </button>
             </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-primary cursor-pointer">True Wireless Earbuds</li>
                <li className="hover:text-primary cursor-pointer">Wireless Headphones</li>
                <li className="hover:text-primary cursor-pointer">Wired Headphones</li>
                <li className="hover:text-primary cursor-pointer">Wireless Speakers</li>
                <li className="hover:text-primary cursor-pointer">Home Audio</li>
                <li className="hover:text-primary cursor-pointer">Mobile Accessories</li>
                <li className="hover:text-primary cursor-pointer">Smart Watches</li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-primary cursor-pointer">Track Your Order</li>
                <li className="hover:text-primary cursor-pointer">Warranty & Support</li>
                <li className="hover:text-primary cursor-pointer">Return Policy</li>
                <li className="hover:text-primary cursor-pointer">Service Centers</li>
                <li className="hover:text-primary cursor-pointer">Bulk Orders</li>
                <li className="hover:text-primary cursor-pointer">FAQs</li>
                <li className="hover:text-primary cursor-pointer">Why Buy Direct</li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-primary cursor-pointer">About boAt</li>
                <li className="hover:text-primary cursor-pointer">News</li>
                <li className="hover:text-primary cursor-pointer">Read Our Blog</li>
                <li className="hover:text-primary cursor-pointer">Careers</li>
                <li className="hover:text-primary cursor-pointer">Security</li>
                <li className="hover:text-primary cursor-pointer">Terms of Service</li>
                <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-300 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:text-primary transition-colors"><FaFacebook /></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:text-primary transition-colors"><FaTwitter /></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:text-primary transition-colors"><FaInstagram /></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:text-primary transition-colors"><FaYoutube /></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:text-primary transition-colors"><FaLinkedin /></div>
            </div>
            <p className="text-sm text-gray-500">© 2024 Imagine Marketing Limited. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
