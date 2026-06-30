function EmptyState({
  title,
  description,
}) {
  return (
    <div className="rounded-2xl bg-white p-10 text-center shadow">
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-3 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;