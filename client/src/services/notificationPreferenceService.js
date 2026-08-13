import api from "./api";

const notificationPreferenceService = {
  // =========================================
  // GET NOTIFICATION PREFERENCES
  // =========================================

  getPreferences: async () => {
    const response = await api.get(
      "/student/settings/notifications"
    );

    return response.data;
  },

  // =========================================
  // UPDATE NOTIFICATION PREFERENCES
  // =========================================

  updatePreferences: async (preferences) => {
    const response = await api.put(
      "/student/settings/notifications",
      preferences
    );

    return response.data;
  },
};

export default notificationPreferenceService;