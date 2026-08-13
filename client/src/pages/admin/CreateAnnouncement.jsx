import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";

import { createAnnouncement } from "../../redux/adminAnnouncement/announcementThunk";

function CreateAnnouncement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saving, setSaving] =
    useState(false);

  const handleCreate = async (
    payload
  ) => {
    try {
      setSaving(true);

      await dispatch(
        createAnnouncement(payload)
      ).unwrap();

      toast.success(
        "Announcement created successfully."
      );

      navigate(
        "/admin/announcements"
      );
    } catch (error) {
      toast.error(
        error ||
          "Failed to create announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Create Announcement
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new announcement for students.
          </p>
        </div>

        <AnnouncementForm
            submitText="Create Announcement"
            loading={saving}
            onSubmit={handleCreate}
            onCancel={() =>
                navigate("/admin/announcements")
            }
        />

      </div>
    </DashboardLayout>
  );
}

export default CreateAnnouncement;