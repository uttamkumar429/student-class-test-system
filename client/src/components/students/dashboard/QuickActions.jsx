import {
  PlayCircle,
  FileText,
  User,
  History,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: "Start Exam",
      description: "Begin your scheduled examination.",
      icon: PlayCircle,
      color: "bg-blue-600",
      path: "/student/exams",
    },
    {
      id: 2,
      title: "View Results",
      description: "Check your latest examination results.",
      icon: FileText,
      color: "bg-green-600",
      path: "/student/results/history",
    },
    {
      id: 3,
      title: "Update Profile",
      description: "Manage your personal information.",
      icon: User,
      color: "bg-purple-600",
      path: "/student/profile",
    },
    {
      id: 4,
      title: "Exam History",
      description: "View all attempted examinations.",
      icon: History,
      color: "bg-orange-500",
      path: "/student/results/history",
    },
  ];

  return (
    <section className="mt-10">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Quick Actions
        </h2>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Quickly access the most frequently used features.
        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-slate-950/40"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-white ${action.color}`}
              >
                <Icon size={26} />
              </div>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {action.description}
              </p>
            </button>
          );
        })}

      </div>

    </section>
  );
}

export default QuickActions;