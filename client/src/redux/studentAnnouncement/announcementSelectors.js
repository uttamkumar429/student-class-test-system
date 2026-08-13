// ======================================
// ANNOUNCEMENTS
// ======================================

export const selectAnnouncements =
  (state) =>
    state.studentAnnouncement
      .announcements;

// ======================================
// LOADING
// ======================================

export const selectAnnouncementLoading =
  (state) =>
    state.studentAnnouncement
      .loading;

// ======================================
// ERROR
// ======================================

export const selectAnnouncementError =
  (state) =>
    state.studentAnnouncement
      .error;

// ======================================
// SUCCESS
// ======================================

export const selectAnnouncementSuccess =
  (state) =>
    state.studentAnnouncement
      .success;

// ======================================
// LAST FETCHED TIME
// ======================================

export const selectAnnouncementLastFetchedAt =
  (state) =>
    state.studentAnnouncement
      .lastFetchedAt;