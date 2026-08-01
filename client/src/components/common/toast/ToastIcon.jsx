import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

const iconClasses = "w-6 h-6 flex-shrink-0";

const ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return (
        <CheckCircle2
          className={`${iconClasses} text-emerald-500`}
        />
      );

    case "error":
      return (
        <XCircle
          className={`${iconClasses} text-red-500`}
        />
      );

    case "warning":
      return (
        <AlertTriangle
          className={`${iconClasses} text-orange-500`}
        />
      );

    case "info":
      return (
        <Info
          className={`${iconClasses} text-blue-500`}
        />
      );

    case "loading":
      return (
        <Loader2
          className={`${iconClasses} animate-spin text-indigo-500`}
        />
      );

    default:
      return null;
  }
};

export default ToastIcon;