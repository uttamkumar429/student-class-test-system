import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../layouts/DashboardLayout";
import TestForm from "../../components/tests/TestForm";

import {
  fetchTestById,
  updateTest,
} from "../../redux/adminTest/testThunk";

import {
  selectCurrentTest,
  selectTestLoading,
  selectTestError,
} from "../../redux/adminTest/testSelectors";

import { toastService } from "../../lib/toast";

function EditTest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const test = useSelector(selectCurrentTest);
  const loading = useSelector(selectTestLoading);
  const error = useSelector(selectTestError);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchTestById(id));
  }, [dispatch, id]);

  // ===========================
  // Update Test
  // ===========================

  const handleUpdate = async (payload) => {
    try {
      setSaving(true);

      await dispatch(
        updateTest({
          testId: id,
          testData: payload,
        })
      ).unwrap();

      toastService.success(
        "Test updated successfully."
      );

      navigate(`/admin/tests/${id}`);

    } catch (error) {

      toastService.error(error);

    } finally {

      setSaving(false);

    }
  };
    // ===========================
  // Loading
  // ===========================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

            <h2 className="mt-5 text-xl font-semibold text-slate-700">
              Loading Test...
            </h2>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  // ===========================
  // Error
  // ===========================

  if (error) {
    return (
      <DashboardLayout>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">

          <h2 className="text-2xl font-bold text-red-600">
            Failed to Load Test
          </h2>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => dispatch(fetchTestById(id))}
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>

        </div>

      </DashboardLayout>
    );
  }

  // ===========================
  // Empty
  // ===========================

  if (!test) {
    return (
      <DashboardLayout>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-2xl font-bold text-slate-700">
            Test Not Found
          </h2>

          <p className="mt-3 text-slate-500">
            The requested test does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/tests")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Tests
          </button>

        </div>

      </DashboardLayout>
    );
  }

  // ===========================
  // UI
  // ===========================

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-sm">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Edit Test
          </h1>

          <p className="mt-2 text-slate-500">
            Update the test details below.
          </p>

        </div>

        <TestForm
          key={id}
          initialValues={test}
          submitText="Update Test"
          loading={saving}
          onSubmit={handleUpdate}
        />

      </div>

    </DashboardLayout>
  );
}

export default EditTest;