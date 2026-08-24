import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  Award,
} from "lucide-react";

import studentExamService from "../../services/studentExamService";

const ExamInstructions = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const exam = state?.exam;

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ======================================
  // START EXAM
  // ======================================

  const handleStartExam = async () => {
    if (!exam?._id || loading) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await studentExamService.startExam(
          exam._id
        );

      const attemptId =
        response?.data?.attemptId;

      if (!attemptId) {
        throw new Error(
          "Exam attempt ID was not returned."
        );
      }

      toast.success(
        response?.message ||
          "Exam started successfully."
      );

      // Navigate using server-created Attempt ID
      navigate(
        `/student/exam/${attemptId}`,
        {
          replace: true,
        }
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to start exam."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // EXAM NOT FOUND
  // ======================================

  if (!exam) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Exam Not Found
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            The selected exam could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/student/exams")
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Exam Instructions
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Please read all instructions carefully
          before starting your exam.
        </p>
      </div>

      {/* Exam Details */}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-semibold text-slate-800 dark:text-slate-100">
          Exam Details
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600" />

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Subject
              </p>

              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {exam.subject}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-green-600" />

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Duration
              </p>

              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {exam.duration} Minutes
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="text-orange-600" />

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Marks
              </p>

              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {exam.totalMarks}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-purple-600" />

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Exam Date
              </p>

              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {new Date(
                  exam.startTime
                ).toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <AlertTriangle className="text-amber-500" />

          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Important Instructions
          </h2>
        </div>

        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
          <li>
            • Read every question carefully before
            answering.
          </li>

          <li>
            • Timer starts immediately after
            clicking <b>Start Exam</b>.
          </li>

          <li>
            • Do not refresh or close the browser
            during the exam.
          </li>

          <li>
            • All answers are auto-saved during the
            exam.
          </li>

          <li>
            • When the timer ends, the exam will be
            submitted automatically.
          </li>

          <li>
            • Once submitted, you cannot modify your
            answers.
          </li>
        </ul>
      </div>

      {/* Agreement */}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) =>
              setAccepted(event.target.checked)
            }
            className="h-5 w-5"
          />

          <span className="font-medium text-slate-800 dark:text-slate-100">
            I have read and understood all the
            instructions.
          </span>
        </label>
      </div>

      {/* Buttons */}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            navigate("/student/exams")
          }
          className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back
        </button>

        <button
          type="button"
          disabled={!accepted || loading}
          onClick={handleStartExam}
          className={`rounded-lg px-8 py-3 font-medium text-white transition ${
            accepted && !loading
              ? "bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-slate-400"
          }`}
        >
          {loading
            ? "Starting..."
            : "Start Exam"}
        </button>
      </div>
    </div>
  );
};

export default ExamInstructions;