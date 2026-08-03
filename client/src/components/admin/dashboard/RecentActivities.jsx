import PropTypes from "prop-types";
import {
  User,
  FileText,
  BookOpen,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

const ICONS = {
  student: User,
  question: BookOpen,
  test: ClipboardCheck,
  report: FileText,
};

function RecentActivities({
  activities = [],
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Recent Activities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest actions performed in the system.
          </p>

        </div>

      </div>

      {/* Empty */}

      {activities.length === 0 ? (

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12">

          <Clock3
            size={48}
            className="text-slate-300"
          />

          <h3 className="mt-5 text-lg font-semibold text-slate-700">
            No Recent Activities
          </h3>

          <p className="mt-2 text-center text-sm text-slate-500">
            Activities performed by administrators
            will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {activities.map((activity) => {

            const Icon =
              ICONS[activity.type] || Clock3;

            return (

              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-xl border border-slate-100 p-4 transition-all duration-300 hover:border-blue-300 hover:bg-slate-50"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                  <Icon size={22} />

                </div>

                <div className="flex-1">

                  <h4 className="font-semibold text-slate-900">

                    {activity.title}

                  </h4>

                  <p className="mt-1 text-sm text-slate-500">

                    {activity.description}

                  </p>

                </div>

                <span className="whitespace-nowrap text-xs text-slate-400">

                  {activity.time}

                </span>

              </div>

            );

          })}

        </div>

      )}

    </section>
  );
}

RecentActivities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ),
};

export default RecentActivities;