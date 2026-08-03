import PropTypes from "prop-types";
import { FileQuestion, Plus } from "lucide-react";

function EmptyQuestions({
  title = "No Questions Found",
  description = "There are no questions available. Create your first question to get started.",
  buttonText = "Add Question",
  onCreate,
}) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 shadow-sm">

      <div className="flex flex-col items-center text-center">

        {/* Icon */}

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">

          <FileQuestion size={42} />

        </div>

        {/* Title */}

        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Description */}

        <p className="mt-3 max-w-md text-slate-500">
          {description}
        </p>

        {/* Button */}

        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />

            {buttonText}
          </button>
        )}

      </div>

    </section>
  );
}

EmptyQuestions.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  onCreate: PropTypes.func,
};

export default EmptyQuestions;