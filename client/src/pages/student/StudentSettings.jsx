import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

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
  Palette,
  Languages,
  SlidersHorizontal,
  Check,
  ChevronRight,
  Zap,
  Accessibility,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "sonner";

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

  // ======================================
  // REDUX
  // ======================================

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

  // ======================================
  // PASSWORD STATE
  // ======================================

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

  // ======================================
  // APPLICATION PREFERENCES
  // ======================================

  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem("studentTheme") ||
      "system"
  );

  const [accentColor, setAccentColor] =
    useState(
      () =>
        localStorage.getItem(
          "studentAccentColor"
        ) || "blue"
    );

  const [language, setLanguage] =
    useState(
      () =>
        localStorage.getItem(
          "studentLanguage"
        ) || "en"
    );

  const [compactMode, setCompactMode] =
    useState(
      () =>
        localStorage.getItem(
          "studentCompactMode"
        ) === "true"
    );

  const [reducedMotion, setReducedMotion] =
    useState(
      () =>
        localStorage.getItem(
          "studentReducedMotion"
        ) === "true"
    );

  // ======================================
  // APPLY THEME
  // ======================================

  useEffect(() => {
    const root =
      document.documentElement;

    const applyTheme = () => {
      const systemPrefersDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

      const resolvedTheme =
        theme === "system"
          ? systemPrefersDark
            ? "dark"
            : "light"
          : theme;

      root.classList.remove(
        "light",
        "dark"
      );

      root.classList.add(
        resolvedTheme
      );

      root.style.colorScheme =
        resolvedTheme;
    };

    applyTheme();

    if (theme !== "system") {
      return;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    mediaQuery.addEventListener(
      "change",
      applyTheme
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        applyTheme
      );
    };
  }, [theme]);

  // ======================================
  // APPLY ACCENT COLOR
  // ======================================

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-accent",
      accentColor
    );

    localStorage.setItem(
      "studentAccentColor",
      accentColor
    );
  }, [accentColor]);

  // ======================================
  // APPLY COMPACT MODE
  // ======================================

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "compact-mode",
      compactMode
    );

    localStorage.setItem(
      "studentCompactMode",
      compactMode
    );
  }, [compactMode]);

  // ======================================
  // APPLY REDUCED MOTION
  // ======================================

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "reduce-motion",
      reducedMotion
    );

    localStorage.setItem(
      "studentReducedMotion",
      reducedMotion
    );
  }, [reducedMotion]);

  // ======================================
  // LANGUAGE
  // ======================================

  useEffect(() => {
    localStorage.setItem(
      "studentLanguage",
      language
    );

    document.documentElement.lang =
      language;
  }, [language]);

  // ======================================
  // THEME CHANGE
  // ======================================

  const handleThemeChange = (value) => {
    setTheme(value);

    localStorage.setItem(
      "studentTheme",
      value
    );

    toast.success(
      "Appearance preference updated."
    );
  };

  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {
    localStorage.clear();

    navigate("/", {
      replace: true,
    });
  };

  // ======================================
  // PASSWORD INPUT CHANGE
  // ======================================

  const handlePasswordChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
  };

  // ======================================
  // TOGGLE PASSWORD
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

    if (
      !/[^A-Za-z0-9]/.test(
        newPassword
      )
    ) {
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

  // ======================================
  // FETCH NOTIFICATION PREFERENCES
  // ======================================

  useEffect(() => {
    dispatch(
      fetchNotificationPreferences()
    );
  }, [dispatch]);

  // ======================================
  // NOTIFICATION TOGGLE
  // ======================================

  const handleNotificationToggle =
    async (field) => {
      if (notificationUpdating) {
        return;
      }

      const currentValue =
        notificationPreferences?.[field];

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

      {/* ======================================
          HEADER
      ====================================== */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Settings
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your account and student portal preferences.
        </p>
      </div>

      {/* ======================================
          ACCOUNT
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <User size={22} />
          }
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          title="Account"
          description="Manage your student account."
        />

        <button
          type="button"
          onClick={() =>
            navigate("/student/profile")
          }
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">

            <User
              size={20}
              className="text-slate-500 dark:text-slate-400"
            />

            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                Profile
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                View and update your profile information.
              </p>
            </div>

          </div>

          <ChevronRight
            size={20}
            className="text-slate-400"
          />
        </button>

      </section>

      {/* ======================================
          NOTIFICATIONS
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <Bell size={22} />
          }
          iconClassName="bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
          title="Notifications"
          description="Manage your notification preferences."
        />

        {notificationError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {notificationError}
          </div>
        )}

        {notificationLoading ? (
          <div className="space-y-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">

                  <div className="space-y-2">
                    <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />

                    <div className="h-3 w-72 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>

                  <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-700" />

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="space-y-3">

            <NotificationToggle
              title="Exam Notifications"
              description="Receive updates about scheduled and available exams."
              checked={
                Boolean(
                  notificationPreferences?.examNotifications
                )
              }
              disabled={
                notificationUpdating
              }
              onChange={() =>
                handleNotificationToggle(
                  "examNotifications"
                )
              }
            />

            <NotificationToggle
              title="Result Notifications"
              description="Receive notifications when exam results are available."
              checked={
                Boolean(
                  notificationPreferences?.resultNotifications
                )
              }
              disabled={
                notificationUpdating
              }
              onChange={() =>
                handleNotificationToggle(
                  "resultNotifications"
                )
              }
            />

            <NotificationToggle
              title="Announcement Notifications"
              description="Receive important announcements from the administration."
              checked={
                Boolean(
                  notificationPreferences?.announcementNotifications
                )
              }
              disabled={
                notificationUpdating
              }
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <Palette size={22} />
          }
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
          title="Appearance"
          description="Customize how the student portal looks."
        />

        <div className="grid gap-4 md:grid-cols-3">

          <ThemeOption
            icon={
              <Sun size={22} />
            }
            title="Light"
            description="Always use light mode."
            active={
              theme === "light"
            }
            onClick={() =>
              handleThemeChange("light")
            }
          />

          <ThemeOption
            icon={
              <Moon size={22} />
            }
            title="Dark"
            description="Always use dark mode."
            active={
              theme === "dark"
            }
            onClick={() =>
              handleThemeChange("dark")
            }
          />

          <ThemeOption
            icon={
              <Monitor size={22} />
            }
            title="System"
            description="Follow your device setting."
            active={
              theme === "system"
            }
            onClick={() =>
              handleThemeChange("system")
            }
          />

        </div>

      </section>

      {/* ======================================
          THEME SETTINGS
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <Palette size={22} />
          }
          iconClassName="bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400"
          title="Theme Settings"
          description="Choose your preferred application accent."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <AccentOption
            title="Blue"
            value="blue"
            accentColor={accentColor}
            onClick={setAccentColor}
          />

          <AccentOption
            title="Purple"
            value="purple"
            accentColor={accentColor}
            onClick={setAccentColor}
          />

          <AccentOption
            title="Green"
            value="green"
            accentColor={accentColor}
            onClick={setAccentColor}
          />

          <AccentOption
            title="Orange"
            value="orange"
            accentColor={accentColor}
            onClick={setAccentColor}
          />

        </div>

      </section>

      {/* ======================================
          LANGUAGE
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <Languages size={22} />
          }
          iconClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          title="Language"
          description="Choose your preferred application language."
        />

        <div className="grid gap-3 md:grid-cols-3">

          <LanguageOption
            title="English"
            subtitle="English"
            value="en"
            active={
              language === "en"
            }
            onClick={() => {
              setLanguage("en");

              toast.success(
                "Language preference updated."
              );
            }}
          />

          <LanguageOption
            title="Hindi"
            subtitle="हिन्दी"
            value="hi"
            active={
              language === "hi"
            }
            onClick={() => {
              setLanguage("hi");

              toast.success(
                "Language preference updated."
              );
            }}
          />

          <LanguageOption
            title="System Default"
            subtitle="Browser preference"
            value="system"
            active={
              language === "system"
            }
            onClick={() => {
              setLanguage("system");

              toast.success(
                "Language preference updated."
              );
            }}
          />

        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Language preference is saved for your account on this device.
          Full application translation can be connected later through an
          internationalization system.
        </p>

      </section>

      {/* ======================================
          GENERAL PREFERENCES
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <SlidersHorizontal size={22} />
          }
          iconClassName="bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
          title="General Preferences"
          description="Adjust the application experience according to your preference."
        />

        <div className="space-y-3">

          <PreferenceToggle
            icon={
              <Zap size={20} />
            }
            title="Compact Mode"
            description="Use a more compact layout with reduced spacing."
            checked={compactMode}
            onChange={() => {
              setCompactMode(
                (prev) => !prev
              );
            }}
          />

          <PreferenceToggle
            icon={
              <Accessibility size={20} />
            }
            title="Reduce Motion"
            description="Reduce non-essential animations and transitions."
            checked={reducedMotion}
            onChange={() => {
              setReducedMotion(
                (prev) => !prev
              );
            }}
          />

        </div>

      </section>

      {/* ======================================
          SECURITY
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <Lock size={22} />
          }
          iconClassName="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
          title="Security"
          description="Manage your account security."
        />

        <form
          onSubmit={
            handleChangePassword
          }
          className="space-y-5"
        >

          <PasswordInput
            id="currentPassword"
            label="Current Password"
            name="currentPassword"
            value={
              passwordData.currentPassword
            }
            onChange={
              handlePasswordChange
            }
            visible={
              showPasswords.current
            }
            onToggle={() =>
              togglePasswordVisibility(
                "current"
              )
            }
            disabled={
              changingPassword
            }
            autoComplete="current-password"
            placeholder="Enter current password"
          />

          <PasswordInput
            id="newPassword"
            label="New Password"
            name="newPassword"
            value={
              passwordData.newPassword
            }
            onChange={
              handlePasswordChange
            }
            visible={
              showPasswords.new
            }
            onToggle={() =>
              togglePasswordVisibility(
                "new"
              )
            }
            disabled={
              changingPassword
            }
            autoComplete="new-password"
            placeholder="Enter new password"
          />

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Minimum 8 characters with uppercase,
            lowercase, number and special character.
          </p>

          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            name="confirmPassword"
            value={
              passwordData.confirmPassword
            }
            onChange={
              handlePasswordChange
            }
            visible={
              showPasswords.confirm
            }
            onToggle={() =>
              togglePasswordVisibility(
                "confirm"
              )
            }
            disabled={
              changingPassword
            }
            autoComplete="new-password"
            placeholder="Confirm new password"
          />

          {passwordError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {passwordError}
            </div>
          )}

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

      {/* ======================================
          APPLICATION
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <SectionHeader
          icon={
            <SettingsIcon size={22} />
          }
          iconClassName="bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
          title="Application"
          description="Manage your student portal session."
        />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-red-200 p-4 text-left text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/30"
        >
          <LogOut size={20} />

          <div>
            <p className="font-semibold">
              Logout
            </p>

            <p className="text-sm text-red-500 dark:text-red-400">
              Sign out from your student account.
            </p>
          </div>
        </button>

      </section>

    </div>
  );
}

// ======================================
// SECTION HEADER
// ======================================

function SectionHeader({
  icon,
  iconClassName,
  title,
  description,
}) {
  return (
    <div className="mb-6 flex items-center gap-3">

      <div
        className={`rounded-xl p-3 ${iconClassName}`}
      >
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

    </div>
  );
}

// ======================================
// NOTIFICATION TOGGLE
// ======================================

function NotificationToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">

      <div className="pr-6">
        <p className="font-medium text-slate-800 dark:text-slate-100">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        label={title}
      />

    </div>
  );
}

// ======================================
// GENERAL PREFERENCE TOGGLE
// ======================================

function PreferenceToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">

      <div className="flex items-center gap-3">

        <div className="text-slate-500 dark:text-slate-400">
          {icon}
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
        label={title}
      />

    </div>
  );
}

// ======================================
// COMMON TOGGLE
// ======================================

function Toggle({
  checked,
  disabled = false,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked
          ? "bg-green-600"
          : "bg-slate-300 dark:bg-slate-700"
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
  );
}

// ======================================
// THEME OPTION
// ======================================

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
          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      }`}
    >
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        }`}
      >
        {icon}
      </div>

      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

    </button>
  );
}

// ======================================
// ACCENT OPTION
// ======================================

function AccentOption({
  title,
  value,
  accentColor,
  onClick,
}) {
  const active =
    accentColor === value;

  const colorClasses = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    green: "bg-green-600",
    orange: "bg-orange-500",
  };

  return (
    <button
      type="button"
      onClick={() => {
        onClick(value);

        toast.success(
          `${title} accent selected.`
        );
      }}
      className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
        active
          ? "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-500/20"
          : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
      }`}
    >
      <div className="flex items-center gap-3">

        <span
          className={`h-5 w-5 rounded-full ${colorClasses[value]}`}
        />

        <span className="font-medium text-slate-800 dark:text-slate-100">
          {title}
        </span>

      </div>

      {active && (
        <Check
          size={18}
          className="text-blue-600"
        />
      )}

    </button>
  );
}

// ======================================
// LANGUAGE OPTION
// ======================================

function LanguageOption({
  title,
  subtitle,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
        active
          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
          : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
      }`}
    >
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      {active && (
        <Check
          size={18}
          className="text-blue-600"
        />
      )}

    </button>
  );
}

// ======================================
// PASSWORD INPUT
// ======================================

function PasswordInput({
  id,
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  disabled,
  autoComplete,
  placeholder,
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2 block font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <div className="relative">

        <input
          id={id}
          type={
            visible
              ? "text"
              : "password"
          }
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-500/20 dark:disabled:bg-slate-900"
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
}

export default StudentSettings;