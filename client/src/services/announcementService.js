import api from "./api";

const announcementService = {
  // =========================================
  // GET PUBLISHED ANNOUNCEMENTS — STUDENT
  // =========================================

  getPublishedAnnouncements: async (
    limit = 5
  ) => {
    const response = await api.get(
      "/announcements",
      {
        params: {
          limit,
        },
      }
    );

    return response.data;
  },
};

export default announcementService;