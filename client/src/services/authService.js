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

const authService =
  new AuthService();

export default authService;