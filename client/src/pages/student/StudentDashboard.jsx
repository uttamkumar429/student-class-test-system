import StudentStatCard from "../../components/students/StudentStatCard";

const StudentDashboard = () => {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your exams and track your performance.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StudentStatCard
          title="Available Exams"
          value={5}
          color="border-blue-200"
        />

        <StudentStatCard
          title="Attempted Exams"
          value={2}
          color="border-green-200"
        />

        <StudentStatCard
          title="Average Score"
          value="85%"
          color="border-yellow-200"
        />

        <StudentStatCard
          title="Results"
          value={2}
          color="border-purple-200"
        />

      </div>

      {/* Recent Exams */}
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-semibold text-slate-800">
          Recent Exams
        </h2>

        <div className="space-y-4">

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">
                Java Programming Test
              </h3>

              <p className="text-sm text-slate-500">
                Duration: 60 Minutes
              </p>
            </div>

            <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
              Start
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">
                DBMS Class Test
              </h3>

              <p className="text-sm text-slate-500">
                Duration: 45 Minutes
              </p>
            </div>

            <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
              Start
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;