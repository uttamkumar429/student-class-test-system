import PropTypes from "prop-types";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Trophy,
  CheckCircle2,
  XCircle,
  CircleDashed,
} from "lucide-react";

function ReviewHeader({ review }) {
  const {
    examTitle,
    subject,
    obtainedMarks,
    totalMarks,
    percentage,
    submittedAt,
    timeTaken,
    questions = [],
  } = review;

  const totalQuestions = questions.length;

  const correctAnswers = questions.filter(
    (q) => q.isCorrect
  ).length;

  const wrongAnswers = questions.filter(
    (q) => q.selectedAnswer && !q.isCorrect
  ).length;

  const skippedAnswers = questions.filter(
    (q) => !q.selectedAnswer
  ).length;

  const isPassed = percentage >= 33;

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }

    return `${mins}m ${secs}s`;
  };

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">

      {/* Hero */}

      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-8 text-white">

        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[4px] text-blue-100">
              Exam Review
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {examTitle}
            </h1>

            <div className="mt-5 flex flex-wrap gap-6 text-blue-100">

              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                {subject}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                {submittedAt
                  ? new Date(submittedAt).toLocaleString()
                  : "-"}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={18} />
                {formatTime(timeTaken)}
              </div>

            </div>

          </div>

          <div
            className={`rounded-2xl px-8 py-6 text-center shadow-lg ${
              isPassed
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            <Trophy
              size={36}
              className="mx-auto"
            />

            <p className="mt-3 text-sm uppercase tracking-widest">
              Result
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {isPassed ? "PASS" : "FAIL"}
            </h2>

          </div>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 p-8 md:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Score"
          value={`${obtainedMarks}/${totalMarks}`}
        />

        <StatCard
          title="Percentage"
          value={`${percentage}%`}
        />

        <StatCard
          title="Correct"
          value={correctAnswers}
          icon={
            <CheckCircle2
              className="text-green-600"
              size={22}
            />
          }
        />

        <StatCard
          title="Wrong"
          value={wrongAnswers}
          icon={
            <XCircle
              className="text-red-600"
              size={22}
            />
          }
        />

        <StatCard
          title="Skipped"
          value={skippedAnswers}
          icon={
            <CircleDashed
              className="text-slate-500"
              size={22}
            />
          }
        />

      </div>

      {/* Footer */}

      <div className="border-t bg-slate-50 px-8 py-4">

        <p className="text-sm text-slate-600">

          Total Questions :

          <span className="ml-2 font-semibold text-slate-900">
            {totalQuestions}
          </span>

        </p>

      </div>

    </section>
  );
}

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        {icon}

      </div>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </h2>

    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  icon: PropTypes.node,
};

ReviewHeader.propTypes = {
  review: PropTypes.shape({
    examTitle: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    obtainedMarks: PropTypes.number.isRequired,
    totalMarks: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    submittedAt: PropTypes.string,
    timeTaken: PropTypes.number,
    questions: PropTypes.array.isRequired,
  }).isRequired,
};

export default ReviewHeader;