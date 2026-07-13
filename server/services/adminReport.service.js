const {
  getAttemptDetails,
} = require("./adminExam.service");
const TestSnapshot = require("../models/TestSnapshot");
const PDFDocument = require("pdfkit");
const ExamAttempt = require("../models/ExamAttempt");
const ExcelJS = require("exceljs");

// =====================================
// STUDENT REPORT
// =====================================

const getStudentReport = async (attemptId) => {

  /**
   * Temporary Reuse
   *
   * Future:
   * reportData.service.js
   */

  // Snapshot id find
  const ExamAttempt = require("../models/ExamAttempt");

  const attempt = await ExamAttempt.findById(
    attemptId
  );

  if (!attempt) {
    throw new Error("Exam attempt not found.");
  }

  return await getAttemptDetails(
    attempt.testSnapshot.toString(),
    attemptId
  );

};
// =====================================
// GENERATE PDF
// =====================================

const generateStudentReportPDF = async (
  attemptId,
  res
) => {

  const report =
    await getStudentReport(attemptId);

  const doc = new PDFDocument({

    margin: 50,

    size: "A4",

  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=student-report-${attemptId}.pdf`
  );

  doc.pipe(res);

  // ---------------------------------
  // HEADER
  // ---------------------------------

  doc
    .fontSize(22)
    .text("iRise Coaching Center", {
      align: "center",
    });

  doc.moveDown();

  doc
    .fontSize(16)
    .text("Student Examination Report", {
      align: "center",
    });

  doc.moveDown(2);

  // ---------------------------------
  // STUDENT
  // ---------------------------------

  doc.fontSize(14).text("Student Details");

  doc.moveDown(0.5);

  doc.fontSize(12);

  doc.text(
    `Name : ${report.student.fullName}`
  );

  doc.text(
    `User ID : ${report.student.userId}`
  );

  doc.text(
    `Email : ${report.student.email}`
  );

  doc.moveDown();

  // ---------------------------------
  // EXAM
  // ---------------------------------

  doc.fontSize(14).text("Exam Details");

  doc.moveDown(0.5);

  doc.fontSize(12);

  doc.text(
    `Exam : ${report.exam.title}`
  );

  doc.text(
    `Subject : ${report.exam.subject}`
  );

  doc.moveDown();

  // ---------------------------------
  // RESULT
  // ---------------------------------

  doc.fontSize(14).text("Summary");

  doc.moveDown(0.5);

  doc.fontSize(12);

  doc.text(
    `Marks : ${report.summary.obtainedMarks}/${report.summary.totalMarks}`
  );

  doc.text(
    `Percentage : ${report.summary.percentage}%`
  );

  doc.text(
    `Status : ${report.summary.status}`
  );

  doc.text(
    `Time Taken : ${report.summary.timeTaken} Minutes`
  );

  doc.moveDown(2);

  // ---------------------------------
  // QUESTIONS
  // ---------------------------------

  doc.fontSize(16).text("Question Report");

  doc.moveDown();

  report.questions.forEach(
    (question, index) => {

      doc
        .fontSize(13)
        .text(
          `${index + 1}. ${question.question}`
        );

      doc.moveDown(0.3);

      doc.text(
        `Student Answer : ${
          question.selectedAnswer || "-"
        }`
      );

      doc.text(
        `Correct Answer : ${question.correctAnswer}`
      );

      doc.text(
        `Marks Awarded : ${question.marksAwarded}`
      );

      doc.moveDown();

    }
  );

  doc.end();

};
// =====================================
// EXAM EXPORT DATA
// =====================================

const getExamExportData = async (snapshotId) => {

  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test snapshot not found.");
  }

  const attempts = await ExamAttempt.find({
    testSnapshot: snapshotId,
    status: "submitted",
  })
    .populate({
      path: "student",
      select: "userId fullName email",
    })
    .sort({
      obtainedMarks: -1,
    });

  return {
    snapshot,
    attempts,
  };

};
// =====================================
// EXPORT EXAM CSV
// =====================================

const exportExamCSV = async (snapshotId, res) => {

  const {
  snapshot,
  attempts,
} = await getExamExportData(snapshotId);
  // CSV Header
  let csv =
    "Student ID,Student Name,Email,Marks,Total Marks,Percentage,Status,Time Taken,Submitted At\n";

  // CSV Rows
  attempts.forEach((attempt) => {

    csv += `${attempt.student?.userId || ""},`;

    csv += `${attempt.student?.fullName || ""},`;

    csv += `${attempt.student?.email || ""},`;

    csv += `${attempt.obtainedMarks},`;

    csv += `${attempt.totalMarks},`;

    csv += `${attempt.percentage},`;

    csv += `${attempt.percentage >= 33 ? "Pass" : "Fail"},`;

    csv += `${attempt.timeTaken},`;

    csv += `${attempt.submittedAt || ""}\n`;

  });

  // Headers
  res.setHeader(
    "Content-Type",
    "text/csv"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=exam-${snapshotId}.csv`
  );

  return res.send(csv);

};
// =====================================
// EXPORT EXAM EXCEL
// =====================================

const exportExamExcel = async (snapshotId, res) => {

  const { snapshot, attempts } =
    await getExamExportData(snapshotId);

  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Exam Results");

  worksheet.columns = [
    { header: "Student ID", key: "userId", width: 18 },
    { header: "Student Name", key: "fullName", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Marks", key: "marks", width: 12 },
    { header: "Total Marks", key: "totalMarks", width: 15 },
    { header: "Percentage", key: "percentage", width: 15 },
    { header: "Status", key: "status", width: 12 },
    { header: "Time Taken", key: "timeTaken", width: 15 },
    { header: "Submitted At", key: "submittedAt", width: 30 },
  ];

  attempts.forEach((attempt) => {

    worksheet.addRow({

      userId: attempt.student?.userId,

      fullName: attempt.student?.fullName,

      email: attempt.student?.email,

      marks: attempt.obtainedMarks,

      totalMarks: attempt.totalMarks,

      percentage: attempt.percentage,

      status:
        attempt.percentage >= 33
          ? "Pass"
          : "Fail",

      timeTaken: attempt.timeTaken,

      submittedAt: attempt.submittedAt,

    });

  });

  // Header Style
  worksheet.getRow(1).font = {
    bold: true,
  };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=exam-${snapshotId}.xlsx`
  );

  await workbook.xlsx.write(res);

  res.end();

};

module.exports = {
  getStudentReport,
  generateStudentReportPDF,
  exportExamCSV,
  exportExamExcel,
};