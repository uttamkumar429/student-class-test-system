import {
  useEffect,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Lock,
  User,
  LogOut,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Save,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import authService from "../../services/authService";
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from "../../redux/studentNotificationPreference/notificationPreferenceThunk";

import {
  selectNotificationPreferences,
  selectNotificationPreferencesLoading,
  selectNotificationPreferencesUpdating,
  selectNotificationPreferencesError,
} from "../../redux/studentNotificationPreference/notificationPreferenceSelectors";
function StudentSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

const notificationPreferences =
  useSelector(
    selectNotificationPreferences
  );

const notificationLoading =
  useSelector(
    selectNotificationPreferencesLoading
  );

const notificationUpdating =
  useSelector(
    selectNotificationPreferencesUpdating
  );

const notificationError =
  useSelector(
    selectNotificationPreferencesError
  );

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showPasswords, setShowPasswords] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("studentTheme") || "system"
  );
  useEffect(() => {
  const root = document.documentElement;

  const applyTheme = () => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const resolvedTheme =
      theme === "system"
        ? systemPrefersDark
          ? "dark"
          : "light"
        : theme;

    root.setAttribute("data-theme", resolvedTheme);

    root.style.colorScheme = resolvedTheme;
  };

  applyTheme();

  if (theme !== "system") {
    return;
  }

  const mediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  mediaQuery.addEventListener("change", applyTheme);

  return () => {
    mediaQuery.removeEventListener(
      "change",
      applyTheme
    );
  };
}, [theme]);

