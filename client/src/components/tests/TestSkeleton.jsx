function TestSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-6">

      <div className="mb-6 h-6 w-60 rounded bg-slate-200"></div>

      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="mb-4 h-12 rounded bg-slate-100"
        />
      ))}

    </div>
  );
}

export default TestSkeleton;