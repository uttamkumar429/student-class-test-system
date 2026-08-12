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
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-7">

        {/* =================================
            Search
        ================================= */}

        <div className="relative xl:col-span-2">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search question..."
            value={filters.search}
            onChange={(event) =>
              onChange({
                search: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* =================================
            Subject
        ================================= */}

        <select
          value={filters.subject}
          onChange={(event) =>
            onChange({
              subject: event.target.value,
              chapter: "",
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

        {/* =================================
            Chapter
        ================================= */}

        <select
          value={filters.chapter}
          onChange={(event) =>
            onChange({
              chapter: event.target.value,
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

        {/* =================================
            Difficulty
        ================================= */}

        <select
          value={filters.difficulty}
          onChange={(event) =>
            onChange({
              difficulty: event.target.value,
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

        {/* =================================
            Sort By
        ================================= */}

        <select
          value={filters.sortBy}
          onChange={(event) =>
            onChange({
              sortBy: event.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="createdAt">
            Sort by Date
          </option>

          <option value="subject">
            Sort by Subject
          </option>

          <option value="difficulty">
            Sort by Difficulty
          </option>

          <option value="marks">
            Sort by Marks
          </option>
        </select>

        {/* =================================
            Sort Order
        ================================= */}

        <select
          value={filters.order}
          onChange={(event) =>
            onChange({
              order: event.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="desc">
            Descending
          </option>

          <option value="asc">
            Ascending
          </option>
        </select>
      </div>

      {/* =================================
          Reset
      ================================= */}

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
    search: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    chapter: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    sortBy: PropTypes.oneOf([
      "createdAt",
      "subject",
      "difficulty",
      "marks",
    ]).isRequired,
    order: PropTypes.oneOf([
      "asc",
      "desc",
    ]).isRequired,
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

QuestionFilters.defaultProps = {
  subjects: [],
  chapters: [],
};

export default QuestionFilters;