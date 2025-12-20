import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Form, 2: OTP
    const [otp, setOtp] = useState(["", "", "", ""]);
  
    const handleSignup = (e) => {
      e.preventDefault();
      setStep(2);
    };

    const handleOtpChange = (element, index) => {
        if(isNaN(element.value)) return false;
        
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        
        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        navigate("/");
    }
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-20">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {step === 1 ? (
            <>
                <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">Create Account</h2>
                <p className="text-center text-gray-500 mb-8">Join us for the best shopping experience</p>
                
                <form onSubmit={handleSignup} className="space-y-4">
                    <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" />
                    <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" />
                    <input type="password" placeholder="Password" required className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" />
                    <input type="tel" placeholder="Mobile Number" required className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-primary" />
                    
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-colors mt-4">
                        Sign Up
                    </button>
                </form>
        
                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
                </div>
            </>
        ) : (
            <>
                <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">Verify OTP</h2>
                <p className="text-center text-gray-500 mb-8">Enter the 4-digit code sent to your mobile</p>
                
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="flex justify-center gap-4">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                name="otp"
                                maxLength="1"
                                value={data}
                                onChange={e => handleOtpChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                className="w-12 h-12 text-center text-2xl font-bold border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-primary focus:outline-none"
                            />
                        ))}
                    </div>
                    
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-colors">
                        Verify & Proceed
                    </button>

                    <div className="text-center">
                        <button type="button" className="text-sm text-gray-500 hover:text-primary underline">Resend OTP</button>
                    </div>
                </form>
            </>
        )}
        </div>
      </div>
    );
  };
  
  export default Signup;
