import api from "./api";

export const getExams = async () => {
  const response = await api.get("/admin/exams");
  return response.data;
};

export const getExamById = async (id) => {
  const response = await api.get(`/admin/exams/${id}`);
  return response.data;
};

export const createExam = async (examData) => {
  const response = await api.post("/admin/exams", examData);
  return response.data;
};

export const updateExam = async (id, examData) => {
  const response = await api.put(`/admin/exams/${id}`, examData);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(`/admin/exams/${id}`);
  return response.data;
};