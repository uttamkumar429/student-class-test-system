export const selectPassPercentage = (
  state
) =>
  state.adminSettings?.passPercentage ?? 33;

export const selectSettingsLoading = (
  state
) =>
  Boolean(state.adminSettings?.loading);

export const selectSettingsUpdating = (
  state
) =>
  Boolean(state.adminSettings?.updating);

export const selectSettingsError = (
  state
) =>
  state.adminSettings?.error || null;

export const selectSettingsUpdateError = (
  state
) =>
  state.adminSettings?.updateError || null;

export const selectSettingsUpdateSuccess = (
  state
) =>
  Boolean(
    state.adminSettings?.updateSuccess
  );