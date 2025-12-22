import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const productId = data._id || data.id;
  const isWishlisted = wishlistItems?.find((item) => (item._id || item.id) === productId);
  const cartItem = cartItems?.find((item) => (item._id || item.id) === productId);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(data));
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(data));
  };

  const handleUpdateQuantity = (e, change) => {
    e.stopPropagation();
    if (cartItem.quantity === 1 && change === -1) {
        dispatch(removeFromCart(productId));
    } else {
        dispatch(updateQuantity({ id: productId, quantity: cartItem.quantity + change }));
    }
  };

  return (
    <div className="bg-transparent p-2 flex flex-col gap-2 group relative">
      <Link
        to={`/product/${productId}`}
        className="block relative h-[280px] bg-gray-100/50 rounded-2xl overflow-hidden cursor-pointer group-hover:bg-gray-100 transition-colors"
      >
        {/* Bestseller Badge */}
        {data.isFeatured && (
        <div className="absolute top-2 left-0 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-r-sm z-10 uppercase tracking-wider">
          Best Seller
        </div>
        )}

        {/* Playback Badge */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-bold px-3 py-0.5 rounded-full z-10 whitespace-nowrap">
          60 Hours Playback
        </div>

        <img
          src={data.img || (data.images && data.images[0])}
          alt={data.title || data.name}
          className="h-full w-full object-contain p-6 transform group-hover:scale-105 duration-300"
          loading="lazy"
        />
      </Link>
      
      {/* ... Wishlist Button ... */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 text-xl p-2 rounded-full z-10 hover:bg-white/50 transition-colors"
        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaHeart className="text-gray-300 hover:text-red-500" />
        )}
      </button>

      {/* Details Section */}
      <div className="flex flex-col gap-1 px-2">
        {/* Title and Rating */}
        <div className="flex justify-between items-start">
          <Link to={`/product/${productId}`}>
            <h3 className="font-bold text-lg text-black leading-tight line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
              {data.title || data.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <FaStar className="text-yellow-400 text-xs" />
          <span className="font-medium text-gray-500">{data.rating || 4.5}</span>
          <span className="text-xs text-gray-400">| 1334 reviews</span>
          {(data.id % 2 === 0 || data.isFeatured) && (
            <span className="text-xs text-green-600 font-bold ml-1">✓ Verified</span>
          )}
        </div>

        <hr className="border-gray-100 my-1" />

        {/* Price Section */}
        <div className="flex items-end gap-2 mb-1">
          <span className="font-bold text-lg text-primary">₹{data.price}</span>
          <span className="text-xs text-gray-400 line-through decoration-gray-400 mb-1">
            ₹{data.price * 2}
          </span>
          <span className="text-xs font-bold text-green-600 mb-1">50% off</span>
        </div>

        {/* Add to Cart Button */}
        {cartItem ? (
          <div className="w-full flex items-center justify-between bg-black text-white rounded-lg py-2 px-4 shadow-md">
            <button
              onClick={(e) => handleUpdateQuantity(e, -1)}
              className="text-white hover:text-red-500"
              aria-label="Decrease Quantity"
            >
              <FaMinus className="text-xs" />
            </button>
            <span className="font-bold text-sm">{cartItem.quantity}</span>
            <button
              onClick={(e) => handleUpdateQuantity(e, 1)}
              className="text-white hover:text-green-500"
              aria-label="Increase Quantity"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-2 text-sm font-bold tracking-wide transition-all shadow-md active:scale-95"
            aria-label="Add to Cart"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(ProductCard);
