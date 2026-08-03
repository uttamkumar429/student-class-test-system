import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

function DeleteQuestionModal({
  isOpen,
  question,
  loading = false,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">

              <AlertTriangle size={28} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Delete Question
              </h2>

              <p className="text-sm text-slate-500">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          <p className="text-slate-700">
            Are you sure you want to permanently
            delete this question?
          </p>

          {question && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <p className="font-semibold text-slate-800">
                {question.question}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {question.subject}
                </span>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                  {question.chapter}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    question.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : question.difficulty ===
                        "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {question.difficulty}
                </span>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              onConfirm(question)
            }
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={18} />

            {loading
              ? "Deleting..."
              : "Delete Question"}
          </button>

        </div>

      </div>
    </div>
  );
}

DeleteQuestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,

  question: PropTypes.shape({
    _id: PropTypes.string,
    question: PropTypes.string,
    subject: PropTypes.string,
    chapter: PropTypes.string,
    difficulty: PropTypes.string,
  }),

  loading: PropTypes.bool,

  onClose: PropTypes.func.isRequired,

  onConfirm: PropTypes.func.isRequired,
};

export default DeleteQuestionModal;