import PropTypes from "prop-types";
import { Megaphone, Plus } from "lucide-react";

function AnnouncementHeader({
  totalAnnouncements = 0,
  onCreate,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Megaphone size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Announcements
              </h1>

              <p className="mt-1 text-slate-500">
                Create and manage announcements for students.
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Total:
            <span className="ml-1 font-semibold text-slate-700">
              {totalAnnouncements}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Announcement
        </button>

      </div>
    </section>
  );
}

AnnouncementHeader.propTypes = {
  totalAnnouncements:
    PropTypes.number,
  onCreate:
    PropTypes.func.isRequired,
};

export default AnnouncementHeader;