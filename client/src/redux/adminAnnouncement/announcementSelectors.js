// ======================================
// ANNOUNCEMENTS
// ======================================

export const selectAnnouncements =
  (state) =>
    state.adminAnnouncement
      .announcements;

// ======================================
// CURRENT ANNOUNCEMENT
// ======================================

export const selectCurrentAnnouncement =
  (state) =>
    state.adminAnnouncement
      .currentAnnouncement;

// ======================================
// LOADING
// ======================================

export const selectAnnouncementLoading =
  (state) =>
    state.adminAnnouncement
      .loading;

// ======================================
// ERROR
// ======================================

export const selectAnnouncementError =
  (state) =>
    state.adminAnnouncement
      .error;

// ======================================
// SUCCESS
// ======================================

export const selectAnnouncementSuccess =
  (state) =>
    state.adminAnnouncement
      .success;

// ======================================
// PAGINATION
// ======================================

export const selectAnnouncementPagination =
  (state) =>
    state.adminAnnouncement
      .pagination;

// ======================================
// FILTERS
// ======================================

export const selectAnnouncementFilters =
  (state) =>
    state.adminAnnouncement
      .filters;