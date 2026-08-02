import PropTypes from "prop-types";
import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-600",
  trend,
  trendType = "up",
}) {
  const isTrendUp = trendType === "up";

  return (
    <article
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between gap-4">

        {/* Left */}

        <div className="min-w-0 flex-1">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 break-words text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {trend && (
            <div
              className={`
                mt-4
                inline-flex
                items-center
                gap-1
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold

                ${
                  isTrendUp
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {isTrendUp ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}

              {trend}
            </div>
          )}

        </div>

        {/* Icon */}

        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-white
            shadow-sm
            ${iconBg}
          `}
        >
          {icon}
        </div>

      </div>
    </article>
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