function AnalyticsSkeleton() {

  return (

    <div className="grid gap-6 lg:grid-cols-2">

      {[...Array(4)].map((_, index) => (

        <div
          key={index}
          className="h-96 animate-pulse rounded-2xl bg-slate-200"
        />

      ))}

    </div>

  );

}

export default AnalyticsSkeleton;