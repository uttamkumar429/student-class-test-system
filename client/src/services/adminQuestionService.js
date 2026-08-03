import api from "./api";

const adminQuestionService = {
  getQuestions: async (params = {}) => {
    const response = await api.get(
      "/questions",
      {
        params,
      }
    );

    return response.data;
  },

  getQuestionById: async (id) => {
    const response = await api.get(
      `/questions/${id}`
    );

    return response.data;
  },

  createQuestion: async (data) => {
    const response = await api.post(
      "/questions",
      data
    );

    return response.data;
  },

  updateQuestion: async (
    id,
    data
  ) => {
    const response = await api.put(
      `/questions/${id}`,
      data
    );

    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(
      `/questions/${id}`
    );

    return response.data;
  },
};

export default adminQuestionService;