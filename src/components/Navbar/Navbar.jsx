import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "../../redux/slices/cartSlice";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser, FaChevronDown } from "react-icons/fa"; 
import ProductsData from "../../data/products";
import { Link } from "react-router-dom";

const Navbar = ({ handleOrderPopup }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.length;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        const filteredSuggestions = ProductsData.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
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
            <div className="relative hidden md:block">
                <input 
                    type="text" 
                    placeholder="Search Products"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="bg-gray-100 text-sm px-4 py-2 pl-10 rounded-full w-[250px] focus:outline-none focus:ring-1 focus:ring-black"
                    aria-label="Search Products"
                />
                <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                
                {suggestions.length > 0 && (
                    <ul className="absolute left-0 top-12 w-full bg-white text-black border border-gray-100 rounded-md shadow-lg z-50">
                    {suggestions.map((product) => (
                        <Link 
                            to={`/product/${product.id}`} 
                            key={product.id}
                            className="block px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm"
                            onClick={() => {
                                handleSuggestionClick(product);
                            }}
                        >
                            {product.title}
                        </Link>
                    ))}
                    </ul>
                )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-5">
                <Link to="/login" className="text-2xl hover:text-primary transition-colors" aria-label="Login or User Profile">
                    <FaUser className="text-lg" />
                </Link>
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
