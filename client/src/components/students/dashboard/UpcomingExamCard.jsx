import PropTypes from "prop-types";
import {
  CalendarDays,
  Clock3,
  BookOpen,
  PlayCircle,
} from "lucide-react";

function UpcomingExamCard({
  title,
  subject,
  examDate,
  duration,
  totalMarks,
  onStart,
}) {
  const formattedExamDate = new Date(
    examDate
  ).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Top */}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen
              size={20}
              className="text-blue-600"
            />

            <h3 className="text-lg font-semibold text-slate-800">
              {title}
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {subject}
          </p>
        </div>
      </div>

      {/* Details */}

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <CalendarDays
            size={18}
            className="text-slate-500"
          />

          <span>{formattedExamDate}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Clock3
            size={18}
            className="text-slate-500"
          />

          <span>{duration} Minutes</span>
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
        type="button"
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
  title: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  examDate: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  totalMarks: PropTypes.number.isRequired,
  onStart: PropTypes.func,
};

UpcomingExamCard.defaultProps = {
  onStart: () => {},
};

export default UpcomingExamCard;