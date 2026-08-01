import PropTypes from "prop-types";
import { TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-600",
  trend,
  trendType = "up",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {trend && (
            <div
              className={`mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                trendType === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <TrendingUp
                size={14}
                className={
                  trendType === "down"
                    ? "rotate-180"
                    : ""
                }
              />

              {trend}
            </div>
          )}
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  iconBg: PropTypes.string,
  trend: PropTypes.string,
  trendType: PropTypes.oneOf([
    "up",
    "down",
  ]),
};

export default StatCard;