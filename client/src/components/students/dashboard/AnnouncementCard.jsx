import {
  Bell,
  ClipboardCheck,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import PropTypes from "prop-types";

// ======================================
// ANNOUNCEMENT CARD
// ======================================

function AnnouncementCard({
  announcements = [],
  loading = false,
  error = null,
}) {
  // ======================================
  // FORMAT TIME
  // ======================================

  const formatAnnouncementTime = (
    publishedAt
  ) => {
    if (!publishedAt) {
      return "Recently";
    }

    const date = new Date(
      publishedAt
    );

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ======================================
  // GET ICON
  // ======================================

  const getIcon = (type) => {
    switch (type) {
      case "exam":
        return (
          <ClipboardCheck
            size={22}
            className="text-blue-600"
          />
        );

      case "result":
        return (
          <Trophy
            size={22}
            className="text-green-600"
          />
        );

      case "warning":
        return (
          <AlertTriangle
            size={22}
            className="text-orange-500"
          />
        );

      case "info":
      default:
        return (
          <Bell
            size={22}
            className="text-slate-500 dark:text-slate-400"
          />
        );
    }
  };

  // ======================================
  // LOADING STATE
  // ======================================

  if (loading) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Announcements
          </h2>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Stay updated with the latest activities.
          </p>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl border border-slate-100 p-4 dark:border-slate-800"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />

                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />

                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ======================================
  // ERROR STATE
  // ======================================

  if (error) {
    return (
      <section className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-950/30">
       <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
          Announcements
        </h2>

        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      </section>
    );
  }

  // ======================================
  // EMPTY STATE
  // ======================================

  if (!announcements.length) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Announcements
          </h2>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Stay updated with the latest activities.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <Bell
            size={28}
            className="mx-auto text-slate-400 dark:text-slate-500"
          />

          <h3 className="mt-3 font-semibold text-slate-700 dark:text-slate-200">
            No Announcements
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            There are no new announcements right now.
          </p>
        </div>
      </section>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      {/* Header */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Announcements
        </h2>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Stay updated with the latest activities.
        </p>
      </div>

      {/* List */}

      <div className="space-y-5">

        {announcements.map((item) => (
          <article
            key={item._id}
            className="flex items-start gap-4 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
          >

            {/* Icon */}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              {getIcon(item.type)}
            </div>

            {/* Content */}

            <div className="min-w-0 flex-1">

              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">

                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {item.title}
                </h3>

                <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                  {formatAnnouncementTime(
                    item.publishedAt
                  )}
                </span>

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {item.description}
              </p>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

// ======================================
// PROP TYPES
// ======================================

AnnouncementCard.propTypes = {
  announcements:
    PropTypes.arrayOf(
      PropTypes.shape({
        _id:
          PropTypes.string.isRequired,

        title:
          PropTypes.string.isRequired,

        description:
          PropTypes.string.isRequired,

        type:
          PropTypes.oneOf([
            "exam",
            "result",
            "warning",
            "info",
          ]).isRequired,

        isPublished:
          PropTypes.bool,

        publishedAt:
          PropTypes.string,

        expiresAt:
          PropTypes.string,

        createdBy:
          PropTypes.shape({
            _id:
              PropTypes.string,

            fullName:
              PropTypes.string,

            email:
              PropTypes.string,
          }),
      })
    ),

  loading:
    PropTypes.bool,

  error:
    PropTypes.string,
};

export default AnnouncementCard;