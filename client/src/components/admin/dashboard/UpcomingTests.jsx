import PropTypes from "prop-types";
import {
  CalendarDays,
  Clock3,
  BookOpen,
  ArrowRight,
} from "lucide-react";

function UpcomingTests({
  tests = [],
  onViewAll,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Upcoming Tests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Scheduled examinations.
          </p>

        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View All

          <ArrowRight size={16} />
        </button>

      </div>

      {/* Empty */}

      {tests.length === 0 ? (

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12">

          <CalendarDays
            size={48}
            className="text-slate-300"
          />

          <h3 className="mt-5 text-lg font-semibold text-slate-700">
            No Upcoming Tests
          </h3>

          <p className="mt-2 text-center text-sm text-slate-500">
            Newly scheduled examinations
            will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {tests.map((test) => (

            <div
              key={test.id}
              className="rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:border-blue-400 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {test.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                    <div className="flex items-center gap-2">

                      <BookOpen size={16} />

                      {test.subject}

                    </div>

                    <div className="flex items-center gap-2">

                      <Clock3 size={16} />

                      {test.duration} mins

                    </div>

                    <div className="flex items-center gap-2">

                      <CalendarDays size={16} />

                      {test.startTime}

                    </div>

                  </div>

                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Scheduled
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

UpcomingTests.propTypes = {
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      title: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      startTime: PropTypes.string.isRequired,
    })
  ),

  onViewAll: PropTypes.func,
};

export default UpcomingTests;