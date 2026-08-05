import {
  Eye,
  Pencil,
  Trash2,
  Rocket,
} from "lucide-react";

function TestActionMenu({
  test,
  onView,
  onEdit,
  onPublish,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-center gap-3">

      <button
        onClick={() => onView(test)}
        className="text-slate-600 transition hover:text-blue-600"
      >
        <Eye size={18} />
      </button>

      <button
        onClick={() => onEdit(test)}
        className="text-slate-600 transition hover:text-amber-600"
      >
        <Pencil size={18} />
      </button>

      {test.status === "draft" && (
        <button
          onClick={() => onPublish(test)}
          className="text-slate-600 transition hover:text-green-600"
        >
          <Rocket size={18} />
        </button>
      )}

      <button
        onClick={() => onDelete(test)}
        className="text-slate-600 transition hover:text-red-600"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}

export default TestActionMenu;