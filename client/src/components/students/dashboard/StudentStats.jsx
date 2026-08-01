import {
  BookOpen,
  ClipboardCheck,
  Trophy,
  Medal,
} from "lucide-react";

import StatCard from "./StatCard";

function StudentStats() {
  const stats = [
    {
      id: 1,
      title: "Available Exams",
      value: 5,
      icon: <BookOpen size={26} />,
      iconBg: "bg-blue-600",
      trend: "+2 This Week",
      trendType: "up",
    },
    {
      id: 2,
      title: "Attempted Exams",
      value: 12,
      icon: <ClipboardCheck size={26} />,
      iconBg: "bg-green-600",
      trend: "+1 Today",
      trendType: "up",
    },
    {
      id: 3,
      title: "Average Score",
      value: "86%",
      icon: <Trophy size={26} />,
      iconBg: "bg-orange-500",
      trend: "+4%",
      trendType: "up",
    },
    {
      id: 4,
      title: "Overall Rank",
      value: "#15",
      icon: <Medal size={26} />,
      iconBg: "bg-purple-600",
      trend: "Top 10%",
      trendType: "up",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          key={item.id}
          title={item.title}
          value={item.value}
          icon={item.icon}
          iconBg={item.iconBg}
          trend={item.trend}
          trendType={item.trendType}
        />
      ))}
    </section>
  );
}

export default StudentStats;