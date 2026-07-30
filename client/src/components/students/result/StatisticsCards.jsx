function StatisticsCards({
  correctAnswers,
  wrongAnswers,
  skippedAnswers,
  timeTaken,
  submittedAt,
}) {
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min} min ${sec} sec`;
  };

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleString()
    : "-";

  const cards = [
    {
      title: "Correct Answers",
      value: correctAnswers,
    },
    {
      title: "Wrong Answers",
      value: wrongAnswers,
    },
    {
      title: "Skipped",
      value: skippedAnswers,
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
    <section className="rounded-xl bg-white p-8 shadow">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-center shadow-sm transition duration-200 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              {card.title}
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 break-words">
              {card.value}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatisticsCards;