import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/students/StudentSidebar";

function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <StudentSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default StudentLayout;