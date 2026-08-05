import PropTypes from "prop-types";

import MonthlyTestsChart from "./MonthlyTestsChart";
import SubjectChart from "./SubjectChart";
import DifficultyChart from "./DifficultyChart";
import TestStatusChart from "./TestStatusChart";
import AnalyticsSkeleton from "./AnalyticsSkeleton";

function AnalyticsCharts({
  analytics,
  loading = false,
}) {

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!analytics) {
    return null;
  }

  return (

    <section className="space-y-8">

      {/* Section Header */}

      <div>

        <h2 className="text-3xl font-bold text-slate-900">

          Analytics Dashboard

        </h2>

        <p className="mt-2 text-slate-500">

          Visual insights of tests, questions and
          examination performance.

        </p>

      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-2">

        <MonthlyTestsChart
          data={
            analytics.monthlyAnalytics
          }
        />

        <TestStatusChart
          data={
            analytics.testStatusAnalytics
          }
        />

        <SubjectChart
          data={
            analytics.subjectAnalytics
          }
        />

        <DifficultyChart
          data={
            analytics.difficultyAnalytics
          }
        />

      </div>

    </section>

  );

}

AnalyticsCharts.propTypes = {

  analytics: PropTypes.shape({

    monthlyAnalytics:
      PropTypes.array,

    subjectAnalytics:
      PropTypes.array,

    difficultyAnalytics:
      PropTypes.array,

    testStatusAnalytics:
      PropTypes.array,

  }),

  loading: PropTypes.bool,

};

export default AnalyticsCharts;