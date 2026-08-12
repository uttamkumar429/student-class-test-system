import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { toast } from "sonner";

import {
  CheckCircle2,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  fetchSettings,
  updatePassPercentage,
} from "../../redux/adminSettings/settingsThunk";

import {
  clearSettingsError,
  resetUpdateSuccess,
} from "../../redux/adminSettings/settingsSlice";

import {
  selectPassPercentage,
  selectSettingsLoading,
  selectSettingsUpdating,
  selectSettingsError,
  selectSettingsUpdateError,
  selectSettingsUpdateSuccess,
} from "../../redux/adminSettings/settingsSelectors";

function Settings() {
  const dispatch = useDispatch();

  const passPercentage =
    useSelector(selectPassPercentage);

  const loading =
    useSelector(selectSettingsLoading);

  const updating =
    useSelector(selectSettingsUpdating);

  const error =
    useSelector(selectSettingsError);

  const updateError =
    useSelector(
      selectSettingsUpdateError
    );

  const updateSuccess =
    useSelector(
      selectSettingsUpdateSuccess
    );

  const [passPercentageInput, setPassPercentageInput] =
    useState("33");

  // ======================================
  // FETCH SETTINGS
  // ======================================

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // ======================================
  // HYDRATE INPUT
  // ======================================

  useEffect(() => {
    setPassPercentageInput(
      String(passPercentage)
    );
  }, [passPercentage]);

  // ======================================
  // ERROR TOAST
  // ======================================

  useEffect(() => {
    if (error) {
      toast.error(error);

      dispatch(clearSettingsError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);

      dispatch(clearSettingsError());
    }
  }, [updateError, dispatch]);

  // ======================================
  // SUCCESS TOAST
  // ======================================

  useEffect(() => {
    if (updateSuccess) {
      toast.success(
        "Pass percentage updated successfully."
      );

      dispatch(resetUpdateSuccess());
    }
  }, [
    updateSuccess,
    dispatch,
  ]);

  // ======================================
  // HANDLE SAVE
  // ======================================

  const handleSavePassPercentage =
    async (event) => {
      event.preventDefault();

      const value = Number(
        passPercentageInput
      );

      // ------------------------------------
      // Validate number
      // ------------------------------------

      if (!Number.isFinite(value)) {
        toast.error(
          "Please enter a valid percentage."
        );

        return;
      }

      // ------------------------------------
      // Validate range
      // ------------------------------------

      if (value < 0 || value > 100) {
        toast.error(
          "Pass percentage must be between 0 and 100."
        );

        return;
      }

      // ------------------------------------
      // Prevent unnecessary request
      // ------------------------------------

      if (value === passPercentage) {
        toast.info(
          "No changes to save."
        );

        return;
      }

      try {
        await dispatch(
          updatePassPercentage(value)
        ).unwrap();
      } catch {
        // Error toast handled by Redux state.
      }
    };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* ==================================
            HEADER
        ================================== */}

        <div>
          <p className="text-sm font-medium text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Manage system-wide examination
            settings and administrative preferences.
          </p>
        </div>

        {/* ==================================
            GENERAL SETTINGS
        ================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-4 border-b border-slate-200 p-6">

            <div className="rounded-xl bg-blue-50 p-3">
              <SettingsIcon
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Examination Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure how exam results are
                evaluated.
              </p>
            </div>

          </div>

          <div className="p-6">

            <form
              onSubmit={
                handleSavePassPercentage
              }
              className="max-w-xl"
            >

              <div>
                <label
                  htmlFor="passPercentage"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Pass Percentage
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Students must achieve at least
                  this percentage to pass an exam.
                </p>

                <div className="mt-4 flex items-center gap-3">

                  <input
                    id="passPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={
                      passPercentageInput
                    }
                    onChange={(event) =>
                      setPassPercentageInput(
                        event.target.value
                      )
                    }
                    disabled={
                      loading || updating
                    }
                    className="w-40 rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <span className="text-lg font-semibold text-slate-500">
                    %
                  </span>

                </div>
              </div>

              {/* =================================
                  SAVE
              ================================= */}

              <button
                type="submit"
                disabled={
                  loading || updating
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >

                <Save size={18} />

                {updating
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </form>

          </div>
        </section>

        {/* ==================================
            CURRENT VALUE
        ================================== */}

        <section className="rounded-2xl border border-green-200 bg-green-50 p-6">

          <div className="flex items-start gap-4">

            <CheckCircle2
              size={22}
              className="mt-0.5 text-green-600"
            />

            <div>
              <h2 className="font-semibold text-green-800">
                Current Pass Percentage
              </h2>

              <p className="mt-1 text-sm text-green-700">
                The current system threshold is{" "}
                <span className="font-bold">
                  {passPercentage}%
                </span>
                .
              </p>

            </div>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

export default Settings;