const handleThemeChange = (value) => {
  setTheme(value);

  localStorage.setItem("studentTheme", value);
};
  const handleLogout = () => {
    localStorage.clear();

    navigate("/", {
      replace: true,
    });
  };
    // ======================================
  // PASSWORD INPUT CHANGE
  // ======================================

  const handlePasswordChange = (event) => {
    const { name, value } =
      event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
  };

  // ======================================
  // TOGGLE PASSWORD VISIBILITY
  // ======================================

  const togglePasswordVisibility = (
    field
  ) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ======================================
  // CHANGE PASSWORD
  // ======================================

  const handleChangePassword = async (
    event
  ) => {
    event.preventDefault();

    if (changingPassword) {
      return;
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );

      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters long."
      );

      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one uppercase letter."
      );

      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one lowercase letter."
      );

      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one number."
      );

      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one special character."
      );

      return;
    }

    try {
      setChangingPassword(true);
      setPasswordError("");

      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      toast.success(
        "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password.";

      setPasswordError(message);

      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };
  useEffect(() => {
  dispatch(
    fetchNotificationPreferences()
  );
}, [dispatch]);

const handleNotificationToggle =
  async (field) => {
    if (notificationUpdating) {
      return;
    }

    const currentValue =
      notificationPreferences[field];

    try {
      await dispatch(
        updateNotificationPreferences({
          [field]: !currentValue,
        })
      ).unwrap();

      toast.success(
        "Notification preference updated."
      );
    } catch (error) {
      toast.error(
        error ||
          "Failed to update notification preference."
      );
    }
  };
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account and student portal preferences.
        </p>
      </div>

      {/* Account */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <User size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Account
            </h2>

            <p className="text-sm text-slate-500">
              Manage your student account.
            </p>
          </div>
        </div>

        <div className="space-y-3">

          <button
            type="button"
            onClick={() =>
              navigate("/student/profile")
            }
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <User size={20} className="text-slate-500" />

              <div>
                <p className="font-medium text-slate-800">
                  Profile
                </p>

                <p className="text-sm text-slate-500">
                  View and update your profile information.
                </p>
              </div>
            </div>

            <span className="text-sm font-medium text-blue-600">
              Open
            </span>
          </button>

        </div>
      </section>

        {/* Notifications */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
            <Bell size={22} />
            </div>

            <div>
            <h2 className="text-xl font-bold text-slate-800">
                Notifications
            </h2>

            <p className="text-sm text-slate-500">
                Manage your notification preferences.
            </p>
            </div>
        </div>

        {notificationError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {notificationError}
            </div>
        )}

        {notificationLoading ? (
            <div className="space-y-3">
            {[1, 2, 3].map((item) => (
                <div
                key={item}
                className="animate-pulse rounded-xl border border-slate-200 p-4"
                >
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                    <div className="h-4 w-48 rounded bg-slate-200" />
                    <div className="h-3 w-72 rounded bg-slate-200" />
                    </div>

                    <div className="h-6 w-11 rounded-full bg-slate-200" />
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="space-y-3">

            {/* Exam */}

            <NotificationToggle
                title="Exam Notifications"
                description="Receive updates about scheduled and available exams."
                checked={
                notificationPreferences.examNotifications
                }
                disabled={notificationUpdating}
                onChange={() =>
                handleNotificationToggle(
                    "examNotifications"
                )
                }
            />

            {/* Result */}

            <NotificationToggle
                title="Result Notifications"
                description="Receive notifications when exam results are available."
                checked={
                notificationPreferences.resultNotifications
                }
                disabled={notificationUpdating}
                onChange={() =>
                handleNotificationToggle(
                    "resultNotifications"
                )
                }
            />

            {/* Announcement */}

            <NotificationToggle
                title="Announcement Notifications"
                description="Receive important announcements from the administration."
                checked={
                notificationPreferences.announcementNotifications
                }
                disabled={notificationUpdating}
                onChange={() =>
                handleNotificationToggle(
                    "announcementNotifications"
                )
                }
            />

            </div>
        )}

        </section>
        {/* ======================================
                APPEARANCE
            ====================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <SettingsIcon size={22} />
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose how the application looks.
                </p>

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <ThemeOption
                  icon={<Sun size={22} />}
                  title="Light"
                  description="Always use light mode."
                  active={theme === "light"}
                  onClick={() =>
                    handleThemeChange("light")
                  }
                />

                <ThemeOption
                  icon={<Moon size={22} />}
                  title="Dark"
                  description="Always use dark mode."
                  active={theme === "dark"}
                  onClick={() =>
                    handleThemeChange("dark")
                  }
                />

                <ThemeOption
                  icon={<Monitor size={22} />}
                  title="System"
                  description="Follow your device setting."
                  active={theme === "system"}
                  onClick={() =>
                    handleThemeChange("system")
                  }
                />

              </div>

            </section>

      {/* Security */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
            <Lock size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Security
            </h2>

            <p className="text-sm text-slate-500">
              Manage account security.
            </p>
          </div>
        </div>
        <form
        onSubmit={handleChangePassword}
        className="space-y-5"
        >
        {/* Current Password */}

        <div>
            <label
            htmlFor="currentPassword"
            className="mb-2 block font-medium text-slate-700"
            >
            Current Password
            </label>

            <div className="relative">
            <input
                id="currentPassword"
                type={
                showPasswords.current
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={
                passwordData.currentPassword
                }
                onChange={
                handlePasswordChange
                }
                disabled={changingPassword}
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter current password"
            />

            <button
                type="button"
                onClick={() =>
                togglePasswordVisibility(
                    "current"
                )
                }
                disabled={changingPassword}
                aria-label={
                showPasswords.current
                    ? "Hide current password"
                    : "Show current password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
                {showPasswords.current ? (
                <EyeOff size={18} />
                ) : (
                <Eye size={18} />
                )}
            </button>
            </div>
        </div>

        {/* New Password */}

        <div>
            <label
            htmlFor="newPassword"
            className="mb-2 block font-medium text-slate-700"
            >
            New Password
            </label>

            <div className="relative">
            <input
                id="newPassword"
                type={
                showPasswords.new
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={
                passwordData.newPassword
                }
                onChange={
                handlePasswordChange
                }
                disabled={changingPassword}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter new password"
            />

            <button
                type="button"
                onClick={() =>
                togglePasswordVisibility(
                    "new"
                )
                }
                disabled={changingPassword}
                aria-label={
                showPasswords.new
                    ? "Hide new password"
                    : "Show new password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
                {showPasswords.new ? (
                <EyeOff size={18} />
                ) : (
                <Eye size={18} />
                )}
            </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
            Minimum 8 characters with uppercase,
            lowercase, number and special character.
            </p>
        </div>

        {/* Confirm Password */}

        <div>
            <label
            htmlFor="confirmPassword"
            className="mb-2 block font-medium text-slate-700"
            >
            Confirm New Password
            </label>

            <div className="relative">
            <input
                id="confirmPassword"
                type={
                showPasswords.confirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                passwordData.confirmPassword
                }
                onChange={
                handlePasswordChange
                }
                disabled={changingPassword}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Confirm new password"
            />

            <button
                type="button"
                onClick={() =>
                togglePasswordVisibility(
                    "confirm"
                )
                }
                disabled={changingPassword}
                aria-label={
                showPasswords.confirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
                {showPasswords.confirm ? (
                <EyeOff size={18} />
                ) : (
                <Eye size={18} />
                )}
            </button>
            </div>
        </div>

        {/* Error */}

        {passwordError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {passwordError}
            </div>
        )}

        {/* Submit */}

        <div className="flex justify-end">

            <button
            type="submit"
            disabled={
                changingPassword
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
            <Save size={18} />

            {changingPassword
                ? "Changing Password..."
                : "Change Password"}
            </button>

        </div>
        </form>

      </section>

      {/* Application */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
            <SettingsIcon size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Application
            </h2>

            <p className="text-sm text-slate-500">
              General application options.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-red-200 p-4 text-left text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={20} />

          <div>
            <p className="font-semibold">
              Logout
            </p>

            <p className="text-sm text-red-500">
              Sign out from your student account.
            </p>
          </div>
        </button>

      </section>

    </div>
  );
}
function NotificationToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">

      <div className="pr-6">
        <p className="font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-green-600"
            : "bg-slate-300"
        } ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

function ThemeOption({
  icon,
  title,
  description,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition ${
        active
          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
      }`}
    >
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {icon}
      </div>

      <h3 className="font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </button>
  );
}
export default StudentSettings;