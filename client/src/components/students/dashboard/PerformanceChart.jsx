import { useEffect, useState } from "react";
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
  const [isDark, setIsDark] = useState(
    () =>
      document.documentElement.dataset.theme === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.dataset.theme ===
          "dark"
      );
    });

    observer.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["data-theme"],
      }
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  const chartColors = isDark
    ? {
        grid: "#334155",
        axis: "#94A3B8",
        tooltipBg: "#0F172A",
        tooltipBorder: "#334155",
        tooltipText: "#F1F5F9",
      }
    : {
        grid: "#E2E8F0",
        axis: "#64748B",
        tooltipBg: "#FFFFFF",
        tooltipBorder: "#E2E8F0",
        tooltipText: "#0F172A",
      };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Performance Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your examination performance over time.
        </p>
      </div>

      {/* Empty State */}

      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No Performance Data
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
              
              <CartesianGrid
                strokeDasharray="4 4"
                stroke={chartColors.grid}
              />

              <XAxis
                dataKey="exam"
                stroke={chartColors.axis}
              />

              <YAxis
                domain={[0, 100]}
                allowDecimals={false}
                stroke={chartColors.axis}
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(2)}%`,
                  "Score",
                ]}
                contentStyle={{
                  backgroundColor:
                    chartColors.tooltipBg,
                  borderColor:
                    chartColors.tooltipBorder,
                  color:
                    chartColors.tooltipText,
                  borderRadius: "12px",
                }}
                labelStyle={{
                  color:
                    chartColors.tooltipText,
                }}
                itemStyle={{
                  color:
                    chartColors.tooltipText,
                }}
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