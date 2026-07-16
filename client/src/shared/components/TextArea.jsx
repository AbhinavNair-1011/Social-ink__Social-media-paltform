function Textarea({ label, id, register, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>

      <textarea
        id={id}
        {...register}
        {...props}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50    px-4
py-3
text-slate-800
placeholder:text-slate-400
outline-none
transition
focus:border-indigo-500
focus:bg-white
focus:ring-4
focus:ring-indigo-100
"
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export default Textarea;
