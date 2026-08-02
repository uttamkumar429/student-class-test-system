import PropTypes from "prop-types";
import { Lightbulb } from "lucide-react";

function ExplanationCard({ explanation }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-100 px-6 py-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">

          <Lightbulb size={20} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-slate-900">
            Explanation
          </h3>

          <p className="text-sm text-slate-600">
            Understand why this answer is correct.
          </p>

        </div>

      </div>

      {/* Content */}

      <div className="px-6 py-6">

        {explanation ? (
          <p className="whitespace-pre-line leading-8 text-slate-700">
            {explanation}
          </p>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

            <p className="text-slate-500">
              No explanation is available for this question.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}

ExplanationCard.propTypes = {
  explanation: PropTypes.string,
};

ExplanationCard.defaultProps = {
  explanation: "",
};

export default ExplanationCard;