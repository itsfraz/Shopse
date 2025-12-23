import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";

import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Auth check
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
        addToast("Please login to access checkout.", 'warning');
        navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const totalPrice = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const grandTotal = (totalPrice * 1.18).toFixed(2);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ').slice(1).join(' ') || "",
    email: user?.email || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    zip: user?.address?.zip || "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prepare Order Payload
    const orderData = {
        orderItems: cartItems.map(item => ({
            name: item.title || item.name,
            qty: item.quantity,
            image: item.img || (item.images && item.images[0]), // Backend expects 'image' not 'img' sometimes, let's check schema
            price: item.price,
            product: item.id || item._id // ID fallback
        })),
        shippingAddress: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.zip,
            country: 'India'
        },
        paymentMethod: 'Card',
        itemsPrice: totalPrice,
        taxPrice: totalPrice * 0.18,
        shippingPrice: 0,
        totalPrice: parseFloat(grandTotal)
    };

    try {
        let token = localStorage.getItem('token');
        if (token) token = token.replace(/"/g, ''); // Sanitize
        
        if (!token) {
            console.error("Checkout Attempt Failed: No token found in localStorage.");
            addToast("Session expired. Please login again.", 'error');
            dispatch(logout());
            navigate("/login");
            return;
        }

        console.log("Submitting order with token:", token.substring(0, 10) + "...");

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData) 
        });

        if (res.ok) {
            const data = await res.json();
            dispatch(clearCart());
            addToast("Order placed successfully!", 'success');
            navigate('/order-success', { state: { orderId: data._id } });
        } else {
            const errData = await res.json();
            if (res.status === 401) {
                addToast("Session expired. Please login again.", 'error');
                localStorage.removeItem("token");
                dispatch(logout()); // Ensure you import logout
                navigate("/login");
            } else {
                addToast(errData.message || "Order failed", 'error');
            }
        }
    } catch (error) {
        console.error("Order error", error);
        addToast("Something went wrong processing your order.", 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  if(!cartItems || cartItems.length === 0) {
      return (
          <div className="pt-24 text-center">
              <h2 className="text-2xl font-bold">Your cart is empty</h2>
              <Link to="/" className="text-primary underline">Go Home</Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center dark:text-white">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Shipping Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Shipping Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="firstName" 
                  placeholder="First Name" 
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                  onChange={handleChange}
                />
                <input 
                  type="text" 
                  name="lastName" 
                  placeholder="Last Name" 
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                  onChange={handleChange}
                />
              </div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                required
                disabled={isSubmitting}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="address" 
                placeholder="Street Address" 
                required
                disabled={isSubmitting}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="city" 
                  placeholder="City" 
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                  onChange={handleChange}
                />
                <input 
                  type="text" 
                  name="zip" 
                  placeholder="Zip Code" 
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                  onChange={handleChange}
                />
              </div>

               <h2 className="text-xl font-bold mt-8 mb-4 dark:text-white">Payment Info (Mock)</h2>
               <input 
                  type="text" 
                  name="cardName" 
                  placeholder="Name on Card"
                  disabled={isSubmitting} 
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                />
                <div className="relative">
                  <input 
                    type="text" 
                    name="cardNumber" 
                    placeholder="Card Number"
                    disabled={isSubmitting} 
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">VISA</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="expiry" 
                    placeholder="MM/YY"
                    disabled={isSubmitting} 
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                  />
                  <input 
                    type="text" 
                    name="cvv" 
                    placeholder="CVV"
                    disabled={isSubmitting} 
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-primary disabled:opacity-50"
                  />
                </div>
            </form>
          </div>

          {/* Order Summary Side */}
          <div className="space-y-6">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Your Order</h2>
                <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img src={item.img || (item.images && item.images[0])} alt={item.title || item.name} className="w-12 h-12 object-contain bg-white rounded-md p-1" />
                                <div>
                                    <h4 className="font-bold text-sm dark:text-white line-clamp-1">{item.title || item.name}</h4>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                
                <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4"></div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{totalPrice}</span>
                    </div>
                     <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span className="text-green-500">Free</span>
                    </div>
                     <div className="flex justify-between text-lg font-bold dark:text-white mt-4">
                        <span>Total (Inc. Tax)</span>
                        <span>₹{grandTotal}</span>
                    </div>
                </div>

                <button 
                    type="submit" 
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Processing Payment...' : `Pay ₹${grandTotal}`}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
