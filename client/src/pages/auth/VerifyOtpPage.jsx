import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShieldCheck } from "lucide-react";

import { loginSuccess } from "../../redux/auth/authSlice";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import authService from "../../services/authService";
import {
  loadMsg91Widget,
  initializeMsg91Widget,
} from "../../services/msg91Widget";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phone = location.state?.phone;


  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [hasReqId, setHasReqId] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] =
    useState(RESEND_COOLDOWN);

  // MSG91 request/session reference.
  const reqIdRef = useRef(null);

  // Prevent React StrictMode from sending OTP twice.
  const initialOtpSentRef = useRef(false);

  // Prevent double-click / duplicate verification requests.
  const verifyingRef = useRef(false);

  // Prevent duplicate resend requests.
  const resendInProgressRef = useRef(false);

  // Prevent state updates after unmount.
  const mountedRef = useRef(false);

  // =========================================
  // Validate navigation state
  // =========================================

  useEffect(() => {
    if (!phone) {
      navigate("/register", { replace: true });
    }
  }, [phone, navigate]);

  // =========================================
  // Load MSG91 SDK
  // =========================================

  useEffect(() => {
    if (!phone) return;

    // Reset the OTP session whenever this verification page
    // is opened for a different phone number.
    reqIdRef.current = null;
    initialOtpSentRef.current = false;
    verifyingRef.current = false;
    resendInProgressRef.current = false;

    if (mountedRef.current) {
      setSdkReady(false);
      setHasReqId(false);
      setOtp("");
      setError("");
      setSuccess("");
      setResendTimer(RESEND_COOLDOWN);
    }

    mountedRef.current = true;

    const setupMsg91 = async () => {
      try {
        setError("");

        await loadMsg91Widget();

        if (!mountedRef.current) return;

        const widgetId =
          import.meta.env.VITE_MSG91_WIDGET_ID;
        const tokenAuth =
          import.meta.env.VITE_MSG91_TOKEN_AUTH;

        if (!widgetId || !tokenAuth) {
          throw new Error(
            "MSG91 widget configuration is missing."
          );
        }

        initializeMsg91Widget({
          widgetId,
          tokenAuth,

          success: () => {
            // Verification is handled explicitly
            // through window.verifyOtp().
          },

          failure: (widgetError) => {
            console.error(
              "MSG91 Widget Error:",
              widgetError?.message || "OTP service error"
            );
          },
        });

        // MSG91 may expose its global methods a moment after
        // initializeMsg91Widget() returns. Wait for the methods
        // before declaring the SDK ready, preventing the first
        // OTP request from racing against SDK startup.
        const waitForMsg91Methods = () =>
          new Promise((resolve, reject) => {
            const startedAt = Date.now();
            const timeout = 10000;
            const interval = 100;

            const check = () => {
              if (!mountedRef.current) return;

              const ready =
                typeof window.sendOtp === "function" &&
                typeof window.verifyOtp === "function";

              if (ready) {
                resolve();
                return;
              }

              if (Date.now() - startedAt >= timeout) {
                reject(
                  new Error("MSG91 OTP methods are not ready.")
                );
                return;
              }

              window.setTimeout(check, interval);
            };

            check();
          });

        await waitForMsg91Methods();

        if (mountedRef.current) {
          setSdkReady(true);
        }
      } catch (error) {
        console.error(
          "MSG91 SDK Error:",
          error?.message || error
        );

        if (mountedRef.current) {
          setError(
            "Unable to load OTP service. Please try again."
          );
        }
      }
    };

    setupMsg91();

    return () => {
      mountedRef.current = false;
    };
  }, [phone]);

  // =========================================
  // Resend countdown
  // =========================================

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // =========================================
  // Send OTP
  // =========================================
