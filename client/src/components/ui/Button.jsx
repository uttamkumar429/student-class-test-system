function Button({
  children,
  type = "button",
  loading = false,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;