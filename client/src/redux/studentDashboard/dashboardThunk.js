import studentDashboardService from "../../services/studentDashboardService";

import {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} from "./dashboardSlice";

import { toastService } from "../../lib/toast";

// ===================================================
// Fetch Student Dashboard
// ===================================================
export const fetchDashboardThunk = () => {
  return async (dispatch) => {
    dispatch(fetchDashboardStart());

    try {
      const data =
        await studentDashboardService.getDashboard();

      dispatch(fetchDashboardSuccess(data));

      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to load dashboard.";

      dispatch(fetchDashboardFailure(message));

      toastService.error(message);

      throw error;
    }
  };
};