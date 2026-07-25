function Button({
  children,
  type = "button",
  loading = false,
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;