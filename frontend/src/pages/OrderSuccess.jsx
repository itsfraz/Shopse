import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Confetti from "react-confetti";

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId || "123456";
    const [showConfetti, setShowConfetti] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-6xl text-green-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Order Successful!</h1>
        <p className="text-gray-500 mb-6">Thank you for your purchase.</p>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
            <p className="text-xl font-mono font-bold text-gray-800 dark:text-white">#{orderId}</p>
        </div>

        <div className="space-y-3">
             <Link 
                to="/profile?tab=orders" 
                className="block w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                View Order History
            </Link>
            <Link 
                to="/" 
                className="block w-full border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-white py-3 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
