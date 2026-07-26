import { Search, Plus } from "lucide-react";

    function StudentToolbar({
        search,
        setSearch,
        onAddStudent,
    }) {
  return (
    <div className="mb-6 flex items-center justify-between">

      <div className="relative w-80">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or ID..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-600"
        />
      </div>

        <button
        type="button"
        onClick={onAddStudent}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >

        <Plus size={18} />

        Add Student

      </button>

    </div>
  );
}

export default StudentToolbar;