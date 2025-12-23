import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "../../redux/slices/cartSlice";
import { logout } from "../../redux/slices/authSlice";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser, FaChevronDown } from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

const Navbar = ({ handleOrderPopup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = cartItems.length;
  
  const { settings } = useSettings();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
           const data = await response.json();
           setCategories(data);
        }
      } catch (error) {
         console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Search Logic with API
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        try {
            const response = await fetch(`/api/products?keyword=${encodeURIComponent(searchTerm)}&pageSize=6`);
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.products || []);
            }
        } catch (error) {
            console.error("Search failed", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(""); 
    setSuggestions([]);
  };

  return (
    <div className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm font-outfit transition-colors duration-200">


      {/* Main Navbar */}
      <div className="container py-4 flex items-center justify-between gap-4">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold tracking-tighter hover:text-primary transition-colors dark:text-white">
            {settings?.siteName || "boAt"}
            <span className="text-primary absolute -mt-1 ml-0 text-3xl">.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-black dark:text-gray-200">
            <div className="group relative cursor-pointer flex items-center gap-1 hover:text-primary">
              Categories <FaChevronDown className="text-xs transition-transform group-hover:rotate-180" />
              {/* Dropdown from API */}
              <div className="absolute top-full left-0 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg p-4 w-52 rounded-md mt-2 border border-gray-100 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
                {categories.length > 0 ? categories.map((cat) => (
                    <Link 
                        key={cat._id} 
                        to={`/category/${cat.name}`} 
                        className="block py-2 hover:text-primary dark:text-gray-300 dark:hover:text-primary border-b border-gray-100 dark:border-gray-700 last:border-none"
                    >
                        {cat.name}
                    </Link>
                )) : (
                    <span className="text-gray-400 text-xs">Loading...</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative hidden md:block group">
                <input 
                    type="text" 
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchTerm.trim().length > 0) {
                            setSuggestions([]); // Close suggestions
                            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                        }
                    }}
                    className="bg-gray-100/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm px-4 py-2.5 pl-10 rounded-full w-[300px] lg:w-[400px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                    aria-label="Search Products"
                />
                <IoMdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                
                {suggestions.length > 0 && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                        {suggestions.map((product) => (
                            <Link 
                                to={`/product/${product._id || product.id}`} 
                                key={product._id || product.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                                onClick={() => handleSuggestionClick(product)}
                            >
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex-shrink-0">
                                    <img src={product.images ? product.images[0] : (product.img || '')} alt="" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.name || product.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{product.category}</p>
                                </div>
                                <div className="text-xs font-bold text-primary">
                                    {settings?.currency || "₹"}{product.price}
                                </div>
                            </Link>
                        ))}
                        <div 
                            className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-center text-gray-500 dark:text-gray-300 hover:text-primary cursor-pointer border-t border-gray-100 dark:border-gray-700"
                            onClick={() => {
                                setSuggestions([]);
                                navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                            }}
                        >
                            See all results for "{searchTerm}"
                        </div>
                    </div>
                )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-5 text-black dark:text-white">
                {isAuthenticated ? (
                    <div className="relative group cursor-pointer" onMouseEnter={() => setIsUserMenuOpen(true)} onMouseLeave={() => setIsUserMenuOpen(false)}>
                        <div className="flex items-center gap-2 hover:text-primary transition-colors">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                            </div>
                            <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate capitalize">
                                {user?.name || "User"}
                            </span>
                            <FaChevronDown className={`text-xs transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Menu */}
                        <div className={`absolute top-full right-0 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-xl mt-2 border border-gray-100 dark:border-gray-700 py-2 transition-all duration-200 origin-top-right z-50 ${isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                             <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                             </div>
                             
                             {user?.role === 'admin' && (
                                <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary">
                                    Admin Panel
                                </Link>
                             )}

                             <Link to="/profile?tab=profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary">
                                My Profile
                             </Link>
                             <Link to="/profile?tab=orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary">
                                Orders
                             </Link>
                             
                             <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                <button 
                                    onClick={() => dispatch(logout())}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                                >
                                    Logout
                                </button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        className="text-2xl hover:text-primary transition-colors flex items-center gap-2" 
                        aria-label="Login"
                    >
                        <FaUser className="text-lg" />
                    </Link>
                )}
                
                <button 
                  onClick={() => dispatch(toggleCart())} 
                  className="text-2xl relative hover:text-primary transition-colors"
                  aria-label={`Open Cart, ${cartCount} items`}
                >
                    <FaCartShopping className="text-lg" />
                    {cartCount > 0 && (
                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
                        {cartCount}
                       </span>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
