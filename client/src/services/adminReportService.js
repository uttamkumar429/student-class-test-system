import api from "./api";

// ======================================
// EXAM STATISTICS
// ======================================

export const getExamStatistics = async (
  snapshotId
) => {
  const response = await api.get(
    `/admin/analytics/exams/${snapshotId}/statistics`
  );

  return response.data?.data ?? null;
};

// ======================================
// EXAM ATTEMPTS
// ======================================

export const getExamAttempts = async (
  snapshotId
) => {
  const response = await api.get(
    `/admin/exams/${snapshotId}/attempts`
  );

  return response.data?.data ?? [];
};

// ======================================
// INDIVIDUAL STUDENT REPORT
// ======================================

export const getStudentReport = async (
  attemptId
) => {
  const response = await api.get(
    `/admin/reports/attempts/${attemptId}`
  );

  return response.data;
};

// ======================================
// EXAM CSV EXPORT
// ======================================

export const downloadExamCSV = async (
  snapshotId
) => {
  return api.get(
    `/admin/reports/exams/${snapshotId}/csv`,
    {
      responseType: "blob",
    }
  );
};

// ======================================
// EXAM EXCEL EXPORT
// ======================================

export const downloadExamExcel = async (
  snapshotId
) => {
  return api.get(
    `/admin/reports/exams/${snapshotId}/excel`,
    {
      responseType: "blob",
    }
  );
};

// ======================================
// STUDENT PDF EXPORT
// ======================================

export const downloadStudentReportPDF =
  async (attemptId) => {
    return api.get(
      `/admin/reports/attempts/${attemptId}/pdf`,
      {
        responseType: "blob",
      }
    );
  };