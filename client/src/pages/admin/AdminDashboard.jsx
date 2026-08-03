import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchDashboard } from "../../redux/adminDashboard/dashboardThunk";
import {
  selectDashboard,
  selectDashboardLoading,
  selectDashboardError,
} from "../../redux/adminDashboard/dashboardSelectors";

import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import RecentActivities from "../../components/admin/dashboard/RecentActivities";
import UpcomingTests from "../../components/admin/dashboard/UpcomingTests";
import DashboardSkeleton from "../../components/admin/dashboard/DashboardSkeleton";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboard = useSelector(selectDashboard);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl bg-white p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Failed to Load Dashboard
          </h2>

          <p className="mt-2 text-slate-500">{error}</p>

          <button
            onClick={() => dispatch(fetchDashboard())}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader adminName="Super Admin" />

      <DashboardStats dashboard={dashboard} />

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <QuickActions navigate={navigate} />

          <RecentActivities activities={[]} />
        </div>

        <UpcomingTests
          tests={[]}
          onViewAll={() => navigate("/admin/exams")}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;