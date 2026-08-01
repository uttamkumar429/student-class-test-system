import DashboardHeader from "../../components/students/dashboard/DashboardHeader";
import StudentStats from "../../components/students/dashboard/StudentStats";
import UpcomingExams from "../../components/students/dashboard/UpcomingExams";
import RecentResultTable from "../../components/students/dashboard/RecentResultTable";
import PerformanceChart from "../../components/students/dashboard/PerformanceChart";
import QuickActions from "../../components/students/dashboard/QuickActions";
import AnnouncementCard from "../../components/students/dashboard/AnnouncementCard";

function StudentDashboard() {
  // Temporary
  // Later we'll get this from Redux/Profile API
  const userName = "Uttam";

  return (
    <div className="space-y-8">

      {/* Header */}
      <DashboardHeader
        userName={userName}
      />

      {/* Statistics */}
      <StudentStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Upcoming Exams */}
      <UpcomingExams />

      {/* Results + Analytics */}
      <div className="grid gap-8 xl:grid-cols-2">

       <RecentResultTable />

        <PerformanceChart />

      </div>

      {/* Announcements */}
      <AnnouncementCard />

    </div>
  );
}

export default StudentDashboard;