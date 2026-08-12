import api from "./api";

class StudentExamService {

  async getAvailableExams() {
    const { data } = await api.get("/student/exams");
    return data;
  }

  async startExam(snapshotId) {
    const { data } = await api.post(
      `/student/tests/${snapshotId}/start`
    );
    return data;
  }

  async resumeExam() {
    const { data } = await api.get("/student/exam/resume");
    return data;
  }

async saveAnswer(attemptId, payload) {
  const { data } = await api.post(
    `/student/attempt/${attemptId}/answer`,
    payload
  );
  return data;
}

  async submitExam(attemptId) {
    const { data } = await api.post(
      `/student/attempt/${attemptId}/submit`
    );
    return data;
  }

async getExamQuestions(attemptId) {

  const { data } = await api.get(
    `/student/attempt/${attemptId}/questions`
  );

  return data;
}

async updateExamProgress(
  attemptId,
  payload
) {
  const { data } = await api.patch(
    `/student/exams/${attemptId}/progress`,
    payload
  );

  return data;
}
}
const studentExamService = new StudentExamService();

export default studentExamService;