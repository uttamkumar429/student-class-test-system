// src/services/authService.js

import api from "./api";

class AuthService {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  }
}

const authService = new AuthService();

export default authService;