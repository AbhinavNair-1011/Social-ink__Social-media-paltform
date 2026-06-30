function Input({
  label,
  id,
  type = "text",
  register,
  error,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-medium"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        {...register}
        {...props}
        className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Input;