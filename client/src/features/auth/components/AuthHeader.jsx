function AuthHeader({
  title,
  subtitle,
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="text-sm leading-6 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

export default AuthHeader;