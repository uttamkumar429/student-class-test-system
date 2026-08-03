import api from "./api";

const adminDashboardService = {

  getDashboard: async () => {

    const response = await api.get(
      "/admin/dashboard"
    );

    return response.data;

  },

};

export default adminDashboardService;