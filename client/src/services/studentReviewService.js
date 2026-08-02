import api from "./api";

class StudentReviewService {
  /**
   * Fetch complete review data
   * @param {string} attemptId
   * @returns {Promise<Object>}
   */
  async getReview(attemptId) {
    const { data } = await api.get(
      `/student/result/${attemptId}/review`
    );

    return data;
  }
}

const studentReviewService = new StudentReviewService();

export default studentReviewService;