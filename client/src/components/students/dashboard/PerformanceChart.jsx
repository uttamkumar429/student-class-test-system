import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function PerformanceChart() {
  // Temporary Data
  // Future → API Response
  const performanceData = [
    {
      exam: "Java",
      score: 82,
    },
    {
      exam: "DBMS",
      score: 90,
    },
    {
      exam: "OS",
      score: 76,
    },
    {
      exam: "CN",
      score: 88,
    },
    {
      exam: "DSA",
      score: 94,
    },
  ];

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          Performance Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track your examination performance over time.
        </p>

      </div>

      {/* Chart */}

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={performanceData}>

            <CartesianGrid
              strokeDasharray="4 4"
            />

            <XAxis dataKey="exam" />

            <YAxis
              domain={[0, 100]}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
              activeDot={{
                r: 8,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </section>
  );
}

export default PerformanceChart;