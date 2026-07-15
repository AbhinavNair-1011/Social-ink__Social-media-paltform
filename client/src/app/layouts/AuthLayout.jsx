import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
 <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
  <section className="relative hidden overflow-hidden lg:flex flex-col justify-center px-20 text-white">
    <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

    <div className="relative z-10 max-w-xl">
      <p className="mb-5 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-300">
        Welcome to Social Ink
      </p>

      <h1 className="text-7xl font-black leading-none tracking-tight">
        Social
        <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          Ink
        </span>
      </h1>

      <p className="mt-8 text-xl leading-9 text-slate-300">
        Connect, share your stories, discover communities, and chat with
        friends—all in one modern social platform.
      </p>

      <div className="mt-14 grid grid-cols-2 gap-6 text-slate-300">
        <div className="rounded-2xl border border-white/10  p-5 backdrop-blur">
        
          <h3 className="mt-3 font-semibold">
            Connect
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Follow friends and discover new people.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10  p-5 backdrop-blur">
          <h3 className="mt-3 font-semibold">
            Chat
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Real-time conversations with your community.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10  p-5 backdrop-blur">
          <h3 className="mt-3 font-semibold">
            Share
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Upload photos and express yourself.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-5 backdrop-blur">
          <h3 className="mt-3 font-semibold">
            Secure
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Email verification, 2FA and secure authentication.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section className="flex items-center justify-center bg-gradient-to-b from-slate-300 to-slate-400  p-8">
    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-slate-100 p-10 shadow-2xl shadow-slate-200/60">
      <Outlet />
    </div>
  </section>
</div>
  );
}

export default AuthLayout;
