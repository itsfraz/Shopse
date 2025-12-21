import React from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  if (!wishlistItems || wishlistItems.length === 0) {
     return (
        <div className="min-h-screen pt-24 text-center">
            <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
            <Link to="/" className="text-primary underline">Continue Shopping</Link>
        </div>
     );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">My Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm group">
                    <div className="relative h-64 bg-gray-100 dark:bg-gray-700 p-6 flex justify-center items-center">
                        <img src={item.img} alt={item.title} className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        <button 
                            onClick={() => dispatch(removeFromWishlist(item.id))}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:text-red-500 text-gray-400 transition-colors" 
                            title="Remove"
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg dark:text-white mb-1">{item.title}</h3>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xl font-bold text-primary">₹{item.price}</span>
                            <button 
                                onClick={() => dispatch(addToCart(item))}
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <FaShoppingCart /> Move to Cart
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
