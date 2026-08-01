// src/redux/auth/authThunk.js

import authService from "../../services/authService";
import { loginSuccess, logout } from "../slices/authSlice";
import { toastService } from "../../lib/toast";

export const loginThunk = (credentials, navigate) => {
  return async (dispatch) => {
    try {
      // API promise
      const data = await authService.login(credentials);

      console.log("FULL DATA =", data);
      console.log("USER =", data.user);
      console.log("TOKEN =", data.token);
            // // Show toast
      // toastService.promise(loginPromise, {
      //   loading: "Signing you in...",
      //   success: "Welcome back!",
      //   error: (error) =>
      //     error?.response?.data?.message || "Login failed",
      // });
      // const data = await authService.login(credentials);

      toastService.success("Welcome back!");

      // Wait for API response
      // const data = await loginPromise;

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        })
      );
      console.log("Before navigate");
      console.log("Role:", data.user.role);
      console.log("Current Path:", window.location.pathname);
      console.log("Navigating...");
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
      console.log("After navigate");
      console.log("Current Path:", window.location.pathname);
      return data;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };
};
export const logoutThunk = (navigate) => {
  return async (dispatch) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch(logout());

      toastService.success("Logged out successfully.");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 300);
    } catch (error) {
         console.error(error);
      toastService.error("Logout failed.");
    }
  };
};