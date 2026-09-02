import api from "./api";

class AuthService {
  // =========================================
  // STUDENT LOGIN
  // =========================================

  async login(credentials) {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    return response.data;
  }

  // =========================================
  // STUDENT REGISTER
  // =========================================

  async register(payload) {
    const response = await api.post(
      "/auth/register",
      payload
    );

    return response.data;
  }

  // =========================================
  // VERIFY STUDENT OTP
  // =========================================

  async verifyOtp(payload) {
    const response = await api.post(
      "/auth/verify-otp",
      payload
    );

    return response.data;
  }

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  async changePassword(payload) {
    const response = await api.post(
      "/auth/change-password",
      payload
    );

    return response.data;
  }
}

const authService = new AuthService();

export default authService;