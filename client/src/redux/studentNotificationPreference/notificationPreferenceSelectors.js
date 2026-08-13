export const selectNotificationPreferences =
  (state) =>
    state.studentNotificationPreference
      .preferences;

export const selectNotificationPreferencesLoading =
  (state) =>
    state.studentNotificationPreference
      .loading;

export const selectNotificationPreferencesUpdating =
  (state) =>
    state.studentNotificationPreference
      .updating;

export const selectNotificationPreferencesError =
  (state) =>
    state.studentNotificationPreference
      .error;

export const selectNotificationPreferencesSuccess =
  (state) =>
    state.studentNotificationPreference
      .success;