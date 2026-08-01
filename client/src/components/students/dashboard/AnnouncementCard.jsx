import {
  Bell,
  ClipboardCheck,
  Trophy,
  AlertTriangle,
} from "lucide-react";

function Announcements() {
  // Temporary Data
  // Future → API Response
  const announcements = [
    {
      id: 1,
      title: "Java Programming Exam Published",
      description:
        "The Java Programming examination is now available for all students.",
      type: "exam",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "DBMS Result Declared",
      description:
        "Your DBMS examination result has been published.",
      type: "result",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Complete Your Profile",
      description:
        "Please update your profile before attempting upcoming examinations.",
      type: "warning",
      time: "3 days ago",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "exam":
        return (
          <ClipboardCheck
            size={22}
            className="text-blue-600"
          />
        );

      case "result":
        return (
          <Trophy
            size={22}
            className="text-green-600"
          />
        );

      case "warning":
        return (
          <AlertTriangle
            size={22}
            className="text-orange-500"
          />
        );

      default:
        return (
          <Bell
            size={22}
            className="text-slate-500"
          />
        );
    }
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-800">
          Announcements
        </h2>

        <p className="mt-1 text-slate-500">
          Stay updated with the latest activities.
        </p>

      </div>

      {/* List */}

      <div className="space-y-5">

        {announcements.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
          >
            <div className="rounded-xl bg-slate-100 p-3">
              {getIcon(item.type)}
            </div>

            <div className="flex-1">

              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">

                <h3 className="font-semibold text-slate-800">
                  {item.title}
                </h3>

                <span className="text-xs text-slate-400">
                  {item.time}
                </span>

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Announcements;