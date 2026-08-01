import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

function SubmitModal({
  isOpen,
  onClose,
  onConfirm,
  answeredQuestions,
  totalQuestions,
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const unansweredQuestions = Math.max(
    0,
    totalQuestions - answeredQuestions
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-exam-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={!loading ? onClose : undefined}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="border-b border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <AlertTriangle
              size={28}
              className="text-amber-500"
            />

            <div>

              <h2
                id="submit-exam-title"
                className="text-2xl font-bold text-slate-800"
              >
                Submit Examination
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Please review your progress before submitting.
              </p>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="space-y-4 p-6">

          <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={20}
                className="text-green-600"
              />

              <span className="font-medium text-slate-700">
                Answered
              </span>

            </div>

            <span className="font-bold text-green-600">
              {answeredQuestions} / {totalQuestions}
            </span>

          </div>

          <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">

            <div className="flex items-center gap-2">

              <XCircle
                size={20}
                className="text-red-600"
              />

              <span className="font-medium text-slate-700">
                Unanswered
              </span>

            </div>

            <span className="font-bold text-red-600">
              {unansweredQuestions}
            </span>

          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

            <p className="text-sm leading-6 text-amber-800">

              Once you submit your examination,
              <span className="font-semibold">
                {" "}
                you will not be able to modify any answers.
              </span>

            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              rounded-xl
              border
              border-slate-300
              px-5
              py-3
              font-medium
              transition
              hover:bg-slate-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="
              rounded-xl
              bg-red-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "Submitting..."
              : "Submit Exam"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default SubmitModal;