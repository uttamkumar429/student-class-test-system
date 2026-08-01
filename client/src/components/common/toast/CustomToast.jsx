import ToastIcon from "./ToastIcon";
import ToastProgressBar from "./ToastProgressBar";

const colorMap = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  warning: "bg-orange-500",
  info: "bg-blue-500",
  loading: "bg-indigo-500",
};

function CustomToast({
  type,
  title,
  message,
}) {
  return (
    <div
      className="
      w-[380px]

      rounded-2xl

      border
      border-gray-200

      bg-white/95

      backdrop-blur-xl

      p-5

      shadow-2xl

      transition-all
      "
    >
      <div className="flex gap-4">

        <ToastIcon type={type} />

        <div className="flex-1">

          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {message}
          </p>

          {type !== "loading" && (
            <ToastProgressBar
              color={colorMap[type]}
            />
          )}

        </div>

      </div>
    </div>
  );
}

export default CustomToast;