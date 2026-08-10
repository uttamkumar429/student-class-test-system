import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDashboardThunk } from "../../redux/studentDashboard";

import DashboardHeader from "../../components/students/dashboard/DashboardHeader";
import StudentStats from "../../components/students/dashboard/StudentStats";
import UpcomingExams from "../../components/students/dashboard/UpcomingExams";
import RecentResultTable from "../../components/students/dashboard/RecentResultTable";
import PerformanceChart from "../../components/students/dashboard/PerformanceChart";
import QuickActions from "../../components/students/dashboard/QuickActions";
import AnnouncementCard from "../../components/students/dashboard/AnnouncementCard";

function StudentDashboard() {
  const dispatch = useDispatch();

const {
  loading,
  error,
  student,
  stats,
  upcoming,
  recentResults,
  performance,
} = useSelector(
  (state) => state.studentDashboard
);

  useEffect(() => {
    dispatch(fetchDashboardThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <DashboardHeader
        userName={student?.fullName}
      />

      <StudentStats
        stats={stats}
      />

      <QuickActions />

      <UpcomingExams
        exams={upcoming}
      />

      <div className="grid gap-8 xl:grid-cols-2">
      <RecentResultTable
        results={recentResults}
      />

        <PerformanceChart
          data={performance}
        />

      </div>

      <AnnouncementCard />

    </div>
  );
}

export default StudentDashboard;