import PropTypes from "prop-types";
import {
  PlusCircle,
  BookOpen,
  Users,
  BarChart3,
} from "lucide-react";

const ACTIONS = [
  {
    id: 1,
    title: "Create Test",
    description: "Create a new examination.",
    icon: PlusCircle,
    color:
      "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    path: "/admin/tests/create",
  },
  {
    id: 2,
    title: "Add Question",
    description: "Insert new questions.",
    icon: BookOpen,
    color:
      "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    path: "/admin/questions/create",
  },
  {
    id: 3,
    title: "Manage Students",
    description: "View and manage students.",
    icon: Users,
    color:
      "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    path: "/admin/students",
  },
  {
    id: 4,
    title: "View Reports",
    description: "Analytics & reports.",
    icon: BarChart3,
    color:
      "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    path: "/admin/reports",
  },
];

function QuickActions({ navigate }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Frequently used admin operations.
        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => navigate(action.path)}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-white hover:shadow-lg"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${action.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>
            </button>
          );
        })}

      </div>

    </section>
  );
}

QuickActions.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default QuickActions;