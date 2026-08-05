// =====================================
// CALCULATE EXAM STATUS
// =====================================

const calculateExamStatus = (
  snapshot,
  attempt = null
) => {

  const now = new Date();

  // =====================================
  // COMPLETED
  // =====================================

  if (
    attempt &&
    attempt.status === "SUBMITTED"
  ) {
    return {
      status: "COMPLETED",
      attempted: true,
    };
  }

  // =====================================
  // UPCOMING
  // =====================================

  if (now < snapshot.startTime) {
    return {
      status: "UPCOMING",
      attempted: false,
    };
  }

  // =====================================
  // AVAILABLE
  // =====================================

  if (
    now >= snapshot.startTime &&
    now <= snapshot.endTime
  ) {
    return {
      status: "AVAILABLE",
      attempted: false,
    };
  }

  // =====================================
  // MISSED
  // =====================================

  return {
    status: "MISSED",
    attempted: false,
  };

};

module.exports = calculateExamStatus;