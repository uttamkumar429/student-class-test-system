function ToastProgressBar({
  color = "bg-emerald-500",
}) {
  return (
    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full ${color} toast-progress`}
      />
    </div>
  );
}

export default ToastProgressBar;