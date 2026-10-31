import { createSlice } from "@reduxjs/toolkit";

const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    submitting: false,
    error: null,
  },
  reducers: {
    loginStart(state) {
      state.submitting = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.submitting = false;
      state.user = action.payload;
    },
    loginFailure(state, action) {
      state.submitting = false;
      state.error = action.payload;
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;