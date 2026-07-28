import api from "./api";

export const getAvailableExams = async () => {
  const response = await api.get("/student/exams");
  return response.data;
};

export const startExam = async (snapshotId) => {
  const response = await api.post(
    `/student/tests/${snapshotId}/start`
  );

  return response.data;
};