import React, { useState } from "react";
import { FaBox, FaUser, FaSignOutAlt, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const WishlistGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wishlistItems.length === 0 ? <p className="text-gray-500">Your wishlist is empty.</p> : wishlistItems.map((item) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3 group relative">
                <button 
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                >
                    <FaTrash />
                </button>
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center p-4">
                    <img src={item.img} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                     <h4 className="font-bold dark:text-white line-clamp-1">{item.title}</h4>
                     <p className="text-primary font-bold">₹{item.price}</p>
                </div>
                <button 
                    onClick={() => dispatch(addToCart(item))}
                    className="w-full bg-black text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800"
                >
                    Move to Cart
                </button>
            </div>
        ))}
    </div>
  );

  const OrderCard = ({ id, date, status, total, items }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        <div className="flex justify-between items-start mb-4">
            <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Order ID</span>
                <p className="font-bold">#{id}</p>
            </div>
             <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{date}</p>
            </div>
        </div>
        <div className="space-y-2 mb-4">
            {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                    <img src={item.img} className="w-10 h-10 rounded bg-gray-100 object-cover" alt="" />
                    <div className="text-sm">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.qty}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="pt-3 border-t dark:border-gray-700 flex justify-between items-center">
            <p className="font-bold">Total: ₹{total}</p>
            <button className="text-primary text-sm font-semibold hover:underline">View Details</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
         <h1 className="text-3xl font-bold mb-8 dark:text-white">My Account</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                        JD
                    </div>
                    <div>
                        <p className="font-bold dark:text-white">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                    </div>
                </div>
                <nav className="space-y-2">
                    <button 
                        onClick={() => setActiveTab("orders")}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaBox /> Orders
                    </button>
                    <button 
                        onClick={() => setActiveTab("profile")}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaUser /> Profile Details
                    </button>
                    <button 
                        onClick={() => setActiveTab("address")}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'address' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaMapMarkerAlt /> Addresses
                    </button>
                    {/* Add Wishlist Link or Tab */}
                    <button 
                         onClick={() => setActiveTab("wishlist")}
                         className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'wishlist' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaHeart /> Wishlist
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
                {activeTab === "orders" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Order History</h2>
                        <OrderCard 
                            id="48291" 
                            date="Dec 12, 2024" 
                            status="Delivered" 
                            total="1,499" 
                            items={[{name: "Rockerz 450", qty: 1, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"}]}
                        />
                        <OrderCard 
                            id="48852" 
                            date="Dec 20, 2024" 
                            status="Processing" 
                            total="2,999" 
                            items={[{name: "Xtend Smartwatch", qty: 1, img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a"}]}
                        />
                    </div>
                )}
                {activeTab === "profile" && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6 dark:text-white">Profile Details</h2>
                         <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Email</label>
                                <input type="email" defaultValue="john@example.com" disabled className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Phone</label>
                                <input type="tel" defaultValue="+91 98765 43210" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-black transition-colors">Save Changes</button>
                         </form>
                    </div>
                )}
                 {activeTab === "address" && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-xl font-bold dark:text-white">Saved Addresses</h2>
                             <button className="text-primary font-bold text-sm">+ Add New</button>
                        </div>
                        <div className="border border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg relative">
                            <span className="absolute top-2 right-2 flex h-3 w-3">
                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <p className="font-bold dark:text-white">Home</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">123, Main Street, Tech Park Area, Bangalore, 560001</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Phone: +91 98765 43210</p>
                        </div>
                    </div>
                 )}
                 {activeTab === "wishlist" && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6 dark:text-white">My Wishlist</h2>
                        <WishlistGrid />
                    </div>
                 )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
