import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import CartSidebar from "./components/CartSidebar/CartSidebar"; 
import AOS from "aos";
import "aos/dist/aos.css";

import MobileBottomBar from "./components/Navbar/MobileBottomBar";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy loading pages
const Home = lazy(() => import("./pages/Home"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Profile = lazy(() => import("./pages/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const SearchPage = lazy(() => import("./pages/SearchPage"));

const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/authSlice";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      // Fix: If no token but we think we are logged in, force logout to clear stale state
      if (!token) {
          dispatch(logout());
          return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const userData = await res.json();
          // Sync Redux with fresh data from server
          dispatch(login(userData)); 
        } else {
          // Token invalid/expired
          localStorage.removeItem("token");
          // Also clear user from localStorage (handled by logout reducer)
          dispatch(logout());
        }
      } catch (error) {
         console.error("Auth check failed", error);
      }
    };
    
    checkAuth();
  }, [dispatch]);

  // Redux replaced local state for Cart and Wishlist
  
  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar handleOrderPopup={handleOrderPopup} />
        
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={
              <Home 
                handleOrderPopup={handleOrderPopup} 
                orderPopup={orderPopup} 
                setOrderPopup={setOrderPopup} 
              />
            } />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Suspense>

        <Footer />
        <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        <CartSidebar />
        <MobileBottomBar />
      </div>
    </BrowserRouter>
  );
};

export default App;
