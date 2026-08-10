import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function PerformanceChart({ data = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Performance Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track your examination performance over time.
        </p>
      </div>

      {/* Empty State */}

      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-700">
              No Performance Data
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Complete an examination to see your performance here.
            </p>
          </div>
        </div>
      ) : (
        /* Chart */

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" />

              <XAxis dataKey="exam" />

              <YAxis
                domain={[0, 100]}
                allowDecimals={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(2)}%`,
                  "Score",
                ]}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

PerformanceChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      exam: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ),
};

PerformanceChart.defaultProps = {
  data: [],
};

export default PerformanceChart;