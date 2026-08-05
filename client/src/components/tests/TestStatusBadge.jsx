function TestStatusBadge({ status }) {
const styles = {
  draft:
    "bg-yellow-100 text-yellow-700 border-yellow-200",

  published:
    "bg-green-100 text-green-700 border-green-200",

  completed:
    "bg-blue-100 text-blue-700 border-blue-200",

  archived:
    "bg-slate-200 text-slate-700 border-slate-300",
};

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

export default TestStatusBadge;