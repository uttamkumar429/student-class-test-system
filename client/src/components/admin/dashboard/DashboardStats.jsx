import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardCheck,
  Activity,
} from "lucide-react";

import StatCard from "./StatCard";

function DashboardStats({ dashboard }) {
  if (!dashboard) return null;

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Students"
        value={dashboard.totalStudents}
        subtitle="Registered Students"
        icon={<Users size={30} />}
        iconBg="bg-blue-600"
      />

      <StatCard
        title="Active Students"
        value={dashboard.activeStudents}
        subtitle="Currently Active"
        icon={<UserCheck size={30} />}
        iconBg="bg-green-600"
      />

      <StatCard
        title="Blocked Students"
        value={dashboard.blockedStudents}
        subtitle="Access Restricted"
        icon={<UserX size={30} />}
        iconBg="bg-red-600"
      />

      <StatCard
        title="Teachers"
        value={dashboard.totalTeachers}
        subtitle="Faculty Members"
        icon={<GraduationCap size={30} />}
        iconBg="bg-purple-600"
      />

      <StatCard
        title="Question Bank"
        value={dashboard.totalQuestions}
        subtitle="Available Questions"
        icon={<BookOpen size={30} />}
        iconBg="bg-orange-600"
      />

      <StatCard
        title="Published Tests"
        value={dashboard.publishedTests}
        subtitle="Live Examinations"
        icon={<ClipboardCheck size={30} />}
        iconBg="bg-emerald-600"
      />

      <StatCard
        title="Draft Tests"
        value={dashboard.draftTests}
        subtitle="Pending Publication"
        icon={<FileText size={30} />}
        iconBg="bg-yellow-500"
      />

      <StatCard
        title="Today's Attempts"
        value={dashboard.todayAttempts}
        subtitle="Exam Attempts Today"
        icon={<Activity size={30} />}
        iconBg="bg-cyan-600"
      />

    </section>
  );
}

export default DashboardStats;