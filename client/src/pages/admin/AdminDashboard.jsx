import {
  Users,
  ClipboardList,
  FileText,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";


// import DashboardLayout from "../../layouts/DashboardLayout";

function AdminDashboard() {
  return (
        <DashboardLayout>

            <h1 className="mb-2 text-3xl font-bold">
                Dashboard
            </h1>

            <p className="mb-8 text-slate-500">
                Welcome to Student Class Test System Admin Panel.
            </p>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <DashboardCard
                title="Students"
                value="1,250"
                icon={<Users className="text-white" />}
                color="bg-blue-600"
                />

                <DashboardCard
                title="Tests"
                value="125"
                icon={<ClipboardList className="text-white" />}
                color="bg-green-600"
                />

                <DashboardCard
                title="Results"
                value="3,420"
                icon={<FileText className="text-white" />}
                color="bg-orange-500"
                />

                <DashboardCard
                title="Pass Rate"
                value="92%"
                icon={<TrendingUp className="text-white" />}
                color="bg-purple-600"
                />

            </div>

        </DashboardLayout>
    );
}

export default AdminDashboard;