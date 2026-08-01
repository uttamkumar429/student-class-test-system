import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,

    style: {
      borderRadius: "10px",
      background: "#16a34a",
      color: "#fff",
      fontWeight: "500",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,

    style: {
      borderRadius: "10px",
      background: "#dc2626",
      color: "#fff",
      fontWeight: "500",
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};