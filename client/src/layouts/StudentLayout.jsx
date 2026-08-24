import { Outlet } from "react-router-dom";

import StudentSidebar from "../components/students/StudentSidebar";
import StudentTopbar from "../components/students/StudentTopbar";

function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100 transition-colors duration-200 dark:bg-slate-950">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <StudentSidebar />

      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        <StudentTopbar />

        <main className="flex-1 overflow-y-auto p-8 transition-colors duration-200 dark:bg-slate-950">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default StudentLayout;