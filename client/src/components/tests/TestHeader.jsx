import {
  ArrowLeft,
  FileText,
  Clock,
  BookOpen,
  Calendar,
} from "lucide-react";

function TestHeader({
  title,
  subject,
  status,
  duration,
  totalQuestions,
  onBack,
}) {
  const getStatusColor = () => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";

      case "draft":
        return "bg-yellow-100 text-yellow-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "archived":
        return "bg-slate-200 text-slate-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      {/* Top */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border p-2 transition hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              {title}
            </h1>

            <p className="mt-1 text-slate-500">
              Test Details
            </p>

          </div>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusColor()}`}
        >
          {status}
        </span>

      </div>

      {/* Statistics */}

      <div className="mt-8 grid gap-5 md:grid-cols-4">

        <div className="flex items-center gap-3 rounded-xl border p-4">

          <BookOpen
            className="text-blue-600"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-500">
              Subject
            </p>

            <h3 className="font-semibold">
              {subject}
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-3 rounded-xl border p-4">

          <Clock
            className="text-green-600"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-500">
              Duration
            </p>

            <h3 className="font-semibold">
              {duration} Minutes
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-3 rounded-xl border p-4">

          <FileText
            className="text-purple-600"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-500">
              Questions
            </p>

            <h3 className="font-semibold">
              {totalQuestions}
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-3 rounded-xl border p-4">

          <Calendar
            className="text-orange-600"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-500">
              Status
            </p>

            <h3 className="font-semibold capitalize">
              {status}
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TestHeader;