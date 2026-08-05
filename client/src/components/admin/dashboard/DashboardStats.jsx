import {
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Archive,
  CheckCircle,
  BarChart3,
  Activity,
} from "lucide-react";

import StatCard from "./StatCard";

function DashboardStats({ dashboard }) {
  if (!dashboard) return null;

 

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Students"
        value={dashboard.totalStudents}
        subtitle="Registered Students"
        icon={<Users size={30} />}
        iconBg="bg-blue-600"
      />

      <StatCard
        title="Question Bank"
        value={dashboard.totalQuestions}
        subtitle="Available Questions"
        icon={<BookOpen size={30} />}
        iconBg="bg-orange-600"
      />

      <StatCard
        title="Total Tests"
        value={dashboard.totalTests}
        subtitle="Created Tests"
        icon={<BarChart3 size={30} />}
        iconBg="bg-indigo-600"
      />

      <StatCard
        title="Published"
        value={dashboard.publishedTests}
        subtitle="Published Tests"
        icon={<ClipboardCheck size={30} />}
        iconBg="bg-green-600"
      />

      <StatCard
        title="Draft"
        value={dashboard.draftTests}
        subtitle="Draft Tests"
        icon={<FileText size={30} />}
        iconBg="bg-yellow-500"
      />

      <StatCard
        title="Archived"
        value={dashboard.archivedTests}
        subtitle="Archived Tests"
        icon={<Archive size={30} />}
        iconBg="bg-gray-600"
      />

      <StatCard
        title="Completed"
        value={dashboard.completedTests}
        subtitle="Completed Tests"
        icon={<CheckCircle size={30} />}
        iconBg="bg-purple-600"
      />

      <StatCard
        title="Exam Attempts"
        value={dashboard.totalAttempts}
        subtitle="Student Attempts"
        icon={<Activity size={30} />}
        iconBg="bg-cyan-600"
      />
    </section>
  );
}

export default DashboardStats;