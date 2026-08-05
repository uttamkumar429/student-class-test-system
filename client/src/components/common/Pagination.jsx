function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">

      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((number) => (
        <button
          key={number}
          onClick={() =>
            onPageChange(number)
          }
          className={`h-10 w-10 rounded-lg border transition ${
            number === page
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-100"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() =>
          onPageChange(page + 1)
        }
        className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;