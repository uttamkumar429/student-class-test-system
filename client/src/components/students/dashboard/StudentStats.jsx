import {
  BookOpen,
  ClipboardCheck,
  Trophy,
} from "lucide-react";

import StatCard from "./StatCard";

function StudentStats({ stats = {} }) {
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
    },
    {
      id: "active-exams",
      title: "Active Exams",
      value: activeExams,
      icon: <ClipboardCheck size={26} />,
      iconBg: "bg-green-600",
    },
    {
      id: "completed-exams",
      title: "Completed Exams",
      value: completedExams,
      icon: <ClipboardCheck size={26} />,
      iconBg: "bg-orange-500",
    },
    {
      id: "average-score",
      title: "Average Score",
      value: `${averageScore}%`,
      icon: <Trophy size={26} />,
      iconBg: "bg-purple-600",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => (
        <StatCard
          key={item.id}
          title={item.title}
          value={item.value}
          icon={item.icon}
          iconBg={item.iconBg}
        />
      ))}
    </section>
  );
}

export default StudentStats;