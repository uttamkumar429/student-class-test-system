let msg91LoaderPromise = null;

const MSG91_SCRIPT_URL =
  "https://verify.msg91.com/otp-provider.js";

export const loadMsg91Widget = () => {
  if (window.sendOtp && window.verifyOtp) {
    return Promise.resolve();
  }

  if (msg91LoaderPromise) {
    return msg91LoaderPromise;
  }

  msg91LoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${MSG91_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", resolve, {
        once: true,
      });

      existingScript.addEventListener("error", reject, {
        once: true,
      });

      return;
    }

    const script = document.createElement("script");

    script.src = MSG91_SCRIPT_URL;
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(
        new Error("Unable to load MSG91 OTP service.")
      );

    document.head.appendChild(script);
  });

  return msg91LoaderPromise;
};

export const initializeMsg91Widget = ({
  widgetId,
  tokenAuth,
  success,
  failure,
}) => {
  if (!window.initSendOTP) {
    throw new Error(
      "MSG91 OTP SDK is not loaded."
    );
  }

  const configuration = {
    widgetId,
    tokenAuth,
    exposeMethods: true,
    captchaRenderId: "",
    success,
    failure,
  };

  window.initSendOTP(configuration);
};