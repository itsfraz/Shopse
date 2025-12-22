import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsData from "../data/products";
import { FaStar, FaShoppingCart, FaHeart, FaTruck, FaShieldAlt, FaMinus, FaPlus } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/slices/wishlistSlice";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
        setLoading(true);
        try {
            // First try fetching from API
            const response = await fetch(`/api/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
                setSelectedImage(data.images ? data.images[0] : data.img);
            } else {
                // Fallback to mock data if API fails or not found (legacy support)
                const foundProduct = ProductsData.find((item) => item.id === parseInt(id));
                if (foundProduct) {
                    setProduct(foundProduct);
                    setSelectedImage(foundProduct.img);
                } else {
                    setProduct(null);
                }
            }
        } catch (error) {
             console.error("Error fetching product", error);
             // Fallback
             const foundProduct = ProductsData.find((item) => item.id === parseInt(id));
             setProduct(foundProduct || null);
             if (foundProduct) setSelectedImage(foundProduct.img);
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button 
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-black transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const isItemInCart = cartItems?.some((item) => item.id === product.id);
  const cartItem = cartItems?.find((item) => item.id === product.id);

  // Mock Data for Gallery
  // Handle Gallery Images (Backend 'images' array vs Mock 'img' string)
  const galleryImages = product.images && product.images.length > 0 
      ? product.images 
      : [product.img, product.img, product.img, product.img].filter(Boolean);

  return (
    <div className="min-h-screen pt-14 pb-10 bg-gray-50 dark:bg-gray-900 dark:text-white font-outfit">
      <div className="container mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
            <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Home</span> / 
            <span className="cursor-pointer hover:text-primary" onClick={() => navigate(`/category/${product.category}`)}> {product.category}</span> / 
            <span className="font-semibold text-black dark:text-white"> {product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-[400px] md:h-[500px] flex items-center justify-center shadow-sm relative overflow-hidden group">
                    <img 
                        src={selectedImage} 
                        alt={product.title} 
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        Best Seller
                    </div>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                    {galleryImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedImage(img)}
                            className={`w-20 h-20 bg-white dark:bg-gray-800 rounded-lg p-2 cursor-pointer border-2 transition-all ${selectedImage === img && idx === 0 ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                        >
                             <img src={img} alt="" className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col gap-5">
                <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">{product.name || product.title}</h1>
                   <p className="text-gray-500 text-sm font-medium">{product.category} with Environment Noise Cancellation</p> 
                </div>

                <div className="flex items-center gap-4">
                     <span className="text-xs font-bold bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-black dark:text-white">{product.rating} ★</span>
                     <span className="text-sm text-blue-600 font-semibold cursor-pointer">256 Reviews</span>
                     <span className="text-sm text-green-600 font-semibold">In Stock</span>
                </div>

                <div className="flex items-end gap-3 border-b pb-6 border-gray-200 dark:border-gray-700">
                    <span className="text-4xl font-bold text-black dark:text-white">₹{product.price}</span>
                    <span className="text-xl text-gray-400 line-through decoration-gray-400 mb-1">₹{product.price * 2}</span>
                    <span className="text-green-600 font-bold bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded text-sm mb-2">50% OFF</span>
                </div>

                {/* Color Selection */}
                <div>
                    <h3 className="font-bold mb-3">Choose Color</h3>
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 ring-black cursor-pointer"></div>
                         <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer hover:ring-2 ring-offset-2 ring-blue-600"></div>
                         <div className="w-8 h-8 rounded-full bg-red-600 cursor-pointer hover:ring-2 ring-offset-2 ring-red-600"></div>
                    </div>
                </div>

                {/* Cart Actions */ }
                {isItemInCart ? (
                    <div className="flex items-center gap-4 mt-2">
                         <div className="flex items-center border-2 border-primary rounded-lg">
                             <button
                                onClick={() => {
                                    if (cartItem.quantity > 1) dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 }));
                                    else dispatch(removeFromCart(cartItem.id));
                                }}
                                className="px-4 py-3 text-primary hover:bg-primary hover:text-white transition-colors"
                             >
                                <FaMinus />
                             </button>
                             <span className="px-4 py-3 font-bold text-lg min-w-[50px] text-center">{cartItem.quantity}</span>
                             <button
                                onClick={() => dispatch(addToCart(product))}
                                className="px-4 py-3 text-primary hover:bg-primary hover:text-white transition-colors"
                             >
                                <FaPlus />
                             </button>
                         </div>
                         <button 
                             onClick={() => navigate('/cart')}
                             className="flex-1 bg-black text-white py-3.5 px-6 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-lg text-center"
                         >
                            Go to Cart
                         </button>
                    </div>
                ) : (
                    <div className="flex gap-4 mt-2">
                        <button 
                            onClick={() => dispatch(addToCart(product))}
                            className="flex-1 bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95 text-lg"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={() => {
                                if (wishlistItems?.find(item => item.id === product.id)) {
                                     dispatch(removeFromWishlist(product.id));
                                } else {
                                     dispatch(addToWishlist(product));
                                }
                            }}
                            className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                             {wishlistItems?.find(item => item.id === product.id) ? (
                                 <FaHeart className="text-red-500 text-xl" />
                             ) : (
                                 <FaHeart className="text-gray-400 text-xl" />
                             )}
                        </button>
                    </div>
                )}
                
                {/* Trust Badges */}
                <div className="grid grid-cols-4 gap-2 text-center mt-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-dashed border-gray-300">
                    <div className="flex flex-col items-center gap-1">
                        <FaTruck className="text-primary text-xl" />
                        <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300">Free Shipping</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <FaShieldAlt className="text-primary text-xl" />
                        <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300">1 Year Warranty</span>
                    </div>
                     <div className="flex flex-col items-center gap-1">
                        <FaShieldAlt className="text-primary text-xl" />
                        <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300">Secure Checkout</span>
                    </div>
                     <div className="flex flex-col items-center gap-1">
                        <FaTruck className="text-primary text-xl" />
                        <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300">Easy Returns</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <div className="mt-16">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                {["description", "specifications", "reviews"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-4 font-bold text-lg capitalize transition-all border-b-2 relative -bottom-[2px] ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-black'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="min-h-[200px] text-gray-600 dark:text-gray-300 leading-relaxed">
                {activeTab === "description" && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Product Description</h3>
                        <p>{product.description || `Experience the signature boAt sound with the new ${product.name || product.title}. Designed for the audiophiles who refuse to compromise on quality, comfort, or style. With a playback time of up to 60 hours, enjoy uninterrupted music for days.`}</p>
                        <p>Equipped with the latest Bluetooth v5.3 for seamless connectivity and ASAP Charge technology that gives you 10 hours of playtime in just 10 minutes of charge.</p>
                        <h4 className="text-lg font-bold text-black dark:text-white mt-4">Key Features:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Signature boAt BassHeads Sound</li>
                            <li>Premium Ergonomic Design</li>
                            <li>IPX5 Water & Sweat Resistance</li>
                            <li>Integrated Controls with Voice Assistant</li>
                        </ul>
                    </div>
                )}
                {activeTab === "specifications" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                            <span className="font-semibold">Bluetooth Version</span>
                            <span>v5.3</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                            <span className="font-semibold">Battery Life</span>
                            <span>Up to 60 Hours</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                            <span className="font-semibold">Charging Time</span>
                            <span>1.5 Hours</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                            <span className="font-semibold">Driver Size</span>
                            <span>10mm / 40mm (Model specific)</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                            <span className="font-semibold">Water Resistance</span>
                            <span>IPX5</span>
                        </div>
                         <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                            <span className="font-semibold">Warranty</span>
                            <span>1 Year from Date of Purchase</span>
                        </div>
                    </div>
                )}
                {activeTab === "reviews" && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                             <div className="text-center">
                                 <h2 className="text-5xl font-bold text-black dark:text-white mb-1">4.8</h2>
                                 <div className="flex justify-center text-yellow-400 gap-1 text-sm"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                 <p className="text-xs mt-2">Based on 256 Reviews</p>
                             </div>
                             <div className="flex-1 border-l pl-6 border-gray-300 dark:border-gray-600">
                                 {/* Progress bars would go here */}
                                 <div className="text-sm font-semibold">90% Recommended this product</div>
                             </div>
                        </div>

                        {/* Dummy Reviews */}
                        {[1, 2].map((review) => (
                             <div key={review} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xs text-black">JD</div>
                                        <span className="font-bold text-black dark:text-white">John Doe</span>
                                        <div className="flex text-yellow-400 text-xs ml-2"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                    </div>
                                    <span className="text-xs text-gray-400">2 days ago</span>
                                </div>
                                <h4 className="font-bold text-sm mb-1">Absolutely Amazing!</h4>
                                <p className="text-sm">The sound quality is top-notch, especially the bass. Battery backup is insane, I typically charge it once a week. fast delivery by boAt as always.</p>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Related Products Section (Placeholder for now) */}
         {/* Could reuse Products component with limit and category filter here */}
      </div>
    </div>
  );
};

export default ProductDetails;
