import PropTypes from "prop-types";
import AnnouncementRow from "./AnnouncementRow";

function AnnouncementTable({
  announcements,
  onEdit,
  onTogglePublish,
  onDelete,
  loading = false,
}) {
  if (!announcements.length) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">

          {/* Header */}

          <thead className="bg-slate-100">
            <tr className="border-b border-slate-200">

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Announcement
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Type
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Published
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Expires
              </th>

              <th className="w-48 px-5 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>

            </tr>
          </thead>

          {/* Body */}

          <tbody>
            {announcements.map((announcement) => (
              <AnnouncementRow
                key={announcement._id}
                announcement={announcement}
                onEdit={onEdit}
                onTogglePublish={onTogglePublish}
                onDelete={onDelete}
                loading={loading}
              />
            ))}
          </tbody>

        </table>
      </div>
    </section>
  );
}

AnnouncementTable.propTypes = {
  announcements: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,

      title: PropTypes.string.isRequired,

      description: PropTypes.string.isRequired,

      type: PropTypes.oneOf([
        "exam",
        "result",
        "warning",
        "info",
      ]).isRequired,

      isPublished: PropTypes.bool.isRequired,

      publishedAt: PropTypes.string,

      expiresAt: PropTypes.string,
    })
  ).isRequired,

  onEdit: PropTypes.func.isRequired,

  onTogglePublish:
    PropTypes.func.isRequired,

  onDelete:
    PropTypes.func.isRequired,

  loading: PropTypes.bool,
};

export default AnnouncementTable;