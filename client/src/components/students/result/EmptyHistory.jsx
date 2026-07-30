import { FaClipboardList } from "react-icons/fa";

function EmptyHistory() {
  return (
    <section className="rounded-xl bg-white p-12 shadow">
      <div className="flex flex-col items-center justify-center text-center">

        <div className="mb-6 rounded-full bg-blue-100 p-5">
          <FaClipboardList
            className="text-5xl text-blue-600"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          No Result History Found
        </h2>

        <p className="mt-3 max-w-md text-gray-600">
          You haven't completed any exams yet.
          Once you submit your first exam,
          your results will appear here.
        </p>

      </div>
    </section>
  );
}

export default EmptyHistory;