import PropTypes from "prop-types";
import QuestionRow from "./QuestionRow";
import EmptyQuestions from "./EmptyQuestions";
import QuestionSkeleton from "./QuestionSkeleton";

function QuestionTable({
  questions,
  loading,
  error,
  onPreview,
  onEdit,
  onDelete,
}) {
  // Loading
  if (loading) {
    return <QuestionSkeleton />;
  }

  // Error
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-red-700">
          Failed to Load Questions
        </h3>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  // Empty
  if (!questions.length) {
    return <EmptyQuestions />;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr className="border-b border-slate-200">

              <th className="w-16 px-5 py-4 text-center text-sm font-semibold text-slate-700">
                #
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Subject
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Chapter
              </th>

              <th className="min-w-[350px] px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Question
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Difficulty
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Marks
              </th>

              <th className="w-44 px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {questions.map((question, index) => (

              <QuestionRow
                key={question._id}
                index={index}
                question={question}
                onPreview={onPreview}
                onEdit={onEdit}
                onDelete={onDelete}
              />

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold">
            {questions.length}
          </span>{" "}
          questions
        </p>

        <p className="text-sm text-slate-400">
          Question Bank
        </p>

      </div>

    </section>
  );
}

QuestionTable.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,

  loading: PropTypes.bool,

  error: PropTypes.string,

  onPreview: PropTypes.func.isRequired,

  onEdit: PropTypes.func.isRequired,

  onDelete: PropTypes.func.isRequired,
};

QuestionTable.defaultProps = {
  loading: false,
  error: null,
};

export default QuestionTable;