import PropTypes from "prop-types";
import { Plus, Upload, BookOpen } from "lucide-react";

function QuestionHeader({
  totalQuestions = 0,
  onAddQuestion,
  onImportQuestions,
}) {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-8 text-white shadow-lg">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">

              <BookOpen size={32} />

            </div>

            <div>

              <p className="text-sm uppercase tracking-[3px] text-blue-100">
                Question Management
              </p>

              <h1 className="mt-1 text-4xl font-bold">
                Question Bank
              </h1>

            </div>

          </div>

          <p className="mt-6 max-w-2xl text-blue-100">
            Manage your complete question bank.
            Create, edit and organize questions
            efficiently for upcoming examinations.
          </p>

        </div>

        {/* Right */}

        <div className="flex flex-wrap gap-4">

          <button
            type="button"
            onClick={onImportQuestions}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-medium backdrop-blur transition hover:bg-white/20"
          >
            <Upload size={20} />

            Import
          </button>

          <button
            type="button"
            onClick={onAddQuestion}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:scale-105 hover:bg-slate-100"
          >
            <Plus size={20} />

            Add Question
          </button>

        </div>

      </div>

      {/* Bottom Stats */}

      <div className="mt-8 flex items-center gap-3">

        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          Total Questions : {totalQuestions}
        </span>

      </div>

    </section>
  );
}

QuestionHeader.propTypes = {
  totalQuestions: PropTypes.number,
  onAddQuestion: PropTypes.func.isRequired,
  onImportQuestions: PropTypes.func,
};

export default QuestionHeader;