import PropTypes from "prop-types";
import {
  Search,
  RotateCcw,
} from "lucide-react";

function AnnouncementFilters({
  filters,
  onChange,
  onReset,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Search */}

        <div className="relative xl:col-span-2">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              onChange({
                search:
                  event.target.value,
              })
            }
            placeholder="Search announcements..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

        </div>

        {/* Type */}

        <select
          value={filters.type}
          onChange={(event) =>
            onChange({
              type:
                event.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >

          <option value="">
            All Types
          </option>

          <option value="exam">
            Exam
          </option>

          <option value="result">
            Result
          </option>

          <option value="warning">
            Warning
          </option>

          <option value="info">
            Information
          </option>

        </select>

        {/* Status */}

        <select
          value={filters.status}
          onChange={(event) =>
            onChange({
              status:
                event.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >

          <option value="">
            All Status
          </option>

          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>

        </select>

      </div>

      {/* Reset */}

      <div className="mt-5 flex justify-end">

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
        >

          <RotateCcw size={18} />

          Reset Filters

        </button>

      </div>

    </section>
  );
}

AnnouncementFilters.propTypes = {
  filters: PropTypes.shape({
    search:
      PropTypes.string,
    type:
      PropTypes.string,
    status:
      PropTypes.string,
  }).isRequired,

  onChange:
    PropTypes.func.isRequired,

  onReset:
    PropTypes.func.isRequired,
};

export default AnnouncementFilters;