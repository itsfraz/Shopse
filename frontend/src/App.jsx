import React, { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import CartSidebar from "./components/CartSidebar/CartSidebar"; 
import MobileBottomBar from "./components/Navbar/MobileBottomBar";
import AOS from "aos";
import "aos/dist/aos.css";

import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/authSlice";

// Admin Imports
const AdminGuard = lazy(() => import("./admin/components/AdminGuard"));
// Lazy load Admin Pages
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const ProductManagement = lazy(() => import("./admin/pages/ProductManagement"));
const OrderManagement = lazy(() => import("./admin/pages/OrderManagement"));
const UsersManagement = lazy(() => import("./admin/pages/UsersManagement"));
const Settings = lazy(() => import("./admin/pages/Settings"));
const Analytics = lazy(() => import("./admin/pages/Analytics"));
const CategoryManagement = lazy(() => import("./admin/pages/CategoryManagement"));

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
const DynamicPage = lazy(() => import("./pages/DynamicPage"));

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

// User Layout Component
const UserLayout = ({ handleOrderPopup, orderPopup, setOrderPopup }) => {
    return (
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
            <Navbar handleOrderPopup={handleOrderPopup} />
            <Outlet />
            <Footer />
            <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
            <CartSidebar />
            <MobileBottomBar />
        </div>
    );
};

import { SettingsProvider } from "./context/SettingsContext";

import { ToastProvider } from "./context/ToastContext";

const App = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem("token");
      
      if (!token) {
          dispatch(logout());
          return;
      }

      try {
        // 1. Try to fetch user with current token
        let res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // 2. If 401, token might be expired. Try to refresh.
        if (res.status === 401) {
             console.log("Access Token expired, attempting refresh...");
             try {
                 const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
                 
                 if (refreshRes.ok) {
                     const data = await refreshRes.json();
                     token = data.accessToken;
                     console.log("Token refreshed successfully.");
                     
                     // Update LocalStorage
                     localStorage.setItem("token", token);
                     
                     // Retry User Fetch with new token
                     res = await fetch('/api/auth/me', {
                        headers: {
                           'Authorization': `Bearer ${token}`
                        }
                     });
                 } else {
                     console.warn("Refresh failed, logging out.");
                     localStorage.removeItem("token");
                     dispatch(logout());
                     return;
                 }
             } catch (refreshErr) {
                 console.error("Error during token refresh:", refreshErr);
                 localStorage.removeItem("token");
                 dispatch(logout());
                 return;
             }
        }

        if (res.ok) {
          const userData = await res.json();
          dispatch(login(userData)); 
        } else {
          // If still not ok after refresh attempt
          localStorage.removeItem("token");
          dispatch(logout());
        }
      } catch (error) {
         console.error("Auth check failed", error);
         // Optionally logout on network error if strict
      }
    };
    
    checkAuth();
  }, [dispatch]);
  
  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
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
     <SettingsProvider>
      <ToastProvider>
        <ScrollToTop />
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-outfit">
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                      <Route index element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<ProductManagement />} />
                      <Route path="orders" element={<OrderManagement />} />
                      <Route path="users" element={<UsersManagement />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="categories" element={<CategoryManagement />} />
                  </Route>
              </Route>

              {/* Consumer App Routes */}
              <Route element={<UserLayout handleOrderPopup={handleOrderPopup} orderPopup={orderPopup} setOrderPopup={setOrderPopup} />}>
                  <Route path="/" element={<Home handleOrderPopup={handleOrderPopup} />} />
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
                  <Route path="/:slug" element={<DynamicPage />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </ToastProvider>
     </SettingsProvider>
    </BrowserRouter>
  );
};

export default App;
