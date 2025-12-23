import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsData from "../data/products";
import { FaStar, FaShoppingCart, FaHeart, FaTruck, FaShieldAlt, FaMinus, FaPlus, FaCheck } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/slices/wishlistSlice";

import { useToast } from '../context/ToastContext';
import Skeleton from '../components/common/Skeleton';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
    const { user } = useSelector((state) => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("description");
    const [selectedImage, setSelectedImage] = useState(null);
    
    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    
    const { addToast } = useToast();

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
                setSelectedImage(data.images && data.images.length > 0 ? data.images[0] : (data.img || ''));
            } else {
                // Fallback
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
             const foundProduct = ProductsData.find((item) => item.id === parseInt(id));
             setProduct(foundProduct || null);
             if (foundProduct) setSelectedImage(foundProduct.img);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            addToast("Please login to write a review", "error");
            navigate("/login");
            return;
        }
        setSubmittingReview(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/products/${id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });

            const data = await res.json();

            if (res.ok) {
                addToast("Review submitted successfully! Pending approval.", "success");
                setComment("");
                setRating(5);
                // Optionally refetch product to show pending state if implemented, 
                // but usually we wait for approval.
            } else {
                addToast(data.message || "Failed to submit review", "error");
            }
        } catch (error) {
            console.error(error);
            addToast("Something went wrong", "error");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-14 pb-10 bg-gray-50 dark:bg-gray-900 px-4">
                <div className="container mx-auto py-6">
                    <Skeleton className="h-4 w-48 mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <Skeleton className="h-[400px] w-full rounded-2xl" />
                            <div className="flex gap-4 justify-center">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="w-20 h-20 rounded-lg border-2 border-transparent" />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 pt-4">
                            <Skeleton className="h-10 w-3/4 border-2 border-transparent" />
                            <Skeleton className="h-5 w-1/2" />
                            <div className="flex gap-4">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <div className="border-b pb-6 border-gray-200 dark:border-gray-700">
                                <Skeleton className="h-10 w-32 mb-2" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                             <Skeleton className="h-8 w-1/3 mb-2" />
                             <div className="flex gap-3">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-8 h-8 rounded-full" />
                             </div>
                            <div className="flex gap-4 mt-6">
                                 <Skeleton className="flex-1 h-14 rounded-lg" />
                                 <Skeleton className="w-14 h-14 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
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

    const isItemInCart = cartItems?.some((item) => item.id === product._id || item.id === product.id);
    const cartItem = cartItems?.find((item) => item.id === product._id || item.id === product.id);
    const productId = product._id || product.id; // Normalize ID

    // Normalize Images
    const galleryImages = product.images && product.images.length > 0 
        ? product.images 
        : [product.img].filter(Boolean);

    // Reviews (Filter approved)
    const activeReviews = product.reviews ? product.reviews.filter(r => r.isApproved) : [];

    return (
        <div className="min-h-screen pt-14 pb-10 bg-gray-50 dark:bg-gray-900 dark:text-white font-outfit">
            <div className="container mx-auto px-4 py-6">
                
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Home</span> / 
                    <span className="cursor-pointer hover:text-primary" onClick={() => navigate(`/category/${product.category}`)}> {product.category}</span> / 
                    <span className="font-semibold text-black dark:text-white"> {product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-[400px] md:h-[500px] flex items-center justify-center shadow-sm relative overflow-hidden group">
                            <img 
                                src={selectedImage} 
                                alt={product.name} 
                                className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                            {product.isFeatured && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                    Best Seller
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 justify-center custom-scrollbar">
                            {galleryImages.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                                >
                                     <img src={img} alt="" className="w-full h-full object-contain" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col gap-5">
                        <div>
                           <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">{product.name}</h1>
                           <p className="text-gray-500 text-sm font-medium">{product.category}</p> 
                        </div>

                        <div className="flex items-center gap-4">
                             <span className="text-xs font-bold bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded flex items-center gap-1">
                                {product.rating ? product.rating.toFixed(1) : "New"} <FaStar size={10} />
                             </span>
                             <span className="text-sm text-blue-600 font-semibold cursor-pointer border-b border-blue-600 border-dashed hover:border-solid">
                                {product.numReviews || 0} Reviews
                             </span>
                             {product.stock > 0 ? (
                                <span className="text-sm text-green-600 font-semibold flex items-center gap-1"><FaCheck size={12} /> In Stock</span>
                             ) : (
                                <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
                             )}
                        </div>

                        <div className="flex items-end gap-3 border-b pb-6 border-gray-200 dark:border-gray-700">
                            <span className="text-4xl font-bold text-black dark:text-white">₹{product.price}</span>
                            {product.discountPrice > 0 && (
                                <>
                                    <span className="text-xl text-gray-400 line-through decoration-gray-400 mb-1">₹{product.price + product.discountPrice}</span>
                                    <span className="text-green-600 font-bold bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded text-sm mb-2">
                                        {Math.round((product.discountPrice / (product.price + product.discountPrice)) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description Preview */}
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                            {product.description}
                        </p>

                        {/* Cart Actions */ }
                        {isItemInCart ? (
                            <div className="flex items-center gap-4 mt-2">
                                 <div className="flex items-center border-2 border-black dark:border-white rounded-lg">
                                     <button
                                        onClick={() => {
                                            if (cartItem.quantity > 1) {
                                                dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 }));
                                            } else {
                                                dispatch(removeFromCart(cartItem.id));
                                                addToast("Removed from cart", "info");
                                            }
                                        }}
                                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                     >
                                        <FaMinus />
                                     </button>
                                     <span className="px-4 py-3 font-bold text-lg min-w-[50px] text-center">{cartItem.quantity}</span>
                                     <button
                                        onClick={() => {
                                            if(product.stock > cartItem.quantity) {
                                                dispatch(addToCart(product));
                                                addToast("Quantity updated", "success");
                                            } else {
                                                addToast("Max stock reached", "error");
                                            }
                                        }}
                                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                     >
                                        <FaPlus />
                                     </button>
                                 </div>
                                 <button 
                                     onClick={() => navigate('/cart')}
                                     className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3.5 px-6 rounded-lg font-bold hover:opacity-90 transition-all shadow-lg text-center"
                                 >
                                    Go to Cart
                                 </button>
                            </div>
                        ) : (
                            <div className="flex gap-4 mt-2">
                                <button 
                                    onClick={() => {
                                        if (product.stock > 0) {
                                            dispatch(addToCart(product));
                                            addToast("Added to cart!", "success");
                                        } else {
                                            addToast("Out of stock", "error");
                                        }
                                    }}
                                    disabled={product.stock <= 0}
                                    className={`flex-1 py-4 px-6 rounded-lg font-bold transition-all shadow-xl active:scale-95 text-lg ${product.stock > 0 ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button 
                                    onClick={() => {
                                        if (wishlistItems?.find(item => item.id === productId)) {
                                             dispatch(removeFromWishlist(productId));
                                             addToast("Removed from wishlist", "info");
                                        } else {
                                             dispatch(addToWishlist(product));
                                             addToast("Added to wishlist", "success");
                                        }
                                    }}
                                    className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                     <FaHeart className={`text-xl ${wishlistItems?.find(item => item.id === productId) ? 'text-red-500' : 'text-gray-400'}`} />
                                </button>
                            </div>
                        )}
                        
                        {/* Trust Badges */}
                        <div className="grid grid-cols-4 gap-2 text-center mt-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            {[
                                { icon: FaTruck, text: "Free Shipping" },
                                { icon: FaShieldAlt, text: "1 Year Warranty" },
                                { icon: FaShieldAlt, text: "Secure Checkout" },
                                { icon: FaTruck, text: "Easy Returns" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1">
                                    <badge.icon className="text-gray-800 dark:text-gray-200 text-xl" />
                                    <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 text-center leading-tight">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs: Description, Specs, Reviews */}
                <div className="mt-16">
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                        {["description", "specifications", "reviews"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 font-bold text-lg capitalize transition-all border-b-2 relative -bottom-[2px] whitespace-nowrap ${activeTab === tab ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-black dark:hover:text-gray-300'}`}
                            >
                                {tab} ({(tab === 'reviews' ? activeReviews.length : '')})
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[200px] text-gray-600 dark:text-gray-300 leading-relaxed">
                        {activeTab === "description" && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Product Description</h3>
                                    <p className="whitespace-pre-line leading-7">{product.description}</p>
                                </div>
                                {product.highlights && product.highlights.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-black dark:text-white mb-3">Highlights</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {product.highlights.map((highlight, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" size={12} />
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="animate-fade-in">
                                {product.specifications && product.specifications.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {product.specifications.map((spec, idx) => (
                                            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-100 dark:border-gray-700">
                                                <span className="font-semibold text-gray-900 dark:text-white">{spec.key}</span>
                                                <span className="text-gray-600 dark:text-gray-400">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No specifications available for this product.</p>
                                )}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="space-y-10 animate-fade-in">
                                {/* Reviews Header */}
                                <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
                                     <div className="text-center md:text-left">
                                         <h2 className="text-6xl font-bold text-black dark:text-white mb-2">{product.rating ? product.rating.toFixed(1) : '0.0'}</h2>
                                         <div className="flex justify-center md:justify-start text-yellow-400 gap-1 text-xl mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} fill={i < Math.round(product.rating || 0) ? "currentColor" : "#e5e7eb"} />
                                            ))}
                                         </div>
                                         <p className="text-sm opacity-70">Based on {activeReviews.length} Reviews</p>
                                     </div>
                                     <div className="flex-1 w-full border-l-0 md:border-l pl-0 md:pl-8 border-gray-300 dark:border-gray-600">
                                         <p className="text-sm mb-4">Share your thoughts with other customers</p>
                                         <button 
                                            onClick={() => document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' })}
                                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-bold text-sm hover:opacity-80 transition"
                                         >
                                            Write a Review
                                         </button>
                                     </div>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-6">
                                    {activeReviews.length > 0 ? activeReviews.map((review) => (
                                         <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-sm text-gray-600 dark:text-gray-300">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-black dark:text-white leading-none">{review.name}</h4>
                                                        <div className="flex text-yellow-400 text-xs mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} fill={i < review.rating ? "currentColor" : "#e5e7eb"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 ml-12">{review.comment}</p>
                                         </div>
                                    )) : (
                                        <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                                    )}
                                </div>

                                {/* Review Form */}
                                <div id="review-form" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-4">Write a Review</h3>
                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        <FaStar />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Review</label>
                                            <textarea 
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                                rows="4"
                                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                                placeholder="What did you like or dislike?"
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={submittingReview}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
