import { useNavigate } from "react-router-dom";
import { Search, RotateCcw, Plus } from "lucide-react";

function TestToolbar({
  filters,
  onFilterChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Tests
          </h1>

          <p className="mt-1 text-slate-500">
            Create, publish and manage all tests.
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/admin/tests/create")
          }
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Test
        </button>

      </div>

      {/* Filters */}

      <div className="grid gap-4 lg:grid-cols-5">

        {/* Search */}

        <div className="relative lg:col-span-2">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={filters.search}
            placeholder="Search Test..."
            onChange={(e) =>
              onFilterChange({
                search: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600"
          />

        </div>

        {/* Subject */}

        <select
          value={filters.subject}
          onChange={(e) =>
            onFilterChange({
              subject: e.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
        >
          <option value="">
            All Subjects
          </option>

          <option value="Physics">
            Physics
          </option>

          <option value="Chemistry">
            Chemistry
          </option>

          <option value="Mathematics">
            Mathematics
          </option>

          <option value="Biology">
            Biology
          </option>

        </select>

        {/* Status */}

        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({
              status: e.target.value,
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
        >
          <option value="">
            All Status
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="published">
            Published
          </option>

        </select>

        {/* Sort */}

        <div className="flex gap-2">

          <select
            value={filters.sort}
            onChange={(e) =>
              onFilterChange({
                sort: e.target.value,
              })
            }
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="title">
              Title
            </option>

            <option value="subject">
              Subject
            </option>

          </select>

          <button
            onClick={() =>
              onFilterChange({
                search: "",
                subject: "",
                status: "",
                sort: "newest",
              })
            }
            className="rounded-xl border border-slate-300 px-4 transition hover:bg-slate-100"
          >
            <RotateCcw size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default TestToolbar;