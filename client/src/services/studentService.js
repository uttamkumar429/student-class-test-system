import api from "./api";

// =======================================
// START EXAM
// =======================================

export const startExam = async (snapshotId) => {
  const { data } = await api.post(
    `/student/tests/${snapshotId}/start`
  );

  return data.data;
};

// =======================================
// GET EXAM QUESTIONS
// =======================================

export const getExamQuestions = async (attemptId) => {
  const { data } = await api.get(
    `/student/attempt/${attemptId}/questions`
  );

  return data.data;
};

// =======================================
// SAVE ANSWER
// =======================================

export const saveAnswer = async (attemptId, payload) => {
  const { data } = await api.post(
    `/student/attempt/${attemptId}/answer`,
    payload
  );

  return data;
};

// =======================================
// RESUME EXAM
// =======================================

export const resumeExam = async () => {
  const { data } = await api.get(
    "/student/exam/resume"
  );

  return data.data;
};

// =======================================
// SUBMIT EXAM
// =======================================

export const submitExam = async (attemptId) => {
  const { data } = await api.post(
    `/student/attempt/${attemptId}/submit`
  );

  return data.data;
};

// =======================================
// RESULT
// =======================================

export const getResult = async (attemptId) => {
  const { data } = await api.get(
    `/student/result/${attemptId}`
  );

  return data.data;
};