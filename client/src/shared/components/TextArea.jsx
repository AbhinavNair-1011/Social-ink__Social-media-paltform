function Textarea({
  label,
  id,
  register,
  error,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>

      <textarea
        id={id}
        {...register}
        {...props}
        className="rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Textarea;