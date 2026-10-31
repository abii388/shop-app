import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
  items: [],
  total: "0.00",
  count: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartStart(state) {
      state.loading = true;
      state.error = null;
    },
    setCart(state, action) {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.count = action.payload.count;
      state.loading = false;
      state.error = null;
    },
    cartFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearCart(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { cartStart, setCart, cartFailure, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
