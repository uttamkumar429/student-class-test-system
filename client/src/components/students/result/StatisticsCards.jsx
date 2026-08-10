function StatisticsCards({
  correctAnswers = 0,
  wrongAnswers = 0,
  skippedAnswers = 0,
  timeTaken = 0,
  submittedAt,
}) {
  // ======================================
  // FORMAT TIME
  // ======================================

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(
      0,
      Number(seconds) || 0
    );

    const min = Math.floor(
      safeSeconds / 60
    );

    const sec = safeSeconds % 60;

    return `${min} min ${sec} sec`;
  };

  // ======================================
  // FORMAT SUBMITTED DATE
  // ======================================

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "-";

  // ======================================
  // STATISTICS
  // ======================================

  const cards = [
    {
      title: "Correct Answers",
      value: Number(correctAnswers) || 0,
    },
    {
      title: "Wrong Answers",
      value: Number(wrongAnswers) || 0,
    },
    {
      title: "Skipped",
      value: Number(skippedAnswers) || 0,
    },
    {
      title: "Time Taken",
      value: formatTime(timeTaken),
    },
    {
      title: "Submitted At",
      value: formattedDate,
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <h3 className="mt-3 break-words text-2xl font-bold text-gray-900">
              {card.value}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatisticsCards;