import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";

import {
  fetchAnnouncementById,
  updateAnnouncement,
} from "../../redux/adminAnnouncement/announcementThunk";

import {
  selectCurrentAnnouncement,
  selectAnnouncementLoading,
  selectAnnouncementError,
} from "../../redux/adminAnnouncement/announcementSelectors";

function EditAnnouncement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const announcement = useSelector(
    selectCurrentAnnouncement
  );

  const loading = useSelector(
    selectAnnouncementLoading
  );

  const error = useSelector(
    selectAnnouncementError
  );

  const [saving, setSaving] =
    useState(false);

  // ======================================
  // FETCH ANNOUNCEMENT
  // ======================================

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(
      fetchAnnouncementById(id)
    );
  }, [dispatch, id]);

  // ======================================
  // UPDATE
  // ======================================

  const handleUpdate = async (
    payload
  ) => {
    if (!id) {
      toast.error(
        "Announcement ID is missing."
      );

      return;
    }

    try {
      setSaving(true);

      await dispatch(
        updateAnnouncement({
          announcementId: id,
          announcementData: payload,
        })
      ).unwrap();

      toast.success(
        "Announcement updated successfully."
      );

      navigate(
        "/admin/announcements"
      );
    } catch (error) {
      toast.error(
        error ||
          "Failed to update announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading && !announcement) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            <h2 className="mt-5 text-xl font-semibold text-slate-700">
              Loading Announcement...
            </h2>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error && !announcement) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">

          <h2 className="text-2xl font-bold text-red-700">
            Failed to Load Announcement
          </h2>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={() =>
                dispatch(
                  fetchAnnouncementById(
                    id
                  )
                )
              }
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/announcements"
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ======================================
  // NOT FOUND
  // ======================================

  if (!announcement) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

          <h2 className="text-2xl font-bold text-slate-700">
            Announcement Not Found
          </h2>

          <p className="mt-3 text-slate-500">
            The requested announcement could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/announcements"
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Announcements
          </button>

        </div>
      </DashboardLayout>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Edit Announcement
          </h1>

          <p className="mt-2 text-slate-500">
            Update the announcement details below.
          </p>
        </div>

        <AnnouncementForm
          initialValues={
            announcement
          }
          submitText="Update Announcement"
          loading={saving}
          onSubmit={handleUpdate}
          onCancel={() =>
            navigate("/admin/announcements")
           }
        />

      </div>
    </DashboardLayout>
  );
}

export default EditAnnouncement;