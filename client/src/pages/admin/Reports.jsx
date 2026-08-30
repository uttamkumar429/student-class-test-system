import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { toastService } from "../../lib/toast";
import { getExams } from "../../services/examService";
import {
  downloadExamCSV,
  downloadExamExcel,
  downloadStudentReportPDF,
  getExamAttempts,
  getExamStatistics,
  getStudentReport,
} from "../../services/adminReportService";

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN");
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const getFilenameFromResponse = (response, fallback) => {
  const disposition =
    response.headers?.["content-disposition"] || "";

  const match = disposition.match(
    /filename\*?=(?:UTF-8'')?([^;]+)/i
  );

  if (!match?.[1]) {
    return fallback;
  }

  return (
    match[1]
      .trim()
      .replace(/^['"]|['"]$/g, "") || fallback
  );
};

const downloadResponse = (
  response,
  fallbackFilename
) => {
  const blob = response.data;

  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;

  anchor.download = getFilenameFromResponse(
    response,
    fallbackFilename
  );

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();

  window.URL.revokeObjectURL(url);
};

const StatCard = ({
  label,
  value,
  helper,
  icon: Icon,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {value}
        </p>

        {helper ? (
          <p className="mt-1 text-xs text-slate-500">
            {helper}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        <Icon size={22} />
      </div>
    </div>
  </div>
);

function Reports() {
  const [exams, setExams] = useState([]);

  const [selectedExamId, setSelectedExamId] =
    useState("");

  const [statistics, setStatistics] =
    useState(null);

  const [attempts, setAttempts] =
    useState([]);

  const [loadingExams, setLoadingExams] =
    useState(true);

  const [loadingReport, setLoadingReport] =
    useState(false);

  const [downloadType, setDownloadType] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedAttempt, setSelectedAttempt] =
    useState(null);

  const [studentReport, setStudentReport] =
    useState(null);

  const [reportLoading, setReportLoading] =
    useState(false);

  // ======================================
  // LOAD PUBLISHED EXAMS
  // ======================================

  useEffect(() => {
    let active = true;

    const loadExams = async () => {
      try {
            const response = await getExams();

            const data = Array.isArray(response)
            ? response
            : [];

        if (!active) return;

        setExams(data);

        setSelectedExamId(
          (current) =>
            current || data[0]?._id || ""
        );
      } catch (error) {
        if (active) {
          toastService.error(
            error.response?.data?.message ||
              "Failed to load published exams."
          );
        }
      } finally {
        if (active) {
          setLoadingExams(false);
        }
      }
    };

    loadExams();

    return () => {
      active = false;
    };
  }, []);

  // ======================================
  // LOAD EXAM REPORT
  // ======================================

useEffect(() => {
  let cancelled = false;

  const loadReportData = async () => {
    if (!selectedExamId) {
      return;
    }

    try {
      setLoadingReport(true);

      const [statistics, attempts] =
        await Promise.all([
          getExamStatistics(selectedExamId),
          getExamAttempts(selectedExamId),
        ]);

      if (cancelled) {
        return;
      }

      setStatistics(statistics);

      setAttempts(
        Array.isArray(attempts)
          ? attempts
          : []
      );
    } catch (err) {
      if (cancelled) {
        return;
      }

      console.error(
        "Failed to load report data:",
        err
      );

      setStatistics(null);
      setAttempts([]);
    } finally {
      if (!cancelled) {
        setLoadingReport(false);
      }
    }
  };

  loadReportData();

  return () => {
    cancelled = true;
  };
}, [selectedExamId]);

  // ======================================
  // SUBMITTED ATTEMPTS
  // ======================================

  const submittedAttempts = useMemo(
    () =>
      attempts.filter(
        (attempt) =>
          attempt.status === "SUBMITTED"
      ),
    [attempts]
  );

  // ======================================
  // SEARCH
  // ======================================

  const filteredAttempts = useMemo(() => {
    const query =
      searchTerm.trim().toLowerCase();

    if (!query) {
      return submittedAttempts;
    }

    return submittedAttempts.filter(
      (attempt) =>
        [
          attempt.fullName,
          attempt.userId,
          attempt.email,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          )
    );
  }, [searchTerm, submittedAttempts]);

  const selectedExam = exams.find(
    (exam) => exam._id === selectedExamId
  );

  // ======================================
  // EXPORT EXAM REPORT
  // ======================================

  const handleExport = async (type) => {
    if (!selectedExamId) return;

    setDownloadType(type);

    try {
      const response =
        type === "csv"
          ? await downloadExamCSV(
              selectedExamId
            )
          : await downloadExamExcel(
              selectedExamId
            );

      downloadResponse(
        response,
        `exam-${selectedExamId}.${
          type === "csv" ? "csv" : "xlsx"
        }`
      );

      toastService.success(
        `${type.toUpperCase()} report downloaded successfully.`
      );
    } catch (error) {
      toastService.error(
        error.response?.data?.message ||
          `Failed to download ${type.toUpperCase()} report.`
      );
    } finally {
      setDownloadType("");
    }
  };

  // ======================================
  // OPEN STUDENT REPORT
  // ======================================

  const openStudentReport = async (
    attempt
  ) => {
    setSelectedAttempt(attempt);

    setStudentReport(null);

    setReportLoading(true);

    try {
      const response =
        await getStudentReport(
          attempt.attemptId
        );

      setStudentReport(
        response.data || null
      );
    } catch (error) {
      setSelectedAttempt(null);

      toastService.error(
        error.response?.data?.message ||
          "Failed to load student report."
      );
    } finally {
      setReportLoading(false);
    }
  };

  // ======================================
  // DOWNLOAD STUDENT PDF
  // ======================================

  const handleStudentPDF = async (
    attemptId
  ) => {
    try {
      const response =
        await downloadStudentReportPDF(
          attemptId
        );

      downloadResponse(
        response,
        `student-report-${attemptId}.pdf`
      );

      toastService.success(
        "Student PDF report downloaded successfully."
      );
    } catch (error) {
      toastService.error(
        error.response?.data?.message ||
          "Failed to download student report."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Exam Reports
          </h1>

          <p className="mt-2 text-slate-500">
            Analyze exam performance, review
            student results, and export reports.
          </p>
        </div>

        {/* ======================================
            EXAM SELECTOR
        ====================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="report-exam"
              >
                Select published exam
              </label>

              <select
                id="report-exam"
                value={selectedExamId}
                onChange={(event) => {
                  setSelectedExamId(
                    event.target.value
                  );

                  setSearchTerm("");

                  setSelectedAttempt(null);

                  setStudentReport(null);
                }}
                disabled={
                  loadingExams ||
                  exams.length === 0
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {exams.length === 0 ? (
                  <option value="">
                    No published exams
                  </option>
                ) : null}

                {exams.map((exam) => (
                  <option
                    key={exam._id}
                    value={exam._id}
                  >
                    {exam.title}
                    {exam.subject
                      ? ` — ${exam.subject}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* ======================================
                EXPORT BUTTONS
            ====================================== */}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  handleExport("csv")
                }
                disabled={
                  !selectedExamId ||
                  downloadType !== ""
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={18} />

                {downloadType === "csv"
                  ? "Exporting..."
                  : "CSV"}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleExport("excel")
                }
                disabled={
                  !selectedExamId ||
                  downloadType !== ""
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileSpreadsheet size={18} />

                {downloadType === "excel"
                  ? "Exporting..."
                  : "Excel"}
              </button>
            </div>
          </div>

          {selectedExam ? (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {selectedExam.title}
              </span>

              {selectedExam.subject
                ? ` • ${selectedExam.subject}`
                : ""}

              {selectedExam.startTime
                ? ` • ${formatDateTime(
                    selectedExam.startTime
                  )}`
                : ""}
            </div>
          ) : null}
        </section>

        {/* ======================================
            STATISTICS
        ====================================== */}

        {loadingReport ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : statistics ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Submitted"
              value={formatNumber(
                statistics.submitted
              )}
              helper={`${formatNumber(
                statistics.running
              )} currently running`}
              icon={Users}
            />

            <StatCard
              label="Average Percentage"
              value={`${
                statistics.averagePercentage ?? 0
              }%`}
              helper={`Average marks: ${
                statistics.averageMarks ?? 0
              }`}
              icon={TrendingUp}
            />

            <StatCard
              label="Pass Rate"
              value={`${
                statistics.passPercentage ?? 0
              }%`}
              helper={`Fail rate: ${
                statistics.failPercentage ?? 0
              }%`}
              icon={BarChart3}
            />

            <StatCard
              label="Highest / Lowest"
              value={`${
                statistics.highestMarks ?? 0
              } / ${
                statistics.lowestMarks ?? 0
              }`}
              helper="Marks among submitted attempts"
              icon={FileText}
            />
          </div>
        ) : selectedExamId ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No report data available for
            this exam yet.
          </div>
        ) : null}

        {/* ======================================
            STUDENT PERFORMANCE TABLE
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Student Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {submittedAttempts.length}{" "}
                submitted{" "}
                {submittedAttempts.length === 1
                  ? "attempt"
                  : "attempts"}
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search student, ID or email"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              {submittedAttempts.length ===
              0
                ? "No submitted attempts found for this exam."
                : "No students match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Student
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Marks
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Percentage
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Time Taken
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAttempts.map(
                    (attempt) => {
                      const passed =
                        Number(
                          attempt.percentage ||
                            0
                        ) >= 33;

                      return (
                        <tr
                          key={
                            attempt.attemptId
                          }
                          className="hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">
                              {attempt.fullName ||
                                "Unknown student"}
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              {attempt.userId ||
                                attempt.email ||
                                "—"}
                            </div>
                          </td>

                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {attempt.obtainedMarks ??
                              0}
                            /
                            {attempt.totalMarks ??
                              0}
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-700">
                              {attempt.percentage ??
                                0}
                              %
                            </span>

                            <span
                              className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                passed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {passed
                                ? "Pass"
                                : "Fail"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {attempt.timeTaken ??
                              0}{" "}
                            min
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {formatDateTime(
                              attempt.submittedAt
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openStudentReport(
                                    attempt
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                              >
                                <FileText
                                  size={15}
                                />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleStudentPDF(
                                    attempt.attemptId
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                              >
                                <Download
                                  size={15}
                                />
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ======================================
          STUDENT REPORT MODAL
      ====================================== */}

      {selectedAttempt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Student Report
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {studentReport?.student
                    ?.fullName ||
                    selectedAttempt.fullName ||
                    "Student"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedAttempt(null);

                  setStudentReport(null);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close report"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-82px)] overflow-y-auto p-6">
              {reportLoading ? (
                <div className="py-16 text-center text-slate-500">
                  Loading student report...
                </div>
              ) : studentReport ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Student
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {studentReport.student
                          ?.fullName || "—"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {studentReport.student
                          ?.email || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Result
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {studentReport
                          .summary
                          ?.obtainedMarks ??
                          0}
                        /
                        {studentReport
                          .summary
                          ?.totalMarks ??
                          0}{" "}
                        (
                        {studentReport
                          .summary
                          ?.percentage ??
                          0}
                        %)
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {studentReport
                          .summary?.status ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-bold text-slate-900">
                      Question Report
                    </h3>

                    <div className="space-y-3">
                      {(
                        studentReport.questions ||
                        []
                      ).map(
                        (question, index) => (
                          <div
                            key={
                              question.questionId ||
                              index
                            }
                            className="rounded-xl border border-slate-200 p-4"
                          >
                            <p className="font-semibold text-slate-900">
                              {index + 1}.{" "}
                              {
                                question.question
                              }
                            </p>

                            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                              <p className="text-slate-600">
                                Student:{" "}
                                <span className="font-semibold text-slate-900">
                                  {question.selectedAnswer ||
                                    "—"}
                                </span>
                              </p>

                              <p className="text-slate-600">
                                Correct:{" "}
                                <span className="font-semibold text-slate-900">
                                  {question.correctAnswer ||
                                    "—"}
                                </span>
                              </p>

                              <p className="text-slate-600">
                                Marks:{" "}
                                <span className="font-semibold text-slate-900">
                                  {question.marksAwarded ??
                                    0}
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleStudentPDF(
                          selectedAttempt.attemptId
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <FileText size={18} />
                      Download PDF Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500">
                  Report data is unavailable.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}

export default Reports;