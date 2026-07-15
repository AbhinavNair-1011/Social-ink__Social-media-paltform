import { Outlet } from "react-router-dom";

import Navbar from "../../shared/components/Navbar";
import Sidebar from "../../shared/components/Sidebar";

function AppLayout() {
  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
  <Navbar />

  <div className="mx-auto flex max-w-[1700px]">
    <Sidebar />

    <main className="min-h-[calc(100vh-4rem)] flex-1 px-6 py-8 lg:px-10">
      <Outlet />
    </main>
  </div>
</div>
  );
}

export default AppLayout;