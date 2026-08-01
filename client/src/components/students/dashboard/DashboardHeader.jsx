import {
  CalendarDays,
  Sun,
  CloudSun,
  Moon,
} from "lucide-react";

function DashboardHeader({ userName = "Student" }) {
  const currentHour = new Date().getHours();

  let greeting = "Good Evening";
  let Icon = Moon;

  if (currentHour < 12) {
    greeting = "Good Morning";
    Icon = Sun;
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
    Icon = CloudSun;
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-lg">

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

        {/* Left */}

        <div>

          <div className="mb-3 flex items-center gap-2">

            <Icon size={28} />

            <h1 className="text-3xl font-bold">
              {greeting}, {userName} 👋
            </h1>

          </div>

          <p className="max-w-xl text-blue-100">

            Welcome back! Stay focused, complete your exams on time,
            and keep improving your performance every day.

          </p>

        </div>

        {/* Right */}

        <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">

          <div className="flex items-center gap-2">

            <CalendarDays size={20} />

            <span className="font-medium">
              Today
            </span>

          </div>

          <p className="mt-2 text-sm text-blue-100">
            {today}
          </p>

        </div>

      </div>

    </section>
  );
}

export default DashboardHeader;