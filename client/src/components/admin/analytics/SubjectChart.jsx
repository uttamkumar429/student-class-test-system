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

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#9333ea",
  "#ef4444",
  "#0891b2",
  "#ea580c",
  "#14b8a6",
];

function SubjectChart({ data = [] }) {

  const chartData = data.map((item) => ({
    name: item.subject,
    value: item.totalTests,
  }));

  return (

    <ChartCard
      title="Subject Distribution"
      subtitle="Tests grouped by subject"
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
              outerRadius={95}
              innerRadius={45}
              paddingAngle={3}
            >

              {chartData.map((entry, index) => (

                <Cell
                  key={entry.name}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
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

SubjectChart.propTypes = {

  data: PropTypes.arrayOf(

    PropTypes.shape({

      subject: PropTypes.string.isRequired,

      totalTests: PropTypes.number.isRequired,

    })

  ),

};

export default SubjectChart;