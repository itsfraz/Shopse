import React, { useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Added useSelector

const Signup = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth); // Auth state

    useEffect(() => {
        if(isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobile: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { name, email, password, mobile } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSignup = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        let data;
        try {
            data = await res.json();
        } catch (e) {
             console.error("JSON Parse error", e);
             throw new Error("Server error: " + res.statusText);
        }

        if (res.ok) {
            // Registration successful
            // You might want to store the token here if you auto-login
            // localStorage.setItem('token', data.accessToken); 
            // For now, let's redirect to login
            alert("Account created successfully!");
            navigate("/login");
        } else {
            setError(data.message || "Registration failed");
            if(data.errors && Array.isArray(data.errors)) {
                setError(data.errors.map(err => err.msg).join(', '));
            }
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-20">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        
            <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">Create Account</h2>
            <p className="text-center text-gray-500 mb-8">Join us for the best shopping experience</p>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">{error}</div>}

            <form onSubmit={handleSignup} className="space-y-4">
                <input 
                    type="text" 
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Full Name" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" 
                />
                <input 
                    type="email" 
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email Address" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" 
                />
                <input 
                    type="password" 
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" 
                />
                <input 
                    type="tel" 
                    name="mobile"
                    value={mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number" 
                    className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" 
                />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-colors mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
    
            <div className="mt-8 text-center text-sm text-gray-500">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
            </div>
        
        </div>
      </div>
    );
  };
  
  export default Signup;
