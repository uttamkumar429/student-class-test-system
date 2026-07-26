function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div
          className={`rounded-xl p-4 ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default DashboardCard;