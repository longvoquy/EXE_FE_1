import { create } from "zustand";
import axiosInstance from "../components/utils/AxiosInstance";
import useErrorStore from './errorStore';
const API_URL = "/user";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });
  
      const user = response.data.data?.user || null;
      set({
        user: user,
        isAuthenticated: false, // Still need email verification
        isLoading: false,
        message: response.data.message || "Signup successful. Please verify your email.",
      });
  
      return response.data;
    } catch (error) {
      useErrorStore.getState().setError(error.displayMessage);
      set({ isLoading: false });
      throw error;
    }
  },  

  verifyEmail: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/verify-email`, {
        email,
        otp,
      });
      set({
        isAuthenticated: true,
        isLoading: false,
        message: "Email verified successfully",
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axiosInstance.post(
        `${API_URL}/resend-verification`,
        {
          email,
        }
      );
      set({
        isLoading: false,
        message: "Verification code resent successfully",
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to resend verification code",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/login`, {
        email,
        password,
      });
  
      const user = response.data?.data?.user || null;
      const token = response.data?.jwt || response.data?.data?.token || response.data?.token || null;
  
      if (user && token) {
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
  
        // Store token in localStorage after successful login
        localStorage.setItem("token", token);
        console.log("Login successful, token saved:", token);
      } else {
        set({ 
          isLoading: false,
          error: "Login failed. Please check your credentials and try again."
        });
      }
  
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      set({ 
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  // Google login
  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/google-login`, {
        credential,
      });

      // Store user data and token
      set({
        isAuthenticated: true,
        user: response.data.data.user,
        error: null,
        isLoading: false,
      });

      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
      }

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in with Google",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(`${API_URL}/logout`);
      // Clear token from localStorage
      localStorage.removeItem("token");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging out",
        isLoading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/reset-password/${token}`,
        {
          password,
        }
      );
      set({
        message: response.data.message,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
