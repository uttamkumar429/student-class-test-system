import {
  Search,
  CheckSquare,
  Square,
} from "lucide-react";

function QuestionSelectorToolbar({
  search,
  onSearchChange,
  subject,
  onSubjectChange,
  difficulty,
  onDifficultyChange,
  subjects = [],
  onSelectAll,
  onClearSelection,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-4">
        {/* =================================
            Search
        ================================= */}

        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search question..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* =================================
            Subject
        ================================= */}

        <select
          value={subject}
          onChange={(event) =>
            onSubjectChange(
              event.target.value
            )
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">
            All Subjects
          </option>

          {subjects.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {/* =================================
            Difficulty
        ================================= */}

        <select
          value={difficulty}
          onChange={(event) =>
            onDifficultyChange(
              event.target.value
            )
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
            Selection Actions
        ================================= */}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            title="Select all currently loaded questions"
            onClick={onSelectAll}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckSquare size={18} />
            Select Page
          </button>

          <button
            type="button"
            title="Clear all selected questions"
            onClick={onClearSelection}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <Square size={18} />
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}

export default QuestionSelectorToolbar;