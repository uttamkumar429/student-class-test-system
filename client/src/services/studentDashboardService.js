import api from "./api";

class StudentDashboardService {
  async getDashboard() {
    const response = await api.get("/student/dashboard");

    return response.data.data;
  }
}

const studentDashboardService =
  new StudentDashboardService();

export default studentDashboardService;