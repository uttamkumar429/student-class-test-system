import PropTypes from "prop-types";
import {
  Search,
  RotateCcw,
} from "lucide-react";

function QuestionFilters({
  filters,
  subjects = [],
  chapters = [],
  onChange,
  onReset,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

        {/* Search */}

        <div className="relative xl:col-span-2">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search question..."
            value={filters.search}
            onChange={(e) =>
              onChange({
                search: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

        </div>

        {/* Subject */}

        <select
          value={filters.subject}
          onChange={(e) =>
            onChange({
              subject: e.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">
            All Subjects
          </option>

          {subjects.map((subject) => (
            <option
              key={subject}
              value={subject}
            >
              {subject}
            </option>
          ))}

        </select>

        {/* Chapter */}

        <select
          value={filters.chapter}
          onChange={(e) =>
            onChange({
              chapter: e.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">
            All Chapters
          </option>

          {chapters.map((chapter) => (
            <option
              key={chapter}
              value={chapter}
            >
              {chapter}
            </option>
          ))}

        </select>

        {/* Difficulty */}

        <select
          value={filters.difficulty}
          onChange={(e) =>
            onChange({
              difficulty: e.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">
            All Difficulty
          </option>

          <option value="Easy">
            Easy
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Hard">
            Hard
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

QuestionFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    subject: PropTypes.string,
    chapter: PropTypes.string,
    difficulty: PropTypes.string,
  }).isRequired,

  subjects: PropTypes.arrayOf(
    PropTypes.string
  ),

  chapters: PropTypes.arrayOf(
    PropTypes.string
  ),

  onChange: PropTypes.func.isRequired,

  onReset: PropTypes.func.isRequired,
};

export default QuestionFilters;