const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getStudentReport: getStudentReportService,
  generateStudentReportPDF,
  exportExamCSV: exportExamCSVService,
  exportExamExcel: exportExamExcelService,
} = require("../services/adminReport.service");

// =====================================
// STUDENT REPORT
// =====================================

exports.getStudentReport = asyncHandler(async (req, res) => {

  const report = await getStudentReportService(
    req.params.attemptId
  );

  return successResponse(
    res,
    200,
    "Student report fetched successfully.",
    report
  );

});
// =====================================
// DOWNLOAD PDF
// =====================================

exports.downloadStudentReportPDF =
asyncHandler(async (req, res) => {

  await generateStudentReportPDF(
    req.params.attemptId,
    res
  );

});
// =====================================
// EXPORT CSV
// =====================================

exports.exportExamCSV =
asyncHandler(async (req, res) => {

  await exportExamCSVService(
    req.params.snapshotId,
    res
  );

});
// =====================================
// EXPORT EXCEL
// =====================================

exports.exportExamExcel =
asyncHandler(async (req, res) => {

  await exportExamExcelService(
    req.params.snapshotId,
    res
  );

});