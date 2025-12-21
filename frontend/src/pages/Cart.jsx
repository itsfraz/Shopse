import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
          alt="Empty Cart" 
          className="w-48 h-48 opacity-50 mb-6"
        />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/" 
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all shadow-lg"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 cursor-pointer hover:text-primary transition-colors font-medium w-fit" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            <span>Back to Shopping</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 dark:text-white font-outfit">Your Cart <span className="text-gray-400 text-2xl font-normal ml-2">({cartItems.length} items)</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex gap-4 items-center"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center p-2">
                  <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg dark:text-white line-clamp-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                  <p className="font-bold text-primary text-lg">₹{item.price}</p>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove Item"
                  >
                    <FaTrash />
                  </button>

                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <button 
                      onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.id))}
                      className="px-3 py-1 hover:text-primary transition-colors"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="font-bold w-6 text-center text-sm dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="px-3 py-1 hover:text-primary transition-colors"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (GST)</span>
                <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex justify-between text-xl font-bold dark:text-white">
                <span>Total</span>
                <span>₹{(totalPrice * 1.18).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                const isAuthenticated = localStorage.getItem("token"); // Simple check or use Redux
                if (!isAuthenticated) {
                    alert("Please login to place an order!");
                    navigate("/login");
                } else {
                    navigate("/checkout");
                }
              }}
              className="w-full block text-center bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
