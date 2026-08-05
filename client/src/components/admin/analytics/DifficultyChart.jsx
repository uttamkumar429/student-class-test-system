import PropTypes from "prop-types";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import ChartCard from "./ChartCard";
import EmptyChart from "./EmptyChart";
import CustomTooltip from "./CustomTooltip";

const COLORS = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

function DifficultyChart({ data = [] }) {

  const chartData = data.map((item) => ({
    difficulty: item.difficulty,
    questions: item.totalQuestions,
  }));

  return (
    <ChartCard
      title="Question Difficulty"
      subtitle="Distribution by difficulty level"
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
              left: 0,
              bottom: 0,
            }}
            layout="vertical"
          >

            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="difficulty"
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="questions"
              radius={[0, 8, 8, 0]}
            >

              {chartData.map((entry) => (

                <Cell
                  key={entry.difficulty}
                  fill={
                    COLORS[
                      entry.difficulty
                    ] || "#2563eb"
                  }
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      )}

    </ChartCard>
  );
}

DifficultyChart.propTypes = {

  data: PropTypes.arrayOf(

    PropTypes.shape({

      difficulty:
        PropTypes.string.isRequired,

      totalQuestions:
        PropTypes.number.isRequired,

    })

  ),

};

export default DifficultyChart;