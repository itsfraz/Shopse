import React, { useState, useEffect } from "react";
import { FaBox, FaUser, FaSignOutAlt, FaMapMarkerAlt, FaHeart, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { logout } from "../redux/slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

const Profile = () => {
  const [params, setParams] = useSearchParams();
  const initialTab = params.get("tab") || "orders";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Sync activeTab with URL params
  useEffect(() => {
    const tab = params.get("tab") || "orders";
    setActiveTab(tab);
  }, [params]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setParams({ tab });
  };

  // Auth Redirect Guard
  useEffect(() => {
    if (!isAuthenticated) {
        navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch Orders
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch('/api/orders/myorders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    setOrderError("Failed to fetch orders");
                }
            } catch (err) {
                console.error(err);
                setOrderError("Something went wrong");
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogout = () => {
      dispatch(logout());
      navigate("/login");
  };

  // Safe Render Handler
  if (!isAuthenticated) return null; 
  // If user is null but authenticated (loading fresh data), show skeleton or spinner
  if (!user && isAuthenticated) return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
  );

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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 font-outfit">
      <div className="container mx-auto max-w-5xl">
         <h1 className="text-3xl font-bold mb-8 dark:text-white">My Account</h1>
         
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm h-fit">
                <div className="flex items-center gap-4 mb-8 px-2">
                    <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <p className="font-bold dark:text-white capitalize text-lg">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-[10px] text-gray-400 mt-1">Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>
                <nav className="space-y-2">
                    <button 
                        onClick={() => handleTabChange("orders")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors font-medium ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaBox /> Orders
                    </button>
                    <button 
                        onClick={() => handleTabChange("profile")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors font-medium ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaUser /> Profile Details
                    </button>
                    <button 
                        onClick={() => handleTabChange("address")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors font-medium ${activeTab === 'address' ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaMapMarkerAlt /> Addresses
                    </button>
                    <button 
                         onClick={() => handleTabChange("wishlist")}
                         className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors font-medium ${activeTab === 'wishlist' ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                    >
                        <FaHeart /> Wishlist
                    </button>
                    <hr className="my-2 border-gray-100 dark:border-gray-700"/>
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                {activeTab === "orders" && (
                    <div className="space-y-6 animate-fade-in-up">
                        <h2 className="text-2xl font-bold dark:text-white">Order History</h2>
                        {loadingOrders ? (
                             <div className="text-center py-10">
                                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                                 <p className="text-gray-500">Loading orders...</p>
                             </div>
                        ) : orderError ? (
                            <div className="text-red-500 text-center py-4">{orderError}</div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                                    <FaBox />
                                </div>
                                <h3 className="text-lg font-bold mb-2 dark:text-white">No Orders Yet</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
                                <button 
                                    onClick={() => navigate('/')} 
                                    className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-black transition-colors shadow-lg"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Order ID</span>
                                            <p className="font-bold font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Date</span>
                                            <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                             <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Total</span>
                                             <p className="font-bold text-primary">₹{order.totalPrice}</p>
                                        </div>
                                         <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {order.orderItems.map((item, i) => (
                                            <div key={i} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex-shrink-0">
                                                    {/* Fallback image if item.img is broken/missing, though backend requires it */}
                                                    <img src={item.img} className="w-full h-full object-contain" alt={item.name} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold dark:text-white line-clamp-1">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                
                {activeTab === "profile" && (
                     <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-8 dark:text-white">Profile Details</h2>
                         <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const profileData = {
                                    name: formData.get('name'),
                                    mobile: formData.get('mobile')
                                };

                                try {
                                    const token = localStorage.getItem("token");
                                    const res = await fetch('/api/auth/profile', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify(profileData)
                                    });
                                    
                                    if (res.ok) {
                                        const updatedUser = await res.json();
                                        // Update Redux state
                                         dispatch({ type: 'auth/login', payload: updatedUser }); 
                                         alert("Profile updated successfully!");
                                    } else {
                                        alert("Failed to update profile.");
                                    }
                                } catch (error) {
                                    console.error(error);
                                    alert("Something went wrong.");
                                }
                            }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Full Name</label>
                                    <input name="name" type="text" defaultValue={user.name} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary transition-all" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Role</label>
                                    <input type="text" defaultValue={user.role} disabled className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed capitalize font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Email Address</label>
                                <input type="email" defaultValue={user.email} disabled className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed font-medium" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</label>
                                <input name="mobile" type="tel" defaultValue={user.mobile || ''} placeholder="Add mobile number" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary transition-all" />
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-colors shadow-lg active:scale-95">Save Changes</button>
                            </div>
                         </form>
                    </div>
                )}

                 {activeTab === "address" && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-2xl font-bold dark:text-white">Saved Addresses</h2>
                             {!isEditingAddress && (
                                <button 
                                    onClick={() => setIsEditingAddress(true)}
                                    className="text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                                >
                                    Update Address
                                </button>
                             )}
                        </div>
                        
                        {!isEditingAddress ? (
                             <div className="border border-green-500 bg-green-50/50 dark:bg-green-900/10 p-6 rounded-xl relative hover:shadow-md transition-shadow">
                                <span className="absolute top-4 right-4 flex h-3 w-3">
                                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                     <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaMapMarkerAlt className="text-green-600" />
                                    <span className="font-bold text-green-700 dark:text-green-400 text-sm uppercase tracking-wider">Current Address</span>
                                </div>
                                <div className="mt-4 space-y-1">
                                    <p className="font-bold text-xl dark:text-white mb-2">{user.name}</p>
                                    {user.address && user.address.street ? (
                                        <>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                                {user.address.street}, {user.address.city}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                                {user.address.state} - {user.address.zip}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mt-1">
                                                {user.address.country}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 italic">No address saved yet.</p>
                                    )}
                                    <p className="text-gray-600 dark:text-gray-300 mt-3 font-medium">Mob: {user.mobile || 'Not provided'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">Email: {user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const addressData = {
                                    street: formData.get('street'),
                                    city: formData.get('city'),
                                    state: formData.get('state'),
                                    zip: formData.get('zip'),
                                    country: formData.get('country')
                                };

                                try {
                                    const token = localStorage.getItem("token");
                                    const res = await fetch('/api/auth/profile', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ address: addressData })
                                    });
                                    
                                    if (res.ok) {
                                        const updatedUser = await res.json();
                                        // Update Redux state
                                        dispatch({ type: 'auth/login', payload: updatedUser }); 
                                        alert("Address updated successfully!");
                                        setIsEditingAddress(false); // Switch back to view mode
                                    } else {
                                        alert("Failed to update address.");
                                    }
                                } catch (error) {
                                    console.error(error);
                                    alert("Something went wrong.");
                                }
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Street Address</label>
                                        <input name="street" defaultValue={user.address?.street || ''} type="text" placeholder="123 Main St" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary transition-all" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">City</label>
                                        <input name="city" defaultValue={user.address?.city || ''} type="text" placeholder="City" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary transition-all" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">State</label>
                                        <input name="state" defaultValue={user.address?.state || ''} type="text" placeholder="State" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary transition-all" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Zip Code</label>
                                        <input name="zip" defaultValue={user.address?.zip || ''} type="text" placeholder="Zip Code" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary transition-all" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Country</label>
                                        <input name="country" defaultValue={user.address?.country || 'India'} type="text" placeholder="Country" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary transition-all" required />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditingAddress(false)}
                                        className="px-6 py-3 rounded-lg font-bold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-colors shadow-lg">
                                        Save Address
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                 )}

                 {activeTab === "wishlist" && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-8 dark:text-white">My Wishlist</h2>
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
