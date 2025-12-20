import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaHeart, FaUser, FaBox } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

import { useSelector } from "react-redux";

const MobileBottomBar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.length;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Don't show on product details or cart pages if you prefer (optional choice, removing for consistent nav)
  // if (location.pathname.startsWith('/product') || location.pathname === '/cart') return null;

  return (
    <div className={`fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-6 z-50 transition-transform duration-300 md:hidden ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="flex justify-between items-center">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-primary' : 'text-gray-500'}`}>
           <FaHome className="text-xl" />
           <span className="text-[10px]">Home</span>
        </Link>
        
        <Link to="/category/All" className={`flex flex-col items-center gap-1 ${location.pathname.includes('/category') ? 'text-primary' : 'text-gray-500'}`}>
           <FaBox className="text-xl" />
           <span className="text-[10px]">Shop</span>
        </Link>

        {/* View Cart Button (Floating Center) */}
        <Link to="/cart" className="relative -top-5 bg-black text-white p-4 rounded-full shadow-lg border-4 border-white dark:border-gray-900">
             <FaCartShopping className="text-xl" />
             {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px]">
                {cartCount}
                </span>
            )}
        </Link>

        <Link to="/wishlist" className={`flex flex-col items-center gap-1 ${location.pathname === '/wishlist' ? 'text-primary' : 'text-gray-500'}`}>
           <FaHeart className="text-xl" />
           <span className="text-[10px]">Wishlist</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-primary' : 'text-gray-500'}`}>
           <FaUser className="text-xl" />
           <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomBar;
