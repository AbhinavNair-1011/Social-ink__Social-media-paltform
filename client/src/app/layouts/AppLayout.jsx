import { Outlet } from "react-router-dom";

import Navbar from "../../shared/components/Navbar";
import Sidebar from "../../shared/components/Sidebar";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto flex ">
        <Sidebar />

        <main className="min-h-screen flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;