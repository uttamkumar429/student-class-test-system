import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/students/StudentSidebar";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default StudentLayout;