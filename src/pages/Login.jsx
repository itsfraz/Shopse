import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Validate credentials (mock)
    if(email && password) {
        navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Login to continue shopping</p>
        
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
            
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-colors">
                Login
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
