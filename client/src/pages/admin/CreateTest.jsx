import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import TestForm from "../../components/tests/TestForm";
import { toastService } from "../../lib/toast";
import { useDispatch } from "react-redux";

import {
  createTest,
} from "../../redux/adminTest/testThunk";

function CreateTest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);

  // ======================================
  // Create Test
  // ======================================

  const handleCreate = async (payload) => {
    try {
      setSaving(true);

    await dispatch(
      createTest(payload)
    ).unwrap();

      toastService.success("Test created successfully.");

      navigate("/admin/tests");

    } catch (error) {

      toastService.error(error);

    } finally {

      setSaving(false);

    }
  };

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-sm">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">

            Create Test

          </h1>

          <p className="mt-2 text-slate-500">

            Create a new examination by filling the details below.

          </p>

        </div>

        <TestForm
          submitText="Create Test"
          loading={saving}
          onSubmit={handleCreate}
        />

      </div>

    </DashboardLayout>
  );
}

export default CreateTest;