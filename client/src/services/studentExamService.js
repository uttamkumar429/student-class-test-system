import api from "./api";

/**
 * Fetch all available exams for the logged-in student.
 */
export const getAvailableExams = async () => {
  const { data } = await api.get("/student/exams");
  return data;
};

/**
 * Start a new exam attempt.
 * @param {string} snapshotId
 */
export const startExam = async (snapshotId) => {
  const { data } = await api.post(
    `/student/tests/${snapshotId}/start`
  );
    return data;
};
/**
 * Resume an existing exam attempt.
 */
export const resumeExam = async () => {
  const { data } = await api.get("/student/exam/resume");
  return data;
};
/**
 * Save answer for a question.
 * @param {string} attemptId
 * @param {Object} payload
 */
export const saveAnswer = async (attemptId, payload) => {
  const { data } = await api.post(
    `/student/attempt/${attemptId}/answer`,
    payload
  );

  return data;
};

/**
 * Submit exam attempt.
 * @param {string} attemptId
 */
export const submitExam = async (attemptId) => {
  const { data } = await api.post(
    `/student/attempt/${attemptId}/submit`
  );

  return data;
};