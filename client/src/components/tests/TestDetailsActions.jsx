import {
  ArrowLeft,
  Pencil,
  Upload,
  Trash2,
} from "lucide-react";

function TestDetailsActions({
  test,
  onBack,
  onEdit,
  onPublish,
  onDelete,
  publishLoading = false,
  deleteLoading = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-lg font-semibold text-slate-800">
        Actions
      </h2>

      <div className="flex flex-wrap gap-4">

        {/* Back */}

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <ArrowLeft size={18} />

          Back
        </button>

        {/* Edit */}

        <button
          type="button"
          onClick={() => onEdit(test)}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-medium text-white transition hover:bg-amber-600"
        >
          <Pencil size={18} />

          Edit Test
        </button>

        {/* Publish */}

        <button
          type="button"
          disabled={
            publishLoading ||
            test?.status === "published"
          }
          onClick={() => onPublish(test)}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium text-white transition ${
            test?.status === "published"
              ? "cursor-not-allowed bg-slate-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <Upload size={18} />

          {publishLoading
            ? "Publishing..."
            : test?.status === "published"
            ? "Published"
            : "Publish"}
        </button>

        {/* Delete */}

        <button
          type="button"
          disabled={deleteLoading}
          onClick={() => onDelete(test)}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={18} />

          {deleteLoading
            ? "Deleting..."
            : "Delete"}
        </button>

      </div>

    </div>
  );
}

export default TestDetailsActions;