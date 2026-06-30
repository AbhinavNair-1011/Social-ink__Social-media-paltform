function AuthCard({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
}

export default AuthCard;