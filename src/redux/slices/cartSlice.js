import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  cartItems: loadCartFromStorage(),
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }
      state.isCartOpen = true;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        if (quantity < 1) {
          state.cartItems = state.cartItems.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    clearCart: (state) => {
        state.cartItems = [];
        localStorage.removeItem("cartItems");
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, setCartOpen, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
