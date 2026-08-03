import PropTypes from "prop-types";
import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle = "",
  icon,
  iconBg = "bg-blue-600",
  trend,
  trendType = "up",
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

          {trend && (
            <div
              className={`mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                trendType === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trendType === "up" ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}

              {trend}
            </div>
          )}

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${iconBg}`}
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
  subtitle: PropTypes.string,
  icon: PropTypes.node.isRequired,
  iconBg: PropTypes.string,
  trend: PropTypes.string,
  trendType: PropTypes.oneOf([
    "up",
    "down",
  ]),
};

export default StatCard;