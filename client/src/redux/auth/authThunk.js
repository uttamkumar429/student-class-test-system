// src/redux/auth/authThunk.js

import authService from "../../services/authService";
import { loginSuccess, logout } from "./authSlice";
import { toastService } from "../../lib/toast";

export const loginThunk = (credentials, navigate) => {
  return async (dispatch) => {
    try {
      console.log("LOGIN START");

      const data = await authService.login(credentials);

      console.log("FULL RESPONSE =>", data);

      // 🔐 Mobile verification required
      if (data?.verificationRequired) {
        navigate("/verify-otp", {
          state: {
            phone: data.phone,
            purpose: "login",
          },
        });

        return;
      }

      // ✅ Normal login for already verified users
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        })
      );

      console.log("USER =>", data.user);
      console.log("ROLE =>", data.user?.role);

      if (data.user?.role === "admin") {
        console.log("GO ADMIN");
        navigate("/admin/dashboard");
      } else {
        console.log("GO STUDENT");
        navigate("/student/dashboard");
      }

      console.log("NAVIGATION DONE");
    } catch (error) {
      console.error("LOGIN ERROR =>", error);
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