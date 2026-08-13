import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

function DeleteAnnouncementModal({
  isOpen,
  announcement,
  loading = false,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    isOpen,
    loading,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-announcement-title"
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={28} />
            </div>

            <div>
              <h2
                id="delete-announcement-title"
                className="text-xl font-bold text-slate-900"
              >
                Delete Announcement
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close delete announcement dialog"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          <p className="text-slate-700">
            Are you sure you want to permanently
            delete this announcement?
          </p>

          {announcement && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <p className="font-semibold text-slate-800">
                {announcement.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {announcement.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    announcement.type ===
                    "exam"
                      ? "bg-blue-100 text-blue-700"
                      : announcement.type ===
                        "result"
                      ? "bg-green-100 text-green-700"
                      : announcement.type ===
                        "warning"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {announcement.type}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    announcement.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {announcement.isPublished
                    ? "Published"
                    : "Draft"}
                </span>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading || !announcement
            }
            onClick={() =>
              onConfirm(announcement)
            }
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={18} />

            {loading
              ? "Deleting..."
              : "Delete Announcement"}
          </button>

        </div>
      </div>
    </div>
  );
}

DeleteAnnouncementModal.propTypes = {
  isOpen:
    PropTypes.bool.isRequired,

  announcement:
    PropTypes.shape({
      _id:
        PropTypes.string,
      title:
        PropTypes.string,
      description:
        PropTypes.string,
      type:
        PropTypes.oneOf([
          "exam",
          "result",
          "warning",
          "info",
        ]),
      isPublished:
        PropTypes.bool,
    }),

  loading:
    PropTypes.bool,

  onClose:
    PropTypes.func.isRequired,

  onConfirm:
    PropTypes.func.isRequired,
};

export default DeleteAnnouncementModal;