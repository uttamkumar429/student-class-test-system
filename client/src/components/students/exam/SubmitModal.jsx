// import React from "react";
// import React, { useEffect } from "react";
import { useEffect } from "react";

function SubmitModal({
  isOpen,
  onClose,
  onConfirm,
  answeredQuestions,
  totalQuestions,
  loading = false,
}) {
  if (!isOpen) return null;

    const unansweredQuestions = Math.max(
    0,
    totalQuestions - answeredQuestions
    );
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
        onClose();
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
        window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);
    return (
       <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
        <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-2xl font-bold text-gray-800">
          Submit Examination
        </h2>

        <div className="mt-6 space-y-4">

          <div className="flex justify-between rounded-lg bg-green-50 p-3">
            <span className="font-medium text-gray-700">
              Answered
            </span>

            <span className="font-bold text-green-600">
              {answeredQuestions} / {totalQuestions}
            </span>
          </div>

          <div className="flex justify-between rounded-lg bg-red-50 p-3">
            <span className="font-medium text-gray-700">
              Unanswered
            </span>

            <span className="font-bold text-red-600">
              {unansweredQuestions}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Once you submit the exam, you won't be able to
            change your answers.
          </p>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Exam"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default SubmitModal;
