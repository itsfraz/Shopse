import React from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, toggleCart } from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { cartItems, isCartOpen } = useSelector((state) => state.cart);
  
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-[60]
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={() => dispatch(toggleCart())} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <FaTimes size={20} />
        </button>
      </div>
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 120px)' }}>
        {cartItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-4 border-gray-200 dark:border-gray-700 last:border-b-0">
              <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-md mr-4" />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price} x {item.quantity}</p>
                <div className="flex items-center mt-1">
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                    className="px-2 py-1 border border-gray-300 rounded-md dark:border-gray-600 dark:text-white disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="mx-2 text-gray-700 dark:text-gray-300">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="px-2 py-1 border border-gray-300 rounded-md dark:border-gray-600 dark:text-white"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-semibold">₹{totalPrice.toFixed(2)}</span>
        </div>
        <Link to="/checkout" onClick={() => dispatch(toggleCart())} className="block w-full bg-primary text-center text-white py-2 rounded-md hover:bg-primary/80 transition-colors duration-200">
          Proceed to Checkout
        </Link>
        <Link to="/cart" onClick={() => dispatch(toggleCart())} className="block w-full text-center text-primary border border-primary mt-2 py-2 rounded-md hover:bg-primary/10 transition-colors duration-200">
          View Cart
        </Link>
      </div>
    </div>
  );
};

export default CartSidebar;