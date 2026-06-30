function PostLoader() {
  return (
    <div className="mb-6 animate-pulse rounded-2xl bg-white p-5 shadow">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>

        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-gray-300"></div>

          <div className="h-3 w-20 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="h-4 rounded bg-gray-200"></div>

        <div className="h-4 w-5/6 rounded bg-gray-200"></div>

        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
      </div>

      <div className="mt-6 flex gap-6">
        <div className="h-4 w-14 rounded bg-gray-300"></div>

        <div className="h-4 w-14 rounded bg-gray-300"></div>
      </div>
    </div>
  );
}

export default PostLoader;