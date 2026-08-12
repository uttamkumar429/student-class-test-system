import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";
import QuestionForm from "../../components/questions/QuestionForm";

import {
  fetchQuestionById,
  updateQuestion,
} from "../../redux/adminQuestion/questionThunk";

import {
  clearError,
} from "../../redux/adminQuestion/questionSlice";

import {
  selectCurrentQuestion,
  selectQuestionLoading,
  selectQuestionError,
} from "../../redux/adminQuestion/questionSelectors";

function EditQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const question = useSelector(selectCurrentQuestion);
  const loading = useSelector(selectQuestionLoading);
  const error = useSelector(selectQuestionError);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH QUESTION
  // ==========================================

  useEffect(() => {
    if (!id) {
      toast.error("Invalid question ID.");
      navigate("/admin/questions");
      return;
    }

    dispatch(fetchQuestionById(id));

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id, navigate]);

  // ==========================================
  // UPDATE QUESTION
  // ==========================================

  const handleUpdate = async (formData) => {
    if (!id) {
      toast.error("Invalid question ID.");
      return;
    }

    try {
      setSaving(true);

      await dispatch(
        updateQuestion({
          questionId: id,
          questionData: formData,
        })
      ).unwrap();

      toast.success(
        "Question updated successfully."
      );

      navigate("/admin/questions");
    } catch (error) {
      toast.error(
        error || "Failed to update question."
      );
    } finally {
      setSaving(false);
    }
  };

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
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold text-red-600">
            Failed to Load Question
          </h2>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                dispatch(fetchQuestionById(id));
              }}
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/questions")
              }
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to Questions
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // QUESTION NOT FOUND
  // ==========================================

  if (!question) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-700">
            Question Not Found
          </h2>

          <p className="mt-3 text-slate-500">
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
  // UI
  // ==========================================

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}

        <div>
          <p className="text-sm font-medium text-blue-600">
            Question Bank
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Edit Question
          </h1>

          <p className="mt-2 text-slate-500">
            Update the question details below.
          </p>
        </div>

        {/* Form */}

        <QuestionForm
          mode="edit"
          initialValues={question}
          loading={saving}
          onSubmit={handleUpdate}
        />
      </div>
    </DashboardLayout>
  );
}

export default EditQuestion;