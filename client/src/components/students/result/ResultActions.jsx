import {
    ArrowLeft,
    Eye,
} from "lucide-react";

function ResultActions({
  onBack,
  onReview,
  reviewEnabled = false,
}) {
  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">

        {reviewEnabled && (
          <button
            type="button"
            onClick={onReview}
            className="rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 transition duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Eye size={18}/>
            Review Answers
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <ArrowLeft size={18}/>
          Back to Dashboard
        </button>

      </div>
    </section>
  );
}

export default ResultActions;