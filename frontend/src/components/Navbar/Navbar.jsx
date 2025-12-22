import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "../../redux/slices/cartSlice";
import { logout } from "../../redux/slices/authSlice";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser, FaChevronDown } from "react-icons/fa"; 
import ProductsData from "../../data/products";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ handleOrderPopup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = cartItems.length;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        const lowerTerm = searchTerm.toLowerCase().trim();
        
        const filteredSuggestions = ProductsData.filter((product) =>
             product.title.toLowerCase().includes(lowerTerm) || 
             product.category.toLowerCase().includes(lowerTerm) ||
             (product.color && product.color.toLowerCase().includes(lowerTerm))
        ).slice(0, 6); // Limiting to top 6 results
        
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 200); // Faster 200ms debounce for "realtime" feel

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(""); // Clear search bar after selection or keep title? Usually clear or set to title.
    setSuggestions([]);
  };

  return (
    <div className="bg-white sticky top-0 z-50 shadow-sm font-outfit">
      {/* Announcement Bar */}
      <div className="bg-gray-100 text-center text-xs font-medium py-2">
        Get 5% off on your first order. Use Code: <span className="font-bold">BOATHEAD</span>
      </div>

      {/* Main Navbar */}
      <div className="container py-4 flex items-center justify-between gap-4">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold tracking-tighter hover:text-primary transition-colors">
            boAt
            <span className="text-primary absolute -mt-1 ml-0 text-3xl">.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-black">
            <div className="group relative cursor-pointer flex items-center gap-1 hover:text-primary">
              Categories <FaChevronDown className="text-xs transition-transform group-hover:rotate-180" />
              {/* Simple dropdown placeholder */}
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg p-4 w-52 rounded-md mt-2 border z-50">
                <Link to="/category/True%20Wireless%20Earbuds" className="block py-1 hover:text-primary">True Wireless Earbuds</Link>
                <Link to="/category/Wireless%20Headphones" className="block py-1 hover:text-primary">Wireless Headphones</Link>
                <Link to="/category/Smart%20Watches" className="block py-1 hover:text-primary">Smart Watches</Link>
                <Link to="/category/Neckbands" className="block py-1 hover:text-primary">Neckbands</Link>
                <Link to="/category/Wireless%20Speakers" className="block py-1 hover:text-primary">Wireless Speakers</Link>
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
                    placeholder="Search for products, brands and more"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchTerm.trim().length > 0) {
                            setSuggestions([]); // Close suggestions
                            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                        }
                    }}
                    className="bg-gray-100/50 border border-gray-200 text-sm px-4 py-2.5 pl-10 rounded-full w-[300px] lg:w-[400px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    aria-label="Search Products"
                />
                <IoMdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                
                {suggestions.length > 0 && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white text-black border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                        {suggestions.map((product) => (
                            <Link 
                                to={`/product/${product.id}`} 
                                key={product.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                onClick={() => handleSuggestionClick(product)}
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-md p-1 flex-shrink-0">
                                    <img src={product.img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{product.category}</p>
                                </div>
                                <div className="text-xs font-bold text-primary">
                                    ₹{product.price}
                                </div>
                            </Link>
                        ))}
                        <div 
                            className="bg-gray-50 px-4 py-2 text-xs text-center text-gray-500 hover:text-primary cursor-pointer border-t border-gray-100"
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
            <div className="flex items-center gap-5">
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
                        <div className={`absolute top-full right-0 w-48 bg-white shadow-xl rounded-xl mt-2 border border-gray-100 py-2 transition-all duration-200 origin-top-right z-50 ${isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                             <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                             </div>
                             
                             <Link to="/profile?tab=profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                                My Profile
                             </Link>
                             <Link to="/profile?tab=orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                                Orders
                             </Link>
                             
                             <div className="border-t border-gray-100 mt-2 pt-2">
                                <button 
                                    onClick={() => dispatch(logout())}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
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
