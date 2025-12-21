import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromStorage = () => {
    try {
      const saved = localStorage.getItem("wishlistItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  };

const initialState = {
    wishlistItems: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const index = state.wishlistItems.findIndex(item => item.id === product.id);
            if (index >= 0) {
                state.wishlistItems.splice(index, 1);
            } else {
                state.wishlistItems.push(product);
            }
            localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
        },
        addToWishlist: (state, action) => {
            const product = action.payload;
            if(!state.wishlistItems.find(item => item.id === product.id)){
                state.wishlistItems.push(product);
            }
            localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
        },
        removeFromWishlist: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(item => item.id !== action.payload);
            localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
        }
    }
});

export const { toggleWishlist, addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
