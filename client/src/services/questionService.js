import api from "./api";

// ==============================
// GET ALL QUESTIONS
// ==============================
export const getQuestions = async (params = {}) => {
  const response = await api.get("/questions", { params });
  return response.data;
};

// ==============================
// GET QUESTION BY ID
// ==============================
export const getQuestionById = async (id) => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

// ==============================
// CREATE QUESTION
// ==============================
export const createQuestion = async (questionData) => {
  const response = await api.post("/questions", questionData);
  return response.data;
};

// ==============================
// UPDATE QUESTION
// ==============================
export const updateQuestion = async (id, questionData) => {
  const response = await api.put(`/questions/${id}`, questionData);
  return response.data;
};

// ==============================
// DELETE QUESTION
// ==============================
export const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};