const sendOtp = useCallback(() => {
  return new Promise((resolve, reject) => {
    if (!window.sendOtp) {
      reject(new Error("MSG91 OTP service is not ready."));
      return;
    }

    const identifier = `91${phone}`;

    window.sendOtp(
      identifier,

      (data) => {
        // MSG91 widget returns reqId inside `message`
        // for the current SDK response format.
        const requestId =
          data?.reqId ||
          data?.requestId ||
          data?.message ||
          null;

        if (!requestId) {
          console.error("MSG91 SEND OTP RESPONSE:", data);
          reject(
            new Error("OTP request ID was not received.")
          );
          return;
        }

        reqIdRef.current = requestId;

        if (mountedRef.current) {
          setHasReqId(true);
        }

        console.log("MSG91 OTP SENT:", {
          type: data?.type,
          requestId,
        });

        resolve(data);
      },

      (error) => {
        console.error("MSG91 SEND OTP FAILURE:", error);
        reject(error);
      }
    );
  });
}, [phone]);
  // =========================================
  // Initial OTP
  // =========================================

  useEffect(() => {
    if (
      !sdkReady ||
      !phone ||
      initialOtpSentRef.current
    ) {
      return;
    }

    initialOtpSentRef.current = true;

    let active = true;

    const sendInitialOtp = async () => {
      try {
        setError("");
        setSuccess("");

        await sendOtp();

        if (!active || !mountedRef.current) return;

        setOtp("");
        setResendTimer(RESEND_COOLDOWN);

        setSuccess(
          "OTP has been sent to your mobile number."
        );
      } catch (error) {
        console.error(
          "Send OTP Error:",
          error?.message || error
        );

        if (active && mountedRef.current) {
          setError(
            error?.message === "IPBlocked"
              ? "OTP service is temporarily unavailable. Please try again later."
              : "Unable to send OTP. Please try again."
          );
        }

        // Allow retry if the initial request itself failed.
        initialOtpSentRef.current = false;
      }
    };

    sendInitialOtp();

    return () => {
      active = false;
    };
  }, [sdkReady, phone, sendOtp]);

  // =========================================
  // Verify OTP
  // =========================================

  const handleVerify = async (event) => {
    event.preventDefault();

    if (verifyingRef.current) {
      return;
    }

    setError("");
    setSuccess("");

    if (otp.length !== OTP_LENGTH) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!sdkReady || !window.verifyOtp) {
      setError(
        "OTP service is not ready. Please wait a moment."
      );
      return;
    }

    if (!reqIdRef.current) {
      setError(
        "OTP session expired. Please request a new OTP."
      );
      return;
    }

    verifyingRef.current = true;
    setLoading(true);

    try {
      await new Promise((resolve, reject) => {
        window.verifyOtp(
          Number(otp),

          async (data) => {
            try {
              // MSG91 currently returns the JWT
              // in `message`, but keep fallbacks
              // for compatible response formats.
              const accessToken =
                data?.token ||
                data?.accessToken ||
                data?.["access-token"] ||
                data?.message;

              if (!accessToken) {
                console.error("MSG91 VERIFY RESPONSE:", data);

                reject(
                  new Error("OTP verification token was not received.")
                );

                return;
              }

              const response =
                await authService.verifyOtp({
                  phone,
                  accessToken,
                });

              if (!response?.success) {
                reject(
                  new Error(
                    response?.message ||
                      "Mobile verification failed."
                  )
                );
                return;
              }

              if (
                !response?.token ||
                !response?.user
              ) {
                reject(
                  new Error(
                    "Authentication response is incomplete."
                  )
                );
                return;
              }

              // Final TestVeda authentication state.
              dispatch(
                loginSuccess({
                  user: response.user,
                  token: response.token,
                })
              );

              resolve(response);
            } catch (error) {
              reject(error);
            }
          },

          (error) => {
            reject(error);
          },

          reqIdRef.current
        );
      });

      if (!mountedRef.current) return;

      setSuccess(
        "Mobile number verified successfully."
      );

      // Clear OTP session reference after success.
      reqIdRef.current = null;
      setHasReqId(false);

      navigate("/student/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "OTP Verification Error:",
        error?.message || error
      );

      if (mountedRef.current) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Invalid or expired OTP."
        );
      }
    } finally {
      verifyingRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  // =========================================
  // Resend OTP
  // =========================================

  const handleResend = async () => {
    if (
      resendTimer > 0 ||
      resending ||
      resendInProgressRef.current
    ) {
      return;
    }

    if (!window.retryOtp) {
      setError(
        "OTP service is not ready. Please try again."
      );
      return;
    }

    if (!reqIdRef.current) {
      setError(
        "OTP session expired. Please restart verification."
      );
      return;
    }

    resendInProgressRef.current = true;
    setResending(true);
    setError("");
    setSuccess("");

    try {
      await new Promise((resolve, reject) => {
        window.retryOtp(
          null,

          (data) => {
            const requestId =
              data?.reqId ||
              data?.requestId ||
              data?.request_id ||
              data?.message ||
              reqIdRef.current;

            reqIdRef.current = requestId;
            setHasReqId(Boolean(requestId));

            resolve(data);
          },

          (error) => {
            reject(error);
          },

          reqIdRef.current
        );
      });

      if (!mountedRef.current) return;

      setOtp("");
      setResendTimer(RESEND_COOLDOWN);
      setSuccess("A new OTP has been sent.");
    } catch (error) {
      console.error(
        "Resend OTP Error:",
        error?.message || error
      );

      if (mountedRef.current) {
        setError(
          error?.message ||
            "Unable to resend OTP. Please try again."
        );
      }
    } finally {
      resendInProgressRef.current = false;

      if (mountedRef.current) {
        setResending(false);
      }
    }
  };

  // =========================================
  // Render
  // =========================================

  if (!phone) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4 text-blue-600">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h2 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Verify Mobile Number
        </h2>

        <p className="mb-8 text-center text-slate-500">
          Enter the 6-digit OTP sent to
          <br />
          <span className="font-medium text-slate-700">
            +91 {phone}
          </span>
        </p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            OTP
          </label>

          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={OTP_LENGTH}
            value={otp}
            disabled={loading}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, "")
                .slice(0, OTP_LENGTH);

              setOtp(value);
              setError("");
            }}
            placeholder="Enter 6-digit OTP"
            className="mb-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none transition focus:border-blue-600 disabled:bg-slate-100"
          />

          <Button
            type="submit"
            loading={loading}
            disabled={
            !sdkReady ||
            otp.length !== OTP_LENGTH ||
            !hasReqId
            }
          >
            Verify OTP
          </Button>
        </form>

        <div className="mt-5 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-slate-500">
              Resend OTP{" "}
              <span className="font-semibold text-blue-600">
                in {resendTimer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={!sdkReady || resending}
              className="text-sm font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : "Resend OTP"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
          disabled={loading || resending}
          className="mt-5 w-full text-center text-sm text-slate-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Change mobile number
        </button>
      </div>
    </AuthLayout>
  );
}

export default VerifyOtpPage;