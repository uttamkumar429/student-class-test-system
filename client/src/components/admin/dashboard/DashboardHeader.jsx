import PropTypes from "prop-types";
import { LayoutDashboard } from "lucide-react";

function DashboardHeader({
  adminName = "Admin",
}) {
  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  };

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-8 text-white shadow-lg">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">

              <LayoutDashboard size={30} />

            </div>

            <div>

              <p className="text-sm uppercase tracking-[3px] text-blue-100">
                Admin Dashboard
              </p>

              <h1 className="mt-1 text-4xl font-bold">
                {greeting()}, {adminName}
              </h1>

            </div>

          </div>

          <p className="mt-6 max-w-2xl text-blue-100">
            Welcome back. Monitor students,
            manage examinations, publish tests
            and analyze performance from one
            centralized dashboard.
          </p>

        </div>

        {/* Right */}

        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">

          <p className="text-sm text-blue-100">
            Today's Date
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </h2>

        </div>

      </div>

    </section>
  );
}

DashboardHeader.propTypes = {
  adminName: PropTypes.string,
};

export default DashboardHeader;