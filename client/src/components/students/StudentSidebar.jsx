import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  User,
  LogOut,
} from "lucide-react";

const StudentSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/student/dashboard",
    },
    {
      name: "Available Exams",
      icon: BookOpen,
      path: "/student/exams",
    },
    {
      name: "Results",
      icon: Trophy,
      path: "/student/results",
    },
    {
      name: "Profile",
      icon: User,
      path: "/student/profile",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm">

      {/* Logo */}
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold text-blue-600">
          iRise
        </h2>

        <p className="text-sm text-slate-500">
          Student Portal
        </p>
      </div>

      {/* Menu */}
      <nav className="mt-6 px-3">

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />

              {menu.name}
            </NavLink>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 w-64 px-3">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={20} />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default StudentSidebar;