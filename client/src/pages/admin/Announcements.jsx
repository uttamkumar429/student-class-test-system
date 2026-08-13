import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";

import AnnouncementHeader from "../../components/announcements/AnnouncementHeader";
import AnnouncementFilters from "../../components/announcements/AnnouncementFilters";
import AnnouncementTable from "../../components/announcements/AnnouncementTable";
import AnnouncementPagination from "../../components/announcements/AnnouncementPagination";
import DeleteAnnouncementModal from "../../components/announcements/DeleteAnnouncementModal";

import {
  fetchAnnouncements,
  publishAnnouncement,
  unpublishAnnouncement,
  deleteAnnouncement,
} from "../../redux/adminAnnouncement/announcementThunk";

import {
  setFilters,
  resetFilters,
  setPage,
} from "../../redux/adminAnnouncement/announcementSlice";

import {
  selectAnnouncements,
  selectAnnouncementLoading,
  selectAnnouncementError,
  selectAnnouncementPagination,
  selectAnnouncementFilters,
} from "../../redux/adminAnnouncement/announcementSelectors";

function Announcements() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const announcements = useSelector(
    selectAnnouncements
  );

  const loading = useSelector(
    selectAnnouncementLoading
  );

  const error = useSelector(
    selectAnnouncementError
  );

  const pagination = useSelector(
    selectAnnouncementPagination
  );

  const filters = useSelector(
    selectAnnouncementFilters
  );

  // ======================================
  // LOCAL STATE
  // ======================================

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] =
    useState(false);

  // ======================================
  // FETCH ANNOUNCEMENTS
  // ======================================

  useEffect(() => {
    dispatch(
      fetchAnnouncements({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        type: filters.type,
        status: filters.status,
      })
    );
  }, [
    dispatch,
    pagination.page,
    pagination.limit,
    filters.search,
    filters.type,
    filters.status,
  ]);

  // ======================================
  // CREATE
  // ======================================

  const handleCreate = () => {
    navigate(
      "/admin/announcements/create"
    );
  };

  // ======================================
  // EDIT
  // ======================================

  const handleEdit = (announcement) => {
    navigate(
      `/admin/announcements/${announcement._id}/edit`
    );
  };

  // ======================================
  // PUBLISH / UNPUBLISH
  // ======================================

  const handleTogglePublish = async (
    announcement
  ) => {
    try {
      if (announcement.isPublished) {
        await dispatch(
          unpublishAnnouncement(
            announcement._id
          )
        ).unwrap();

        toast.success(
          "Announcement unpublished successfully."
        );
      } else {
        await dispatch(
          publishAnnouncement(
            announcement._id
          )
        ).unwrap();

        toast.success(
          "Announcement published successfully."
        );
      }
    } catch (error) {
      toast.error(
        error ||
          "Failed to update announcement status."
      );
    }
  };

  // ======================================
  // OPEN DELETE
  // ======================================

  const handleDeleteClick = (
    announcement
  ) => {
    setSelectedAnnouncement(
      announcement
    );

    setDeleteModalOpen(true);
  };

  // ======================================
  // CLOSE DELETE
  // ======================================

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // ======================================
  // CONFIRM DELETE
  // ======================================

  const handleDeleteConfirm = async () => {
    if (!selectedAnnouncement) {
      return;
    }

    try {
      await dispatch(
        deleteAnnouncement(
          selectedAnnouncement._id
        )
      ).unwrap();

      toast.success(
        "Announcement deleted successfully."
      );

      handleCloseDeleteModal();
    } catch (error) {
      toast.error(
        error ||
          "Failed to delete announcement."
      );
    }
  };

  // ======================================
  // FILTER CHANGE
  // ======================================

  const handleFilterChange = (
    values
  ) => {
    dispatch(setFilters(values));
  };

  // ======================================
  // RESET
  // ======================================

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  // ======================================
  // PAGINATION
  // ======================================

  const handlePageChange = (
    page
  ) => {
    dispatch(setPage(page));
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading && !announcements.length) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            <h2 className="mt-5 text-xl font-semibold text-slate-700">
              Loading Announcements...
            </h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <AnnouncementHeader
          totalAnnouncements={
            pagination.total
          }
          onCreate={handleCreate}
        />

        <AnnouncementFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {error && !announcements.length ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
            <h2 className="text-xl font-bold text-red-700">
              Failed to Load Announcements
            </h2>

            <p className="mt-2 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                dispatch(
                  fetchAnnouncements({
                    page: pagination.page,
                    limit: pagination.limit,
                    search: filters.search,
                    type: filters.type,
                    status: filters.status,
                  })
                )
              }
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-700">
              No Announcements Found
            </h2>

            <p className="mt-2 text-slate-500">
              Create an announcement to get started.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create Announcement
            </button>
          </div>
        ) : (
          <>
            <AnnouncementTable
              announcements={
                announcements
              }
              onEdit={handleEdit}
              onTogglePublish={
                handleTogglePublish
              }
              onDelete={
                handleDeleteClick
              }
              loading={loading}
            />

            <AnnouncementPagination
              currentPage={
                pagination.page
              }
              totalPages={
                pagination.totalPages
              }
              totalItems={
                pagination.total
              }
              pageSize={
                pagination.limit
              }
              onPageChange={
                handlePageChange
              }
            />
          </>
        )}

        <DeleteAnnouncementModal
          isOpen={isDeleteModalOpen}
          announcement={
            selectedAnnouncement
          }
          loading={loading}
          onClose={
            handleCloseDeleteModal
          }
          onConfirm={
            handleDeleteConfirm
          }
        />

      </div>
    </DashboardLayout>
  );
}

export default Announcements;