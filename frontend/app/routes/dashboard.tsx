import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/DashboardHeader";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50/30">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
