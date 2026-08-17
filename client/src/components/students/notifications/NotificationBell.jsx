import {
  Bell,
  CheckCheck,
  ClipboardCheck,
  Trophy,
  Megaphone,
  Info,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../../redux/studentNotification/notificationThunk";

import {
  selectNotifications,
  selectNotificationUnreadCount,
  selectNotificationUpdating,
} from "../../../redux/studentNotification/notificationSelectors";

function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);

  const [open, setOpen] =
    useState(false);

  const notifications =
    useSelector(
      selectNotifications
    );

  const unreadCount =
    useSelector(
      selectNotificationUnreadCount
    );

  const updating =
    useSelector(
      selectNotificationUpdating
    );

  // ======================================
  // LOAD UNREAD COUNT
  // ======================================

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // ======================================
  // REFRESH COUNT WHEN TAB GETS FOCUS
  // ======================================

  useEffect(() => {
    const handleFocus = () => {
      dispatch(fetchUnreadCount());
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [dispatch]);

  // ======================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ======================================

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [open]);

  // ======================================
  // ESCAPE KEY
  // ======================================

  useEffect(() => {
    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  // ======================================
  // OPEN / CLOSE DROPDOWN
  // ======================================

  const handleToggle = () => {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen) {
      dispatch(
        fetchNotifications({
          page: 1,
          limit: 5,
        })
      );

      dispatch(
        fetchUnreadCount()
      );
    }
  };

  // ======================================
  // MARK ONE AS READ + NAVIGATE
  // ======================================

  const handleNotificationClick =
    async (notification) => {
      if (!notification?._id) {
        return;
      }

      try {
        if (
          !notification.isRead &&
          !updating
        ) {
          await dispatch(
            markNotificationAsRead(
              notification._id
            )
          ).unwrap();

          dispatch(
            fetchUnreadCount()
          );
        }

        setOpen(false);

        const actionUrl =
          notification.actionUrl;

        if (
          typeof actionUrl ===
            "string" &&
          actionUrl.startsWith("/")
        ) {
          navigate(actionUrl);
          return;
        }

        navigate(
          "/student/notifications"
        );
      } catch (error) {
        toast.error(
          error ||
            "Failed to open notification."
        );
      }
    };

  // ======================================
  // MARK ALL
  // ======================================

  const handleMarkAllAsRead =
    async () => {
      if (
        unreadCount === 0 ||
        updating
      ) {
        return;
      }

      try {
        await dispatch(
          markAllNotificationsAsRead()
        ).unwrap();

        dispatch(
          fetchUnreadCount()
        );

        dispatch(
          fetchNotifications({
            page: 1,
            limit: 5,
          })
        );

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

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* ================================= */}
      {/* BELL BUTTON */}
      {/* ================================= */}

      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Notifications${
          unreadCount > 0
            ? `, ${unreadCount} unread`
            : ""
        }`}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* ================================= */}
      {/* DROPDOWN */}
      {/* ================================= */}

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-3 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div>
              <h2 className="font-bold text-slate-800">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  handleMarkAllAsRead
                }
                disabled={updating}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCheck size={14} />
                )}

                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}

          <div className="max-h-[420px] overflow-y-auto">

            {notifications.length ===
            0 ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Bell size={22} />
                </div>

                <p className="mt-3 font-semibold text-slate-700">
                  No notifications
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Important updates will
                  appear here.
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <NotificationDropdownItem
                    key={
                      notification._id
                    }
                    notification={
                      notification
                    }
                    disabled={
                      updating
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  />
                )
              )
            )}

          </div>

          {/* Footer */}

          <div className="border-t border-slate-200 p-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate(
                  "/student/notifications"
                );
              }}
              className="flex w-full items-center justify-center rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================
// DROPDOWN ITEM
// ======================================

function NotificationDropdownItem({
  notification,
  disabled,
  onClick,
}) {
  const isUnread =
    !notification.isRead;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left transition last:border-b-0 ${
        isUnread
          ? "bg-blue-50/50 hover:bg-blue-50"
          : "hover:bg-slate-50"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : ""
      }`}
    >
      {/* Icon */}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
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
        <div className="flex items-start justify-between gap-2">
          <p
            className={`line-clamp-1 text-sm ${
              isUnread
                ? "font-bold text-slate-900"
                : "font-semibold text-slate-700"
            }`}
          >
            {notification.title}
          </p>

          {isUnread && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
          {notification.message}
        </p>

        <p className="mt-2 text-[11px] text-slate-400">
          {formatDate(
            notification.createdAt
          )}
        </p>
      </div>
    </button>
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
        <ClipboardCheck size={17} />
      );

    case "RESULT":
      return (
        <Trophy size={17} />
      );

    case "ANNOUNCEMENT":
      return (
        <Megaphone size={17} />
      );

    default:
      return <Info size={17} />;
  }
}

// ======================================
// DATE FORMATTER
// ======================================

function formatDate(value) {
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

export default NotificationBell;