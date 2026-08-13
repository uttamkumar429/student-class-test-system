import {
  BookOpen,
  ClipboardCheck,
  Trophy,
} from "lucide-react";

import StatCard from "./StatCard";

function StudentStats({
  stats = {},
  onNavigate,
}) {
  const {
    availableExams = 0,
    activeExams = 0,
    completedExams = 0,
    averageScore = 0,
  } = stats;

  const statItems = [
  {
    id: "available-exams",
    title: "Available Exams",
    value: availableExams,
    icon: <BookOpen size={26} />,
    iconBg: "bg-blue-600",
    path: "/student/exams",
  },
  {
    id: "active-exams",
    title: "Active Exams",
    value: activeExams,
    icon: <ClipboardCheck size={26} />,
    iconBg: "bg-green-600",
    path: "/student/exams",
  },
  {
    id: "completed-exams",
    title: "Completed Exams",
    value: completedExams,
    icon: <ClipboardCheck size={26} />,
    iconBg: "bg-orange-500",
    path: "/student/results/history",
  },
  {
    id: "average-score",
    title: "Average Score",
    value: `${averageScore}%`,
    icon: <Trophy size={26} />,
    iconBg: "bg-purple-600",
    path: "/student/results/history",
  },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavigate(item.path)}
          className="w-full text-left"
        >
          <StatCard
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconBg={item.iconBg}
          />
        </button>
      ))}
    </section>
  );
}

export default StudentStats;