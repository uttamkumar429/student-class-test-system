function QuestionSelectorSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-100 px-6 py-4">

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-5 animate-pulse rounded bg-slate-300"
          />
        ))}

      </div>

      {/* Body */}

      {Array.from({ length: 8 }).map((_, row) => (

        <div
          key={row}
          className="grid grid-cols-5 items-center gap-4 border-b border-slate-100 px-6 py-5"
        >

          {/* Checkbox */}

          <div className="flex justify-center">

            <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />

          </div>

          {/* Question */}

          <div className="space-y-2">

            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />

            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />

          </div>

          {/* Subject */}

          <div className="flex justify-center">

            <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />

          </div>

          {/* Difficulty */}

          <div className="flex justify-center">

            <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />

          </div>

          {/* Marks */}

          <div className="flex justify-center">

            <div className="h-4 w-8 animate-pulse rounded bg-slate-200" />

          </div>

        </div>

      ))}

    </div>
  );
}

export default QuestionSelectorSkeleton;