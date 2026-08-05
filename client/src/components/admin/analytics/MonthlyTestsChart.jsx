import PropTypes from "prop-types";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import ChartCard from "./ChartCard";
import EmptyChart from "./EmptyChart";
import CustomTooltip from "./CustomTooltip";

const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function MonthlyTestsChart({ data = [] }) {
  const chartData = data.map((item) => ({
    month: MONTHS[item.month],
    tests: item.totalTests,
  }));

  return (
    <ChartCard
      title="Monthly Tests"
      subtitle="Tests created month-wise"
    >
      {chartData.length === 0 ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="tests"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

MonthlyTestsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.number.isRequired,
      totalTests: PropTypes.number.isRequired,
    })
  ),
};

export default MonthlyTestsChart;