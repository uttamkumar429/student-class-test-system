import PropTypes from "prop-types";
import {
  CalendarDays,
  Clock3,
  BookOpen,
  PlayCircle,
} from "lucide-react";

function UpcomingExamCard({
  subject,
  examDate,
  duration,
  totalMarks,
  difficulty = "Medium",
  onStart,
}) {
  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Top */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <BookOpen
              size={20}
              className="text-blue-600"
            />

            <h3 className="text-lg font-semibold text-slate-800">
              {subject}
            </h3>

          </div>

          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              difficultyStyles[difficulty]
            }`}
          >
            {difficulty}
          </span>

        </div>

      </div>

      {/* Details */}

      <div className="mt-6 space-y-3">

        <div className="flex items-center gap-3 text-sm text-slate-600">

          <CalendarDays
            size={18}
            className="text-slate-500"
          />

          <span>{examDate}</span>

        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">

          <Clock3
            size={18}
            className="text-slate-500"
          />

          <span>{duration}</span>

        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">

          <BookOpen
            size={18}
            className="text-slate-500"
          />

          <span>{totalMarks} Marks</span>

        </div>

      </div>

      {/* Button */}

      <button
        onClick={onStart}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        <PlayCircle size={20} />

        Start Exam
      </button>

    </div>
  );
}

UpcomingExamCard.propTypes = {
  subject: PropTypes.string.isRequired,
  examDate: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  totalMarks: PropTypes.number.isRequired,
  difficulty: PropTypes.oneOf([
    "Easy",
    "Medium",
    "Hard",
  ]),
  onStart: PropTypes.func,
};

UpcomingExamCard.defaultProps = {
  onStart: () => {},
};

export default UpcomingExamCard;