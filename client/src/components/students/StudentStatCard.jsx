const StudentStatCard = ({ title, value, color }) => {
  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-sm ${color}`}
    >
      <h3 className="text-sm font-medium text-slate-500">
        {title}
      </h3>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
};

export default StudentStatCard;