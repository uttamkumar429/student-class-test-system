import api from "./api";

const adminAnnouncementService = {
  // =========================================
  // GET ALL ANNOUNCEMENTS
  // =========================================

  getAnnouncements: async ({
    page = 1,
    limit = 10,
    search = "",
    type = "",
    status = "",
  } = {}) => {
    const response = await api.get(
      "/announcements/admin",
      {
        params: {
          page,
          limit,
          search,
          type,
          status,
        },
      }
    );

    return response.data;
  },

  // =========================================
  // GET ANNOUNCEMENT BY ID
  // =========================================

  getAnnouncementById: async (id) => {
    if (!id) {
      throw new Error(
        "Announcement ID is required."
      );
    }

    const response = await api.get(
      `/announcements/${id}`
    );

    return response.data;
  },

  // =========================================
  // CREATE ANNOUNCEMENT
  // =========================================

  createAnnouncement: async (data) => {
    const response = await api.post(
      "/announcements",
      data
    );

    return response.data;
  },

  // =========================================
  // UPDATE ANNOUNCEMENT
  // =========================================

  updateAnnouncement: async (
    id,
    data
  ) => {
    if (!id) {
      throw new Error(
        "Announcement ID is required."
      );
    }

    const response = await api.put(
      `/announcements/${id}`,
      data
    );

    return response.data;
  },

  // =========================================
  // PUBLISH ANNOUNCEMENT
  // =========================================

  publishAnnouncement: async (id) => {
    if (!id) {
      throw new Error(
        "Announcement ID is required."
      );
    }

    const response = await api.post(
      `/announcements/${id}/publish`
    );

    return response.data;
  },

  // =========================================
  // UNPUBLISH ANNOUNCEMENT
  // =========================================

  unpublishAnnouncement: async (id) => {
    if (!id) {
      throw new Error(
        "Announcement ID is required."
      );
    }

    const response = await api.post(
      `/announcements/${id}/unpublish`
    );

    return response.data;
  },

  // =========================================
  // DELETE ANNOUNCEMENT
  // =========================================

  deleteAnnouncement: async (id) => {
    if (!id) {
      throw new Error(
        "Announcement ID is required."
      );
    }

    const response = await api.delete(
      `/announcements/${id}`
    );

    return response.data;
  },
};

export default adminAnnouncementService;