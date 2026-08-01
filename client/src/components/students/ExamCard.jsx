import {
  BookOpen,
  Clock3,
  CalendarDays,
 Award,
  PlayCircle,
} from "lucide-react";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

function ExamCard({ exam, onStart }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Header */}

      <div className="mb-4 flex items-start justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            {exam.title}
          </h2>

          <p className="mt-1 flex items-center gap-2 text-slate-500">

            <BookOpen size={16} />

            {exam.subject}

          </p>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            exam.status === "UPCOMING"
              ? "bg-green-100 text-green-700"
              : exam.status === "ACTIVE"
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {exam.status}
        </span>

      </div>

      {/* Details */}

      <div className="space-y-3 text-sm">

        <div className="flex items-center justify-between">

          <span className="text-slate-500">
            Questions
          </span>

          <span className="font-semibold">
            {exam.totalQuestions}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-slate-500">
            Total Marks
          </span>

          <span className="flex items-center gap-1 font-semibold">

            <Award size={16} />

            {exam.totalMarks}

          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-slate-500">
            Duration
          </span>

          <span className="flex items-center gap-1 font-semibold">

            <Clock3 size={16} />

            {exam.duration} mins

          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-slate-500">
            Date
          </span>

          <span className="flex items-center gap-1">

            <CalendarDays size={16} />

            {formatDate(exam.startTime)}

          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-slate-500">
            Time
          </span>

          <span>

            {formatTime(exam.startTime)}

          </span>

        </div>

      </div>

      {/* Footer */}

      <button
        disabled={exam.status !== "ACTIVE"}
        onClick={() => onStart(exam)}
        className={`mt-6 w-full rounded-xl py-3 font-semibold text-white transition ${
          exam.status === "ACTIVE"
            ? "bg-blue-600 hover:bg-blue-700"
            : "cursor-not-allowed bg-slate-400"
        }`}
      >
        <PlayCircle size={18} />
        {exam.status === "ACTIVE"
          ? "Start Exam"
          : "Not Started Yet"}
      </button>

    </div>
  );
}

export default ExamCard;