import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileText,
  Pencil,
  User,
} from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  fetchQuestionById,
} from "../../redux/adminQuestion/questionThunk";

import {
  clearCurrentQuestion,
  clearError,
} from "../../redux/adminQuestion/questionSlice";

import {
  selectCurrentQuestion,
  selectQuestionLoading,
  selectQuestionError,
} from "../../redux/adminQuestion/questionSelectors";

function QuestionDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const question = useSelector(
    selectCurrentQuestion
  );

  const loading = useSelector(
    selectQuestionLoading
  );

  const error = useSelector(
    selectQuestionError
  );

  // ==========================================
  // FETCH QUESTION
  // ==========================================

  useEffect(() => {
    if (!id) {
      toast.error("Invalid question ID.");
      navigate("/admin/questions");
      return;
    }

    dispatch(clearCurrentQuestion());
    dispatch(fetchQuestionById(id));

    return () => {
      dispatch(clearCurrentQuestion());
      dispatch(clearError());
    };
  }, [dispatch, id, navigate]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !question) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            <h2 className="mt-5 text-xl font-semibold text-slate-700">
              Loading Question...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching question details.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !question) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-red-100 p-3 text-red-600">
                <CircleHelp size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-red-700">
                  Failed to Load Question
                </h2>

                <p className="mt-2 text-red-600">
                  {error}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(fetchQuestionById(id));
                }}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Retry
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/questions")
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back to Questions
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!question) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <FileText size={28} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-800">
            Question Not Found
          </h2>

          <p className="mt-2 text-slate-500">
            The requested question does not exist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/questions")
            }
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Questions
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // HELPERS
  // ==========================================

  const options = [
    {
      key: "A",
      label: "Option A",
      value: question.optionA,
    },
    {
      key: "B",
      label: "Option B",
      value: question.optionB,
    },
    {
      key: "C",
      label: "Option C",
      value: question.optionC,
    },
    {
      key: "D",
      label: "Option D",
      value: question.optionD,
    },
  ];

  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700 border-green-200",
    Medium:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    Hard: "bg-red-100 text-red-700 border-red-200",
  };

  const formattedCreatedAt = question.createdAt
    ? new Date(
        question.createdAt
      ).toLocaleString()
    : "Not available";

  const formattedUpdatedAt = question.updatedAt
    ? new Date(
        question.updatedAt
      ).toLocaleString()
    : "Not available";

  // ==========================================
  // UI
  // ==========================================

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Question Bank
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Question Details
            </h1>

            <p className="mt-2 text-slate-500">
              Preview the complete question information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/admin/questions")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/questions/edit/${question._id}`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Pencil size={18} />
              Edit Question
            </button>
          </div>
        </div>

        {/* Question Metadata */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Question Information
            </h2>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Subject
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {question.subject}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Chapter
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {question.chapter}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Difficulty
              </p>

              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                  difficultyStyles[
                    question.difficulty
                  ] ||
                  "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {question.difficulty}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Marks
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {question.marks}
              </p>
            </div>
          </div>
        </section>

        {/* Question */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 p-6">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CircleHelp size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Question
              </h2>

              <p className="text-sm text-slate-500">
                Question text
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="whitespace-pre-wrap text-lg leading-8 text-slate-800">
                {question.question}
              </p>
            </div>
          </div>
        </section>

        {/* Options */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Options
            </h2>
          </div>

          <div className="space-y-4 p-6">
            {options.map((option) => {
              const isCorrect =
                option.key ===
                question.correctAnswer;

              return (
                <div
                  key={option.key}
                  className={`rounded-xl border p-4 transition ${
                    isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
                        isCorrect
                          ? "bg-green-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {option.key}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-500">
                        {option.label}
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-base text-slate-800">
                        {option.value}
                      </p>
                    </div>

                    {isCorrect && (
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 size={14} />
                        Correct Answer
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Explanation */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Explanation
            </h2>
          </div>

          <div className="p-6">
            {question.explanation ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="whitespace-pre-wrap leading-7 text-slate-700">
                  {question.explanation}
                </p>
              </div>
            ) : (
              <p className="text-sm italic text-slate-500">
                No explanation provided.
              </p>
            )}
          </div>
        </section>

        {/* Audit Information */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Record Information
            </h2>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <FileText
                size={18}
                className="mt-0.5 text-slate-500"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Question ID
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {question._id}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <User
                size={18}
                className="mt-0.5 text-slate-500"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Created By
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {question.createdBy?.fullName ||
                    "Not available"}
                </p>

                {question.createdBy?.email && (
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {question.createdBy.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <CalendarDays
                size={18}
                className="mt-0.5 text-slate-500"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Created At
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {formattedCreatedAt}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Last Updated
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {formattedUpdatedAt}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} />
            Question details are read-only in preview mode.
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/questions")
            }
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to Question Bank
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default QuestionDetails;