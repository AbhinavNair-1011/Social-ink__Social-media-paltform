import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "../../shared/components/Navbar";
import Sidebar from "../../shared/components/Sidebar";
import ScrollToTop from "../../shared/components/ScrollToTop";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <div className="mx-auto flex">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="min-w-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default AppLayout;
