import api from "./api";

// ======================================
// GET RESULT
// ======================================
export const getResult = async (attemptId) => {
  const { data } = await api.get(
    `/student/result/${attemptId}`
  );

  return data;
};

// ======================================
// GET RESULT HISTORY
// ======================================
export const getResultHistory = async () => {
  const { data } = await api.get(
    "/student/results"
  );

  return data;
};