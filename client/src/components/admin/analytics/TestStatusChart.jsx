import PropTypes from "prop-types";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import ChartCard from "./ChartCard";
import EmptyChart from "./EmptyChart";
import CustomTooltip from "./CustomTooltip";

const STATUS_COLORS = {
  published: "#16a34a",
  draft: "#f59e0b",
  completed: "#2563eb",
  archived: "#64748b",
};

function TestStatusChart({ data = [] }) {

  const chartData = data.map((item) => ({
    name:
      item.status.charAt(0).toUpperCase() +
      item.status.slice(1),
    value: item.totalTests,
    color:
      STATUS_COLORS[item.status] ||
      "#6366f1",
  }));

  return (
    <ChartCard
      title="Test Status"
      subtitle="Distribution by current status"
    >

      {chartData.length === 0 ? (

        <EmptyChart />

      ) : (

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
            >

              {chartData.map((entry) => (

                <Cell
                  key={entry.name}
                  fill={entry.color}
                />

              ))}

            </Pie>

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      )}

    </ChartCard>
  );
}

TestStatusChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      totalTests: PropTypes.number.isRequired,
    })
  ),
};

export default TestStatusChart;