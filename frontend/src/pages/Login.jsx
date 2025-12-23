import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";

import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Get auth state
  const { addToast } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        let data;
        try {
            data = await res.json();
        } catch (parseError) {
             console.error("Failed to parse JSON:", parseError);
             throw new Error("Server returned an invalid response. Check backend logs.");
        }

        if (res.ok) {
            // Validate token existence
            if (!data.accessToken) {
                console.error("Login successful but no accessToken received!", data);
                setError("Login failed: No access token received from server.");
                addToast("Login failed: No access token received from server.", 'error');
                setLoading(false);
                return;
            }

            console.log("Login Successful. Token received:", data.accessToken.substring(0, 10) + "...");

            // Save token
            localStorage.setItem('token', data.accessToken);
            

            // Dispatch to Redux (saves to localStorage 'user' too via slice logic)
            dispatch(login({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                mobile: data.mobile
            }));
            
            addToast(`Welcome back, ${data.name}!`, 'success');

            if (data.role === 'admin') {
                navigate("/admin/dashboard");
            } else {
                navigate("/"); 
            } 
        } else {
            setError(data.message || "Login failed");
            addToast(data.message || "Login failed", 'error');
        }
    } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
        addToast("Something went wrong. Please try again.", 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Login to continue shopping</p>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary"
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary"
                    placeholder="••••••••"
                />
                <div className="text-right mt-1">
                    <a href="#" className="text-xs text-primary hover:underline">Forgot Password?</a>
                </div>
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
