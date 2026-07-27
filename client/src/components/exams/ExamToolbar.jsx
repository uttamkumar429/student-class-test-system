import { Plus, Search } from "lucide-react";

const ExamToolbar = ({ search, setSearch, onAdd }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Box */}
      <div className="relative w-full md:w-96">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by title, subject or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
      >
        <Plus size={18} />
        Add Exam
      </button>
    </div>
  );
};

export default ExamToolbar;