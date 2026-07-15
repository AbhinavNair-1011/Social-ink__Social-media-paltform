function Input({
  label,
  id,
  type = "text",
  register,
  error,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        {...register}
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all

        ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        }`}
      />

      {error && (
        <p className="text-sm font-medium text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Input;