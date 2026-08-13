import PropTypes from "prop-types";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

function AnnouncementRow({
  announcement,
  onEdit,
  onTogglePublish,
  onDelete,
  loading = false,
}) {
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const typeStyles = {
    exam: "bg-blue-100 text-blue-700",
    result: "bg-green-100 text-green-700",
    warning: "bg-orange-100 text-orange-700",
    info: "bg-slate-100 text-slate-700",
  };

  const statusStyles = announcement.isPublished
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <tr className="border-b border-slate-200 transition-colors hover:bg-slate-50">

      {/* Announcement */}

      <td className="max-w-md px-5 py-5">
        <div>
          <p className="font-semibold text-slate-800">
            {announcement.title}
          </p>

          <p
            className="mt-1 truncate text-sm text-slate-500"
            title={announcement.description}
          >
            {announcement.description}
          </p>
        </div>
      </td>

      {/* Type */}

      <td className="px-5 py-5 text-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            typeStyles[announcement.type] ||
            typeStyles.info
          }`}
        >
          {announcement.type}
        </span>
      </td>

      {/* Status */}

      <td className="px-5 py-5 text-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}
        >
          {announcement.isPublished
            ? "Published"
            : "Draft"}
        </span>
      </td>

      {/* Published */}

      <td className="px-5 py-5 text-center text-sm text-slate-600">
        {formatDate(
          announcement.publishedAt
        )}
      </td>

      {/* Expiry */}

      <td className="px-5 py-5 text-center text-sm text-slate-600">
        {formatDate(
          announcement.expiresAt
        )}
      </td>

      {/* Actions */}

      <td className="px-5 py-5">
        <div className="flex items-center justify-center gap-2">

          {/* Edit */}

          <button
            type="button"
            aria-label="Edit Announcement"
            disabled={loading}
            onClick={() =>
              onEdit(announcement)
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil size={18} />
          </button>

          {/* Publish / Unpublish */}

          <button
            type="button"
            aria-label={
              announcement.isPublished
                ? "Unpublish Announcement"
                : "Publish Announcement"
            }
            disabled={loading}
            onClick={() =>
              onTogglePublish(announcement)
            }
            className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
              announcement.isPublished
                ? "text-green-600 hover:bg-green-100 hover:text-green-700"
                : "text-slate-600 hover:bg-green-100 hover:text-green-700"
            }`}
          >
            {announcement.isPublished ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

          {/* Delete */}

          <button
            type="button"
            aria-label="Delete Announcement"
            disabled={loading}
            onClick={() =>
              onDelete(announcement)
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </td>

    </tr>
  );
}

AnnouncementRow.propTypes = {
  announcement:
    PropTypes.shape({
      _id:
        PropTypes.string.isRequired,

      title:
        PropTypes.string.isRequired,

      description:
        PropTypes.string.isRequired,

      type:
        PropTypes.oneOf([
          "exam",
          "result",
          "warning",
          "info",
        ]).isRequired,

      isPublished:
        PropTypes.bool.isRequired,

      publishedAt:
        PropTypes.string,

      expiresAt:
        PropTypes.string,
    }).isRequired,

  onEdit:
    PropTypes.func.isRequired,

  onTogglePublish:
    PropTypes.func.isRequired,

  onDelete:
    PropTypes.func.isRequired,

  loading:
    PropTypes.bool,
};

export default AnnouncementRow;