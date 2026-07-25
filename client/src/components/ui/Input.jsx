function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
      />
    </div>
  );
}

export default Input;