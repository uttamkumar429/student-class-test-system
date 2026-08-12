import api from "./api";

const SETTINGS_BASE_URL = "/settings";

const systemSettingService = {
  // ======================================
  // GET ALL SETTINGS
  // ======================================

  async getSettings() {
    const response = await api.get(
      SETTINGS_BASE_URL
    );

    return response.data.data;
  },

  // ======================================
  // UPDATE PASS PERCENTAGE
  // ======================================

  async updatePassPercentage(value) {
    const response = await api.patch(
      `${SETTINGS_BASE_URL}/pass-percentage`,
      {
        value,
      }
    );

    return response.data.data;
  },
};

export default systemSettingService;