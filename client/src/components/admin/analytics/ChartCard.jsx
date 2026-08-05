import PropTypes from "prop-types";

function ChartCard({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-start justify-between border-b border-slate-200 p-6">

        <div>

          <h2 className="text-xl font-bold text-slate-900">

            {title}

          </h2>

          {subtitle && (

            <p className="mt-1 text-sm text-slate-500">

              {subtitle}

            </p>

          )}

        </div>

        {action && (

          <div>

            {action}

          </div>

        )}

      </div>

      {/* Body */}

      <div className="h-80 p-5">

        {children}

      </div>

    </section>
  );
}

ChartCard.propTypes = {

  title: PropTypes.string.isRequired,

  subtitle: PropTypes.string,

  action: PropTypes.node,

  children: PropTypes.node.isRequired,

};

export default ChartCard;