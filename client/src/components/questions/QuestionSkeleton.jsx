function QuestionSkeleton() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Table Header */}

      <div className="border-b border-slate-200 bg-slate-100 px-6 py-4">

        <div className="grid grid-cols-7 gap-6">

          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-5 animate-pulse rounded bg-slate-300"
            />
          ))}

        </div>

      </div>

      {/* Table Body */}

      <div>

        {Array.from({ length: 8 }).map((_, row) => (

          <div
            key={row}
            className="grid grid-cols-7 items-center gap-6 border-b border-slate-100 px-6 py-5"
          >

            <div className="h-4 w-8 animate-pulse rounded bg-slate-200" />

            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

            <div className="mx-auto h-7 w-20 animate-pulse rounded-full bg-slate-200" />

            <div className="mx-auto h-4 w-10 animate-pulse rounded bg-slate-200" />

            <div className="flex justify-center gap-3">

              <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />

              <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />

              <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default QuestionSkeleton;