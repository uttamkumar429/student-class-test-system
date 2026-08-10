// ======================================
// GET EXAM DEADLINE
// ======================================

const getExamDeadline = ({
  startedAt,
  endTime,
  durationMinutes,
}) => {
  const startedAtMs =
    new Date(startedAt).getTime();

  const scheduledEndMs =
    new Date(endTime).getTime();

  // Invalid dates
  if (
    !Number.isFinite(startedAtMs) ||
    !Number.isFinite(scheduledEndMs)
  ) {
    return null;
  }

  // Invalid exam schedule
  if (scheduledEndMs <= startedAtMs) {
    return null;
  }

  const duration =
    Number(durationMinutes);

  let durationEndMs =
    scheduledEndMs;

  if (
    Number.isFinite(duration) &&
    duration > 0
  ) {
    durationEndMs =
      startedAtMs +
      duration * 60 * 1000;
  }

  const deadlineMs = Math.min(
    scheduledEndMs,
    durationEndMs
  );

  return new Date(deadlineMs);
};

// ======================================
// GET REMAINING TIME
// ======================================

const getRemainingTimeSeconds = (
  deadline,
  now = new Date()
) => {
  const deadlineMs =
    new Date(deadline).getTime();

  const nowMs =
    new Date(now).getTime();

  if (
    !Number.isFinite(deadlineMs) ||
    !Number.isFinite(nowMs)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      (deadlineMs - nowMs) / 1000
    )
  );
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  getExamDeadline,
  getRemainingTimeSeconds,
};