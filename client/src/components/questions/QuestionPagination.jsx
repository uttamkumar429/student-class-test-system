import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function QuestionPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem =
    (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    totalItems
  );

  const renderPages = () => {
    const pages = [];

    let start = Math.max(
      currentPage - 2,
      1
    );

    let end = Math.min(
      start + 4,
      totalPages
    );

    if (end - start < 4) {
      start = Math.max(
        end - 4,
        1
      );
    }

    for (
      let page = start;
      page <= end;
      page++
    ) {
      pages.push(
        <button
          key={page}
          type="button"
          onClick={() =>
            onPageChange(page)
          }
          className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${
            currentPage === page
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {page}
        </button>
      );
    }

    return pages;
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      {/* Info */}

      <p className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalItems}
        </span>{" "}
        questions
      </p>

      {/* Pagination */}

      <div className="flex items-center gap-2">

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {renderPages()}

        <button
          type="button"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>

      </div>

    </section>
  );
}

QuestionPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default QuestionPagination;