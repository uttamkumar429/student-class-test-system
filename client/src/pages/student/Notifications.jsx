import {
  Bell,
  Check,
  CheckCheck,
  ClipboardCheck,
  Trophy,
  Megaphone,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../redux/studentNotification/notificationThunk";

import {
  selectNotifications,
  selectNotificationLoading,
  selectNotificationError,
  selectNotificationPagination,
  selectNotificationUnreadCount,
  selectNotificationUpdating,
} from "../../redux/studentNotification/notificationSelectors";

function Notifications() {
  const dispatch = useDispatch();

  const notifications = useSelector(
    selectNotifications
  );

  const loading = useSelector(
    selectNotificationLoading
  );

  const error = useSelector(
    selectNotificationError
  );

  const pagination = useSelector(
    selectNotificationPagination
  );

  const unreadCount = useSelector(
    selectNotificationUnreadCount
  );

  const updating = useSelector(
    selectNotificationUpdating
  );

  useEffect(() => {
    dispatch(
      fetchNotifications({
        page: 1,
        limit: 10,
      })
    );

    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const hasNotifications =
    notifications.length > 0;

  const hasUnread =
    unreadCount > 0;

  const notificationCountLabel =
    useMemo(() => {
      if (unreadCount <= 0) {
        return "No unread notifications";
      }

      if (unreadCount === 1) {
        return "1 unread notification";
      }

      return `${unreadCount} unread notifications`;
    }, [unreadCount]);

  const handleRefresh = () => {
    dispatch(
      fetchNotifications({
        page: pagination.page || 1,
        limit: pagination.limit || 10,
      })
    );

    dispatch(fetchUnreadCount());
  };

  const handleMarkAsRead = async (
    notificationId
  ) => {
    if (!notificationId || updating) {
      return;
    }

    try {
      await dispatch(
        markNotificationAsRead(
          notificationId
        )
      ).unwrap();

      dispatch(fetchUnreadCount());
    } catch (error) {
      toast.error(
        error ||
          "Failed to mark notification as read."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!hasUnread || updating) {
      return;
    }

    try {
      await dispatch(
        markAllNotificationsAsRead()
      ).unwrap();

      dispatch(
        fetchNotifications({
          page:
            pagination.page || 1,
          limit:
            pagination.limit || 10,
        })
      );

      dispatch(fetchUnreadCount());

      toast.success(
        "All notifications marked as read."
      );
    } catch (error) {
      toast.error(
        error ||
          "Failed to mark notifications as read."
      );
    }
  };

  const handlePageChange = (
    nextPage
  ) => {
    if (
      loading ||
      nextPage < 1 ||
      nextPage >
        (pagination.totalPages || 1)
    ) {
      return;
    }

    dispatch(
      fetchNotifications({
        page: nextPage,
        limit:
          pagination.limit || 10,
      })
    );
  };

  return (
    <div className="space-y-8">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Bell size={24} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Notifications
            </h1>
          </div>

          <p className="mt-2 text-slate-500">
            {notificationCountLabel}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || updating}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={
              !hasUnread ||
              updating
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <CheckCheck
                size={18}
              />
            )}

            Mark all as read
          </button>

        </div>
      </div>

      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="font-semibold text-red-700">
                Failed to load notifications
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw size={17} />
              Retry
            </button>

          </div>
        </div>
      )}

      {/* ================================= */}
      {/* LOADING */}
      {/* ================================= */}

      {loading && (
        <div className="space-y-4">

          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex gap-4">

                  <div className="h-11 w-11 rounded-xl bg-slate-200" />

                  <div className="flex-1 space-y-3">

                    <div className="h-4 w-64 rounded bg-slate-200" />

                    <div className="h-3 w-full rounded bg-slate-200" />

                    <div className="h-3 w-40 rounded bg-slate-200" />

                  </div>

                </div>
              </div>
            )
          )}

        </div>
      )}

      {/* ================================= */}
      {/* EMPTY STATE */}
      {/* ================================= */}

      {!loading &&
        !error &&
        !hasNotifications && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bell size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-700">
              No Notifications
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              You are all caught up. Important
              exam, result and announcement
              updates will appear here.
            </p>

          </div>
        )}

      {/* ================================= */}
      {/* NOTIFICATION LIST */}
      {/* ================================= */}

      {!loading &&
        !error &&
        hasNotifications && (
          <div className="space-y-4">

            {notifications.map(
              (notification) => (
                <NotificationItem
                  key={
                    notification._id
                  }
                  notification={
                    notification
                  }
                  updating={
                    updating
                  }
                  onMarkAsRead={
                    handleMarkAsRead
                  }
                />
              )
            )}

          </div>
        )}

      {/* ================================= */}
      {/* PAGINATION */}
      {/* ================================= */}

      {!loading &&
        hasNotifications &&
        (pagination.totalPages || 0) >
          1 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">

            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {
                  pagination.totalPages
                }
              </span>
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    pagination.page -
                      1
                  )
                }
                disabled={
                  loading ||
                  pagination.page <=
                    1
                }
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    pagination.page +
                      1
                  )
                }
                disabled={
                  loading ||
                  pagination.page >=
                    pagination.totalPages
                }
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>

            </div>

          </div>
        )}

    </div>
  );
}

// ======================================
// NOTIFICATION ITEM
// ======================================

function NotificationItem({
  notification,
  updating,
  onMarkAsRead,
}) {
  const isUnread =
    !notification.isRead;

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        isUnread
          ? "border-blue-200 bg-blue-50/30"
          : "border-slate-200"
      }`}
    >

      <div className="flex items-start gap-4">

        {/* Icon */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isUnread
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <NotificationIcon
            type={notification.type}
          />
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">

            <div className="flex items-center gap-2">

              <h3
                className={`font-semibold ${
                  isUnread
                    ? "text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {notification.title}
              </h3>

              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}

            </div>

            <time
              dateTime={
                notification.createdAt
              }
              className="shrink-0 text-xs text-slate-400"
            >
              {formatNotificationDate(
                notification.createdAt
              )}
            </time>

          </div>

          <p className="mt-2 leading-6 text-slate-500">
            {notification.message}
          </p>

          <div className="mt-4 flex items-center justify-between gap-4">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isUnread
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isUnread
                ? "Unread"
                : "Read"}
            </span>

            {isUnread && (
              <button
                type="button"
                onClick={() =>
                  onMarkAsRead(
                    notification._id
                  )
                }
                disabled={
                  updating
                }
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />

                Mark as read
              </button>
            )}

          </div>

        </div>

      </div>

    </article>
  );
}

// ======================================
// TYPE ICON
// ======================================

function NotificationIcon({
  type,
}) {
  switch (type) {
    case "EXAM":
      return (
        <ClipboardCheck size={21} />
      );

    case "RESULT":
      return (
        <Trophy size={21} />
      );

    case "ANNOUNCEMENT":
      return (
        <Megaphone size={21} />
      );

    default:
      return (
        <Info size={21} />
      );
  }
}

// ======================================
// DATE FORMATTER
// ======================================

function formatNotificationDate(
  value
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

export default Notifications;