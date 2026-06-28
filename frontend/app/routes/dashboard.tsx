import { Outlet, redirect, useLocation } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { getMe } from "../lib/api";
import { useState, useEffect } from "react";

export async function clientLoader() {
  try {
    await getMe();
    return null;
  } catch (error) {
    return redirect("/login");
  }
}

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50/30">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex w-64 flex-col bg-white animate-slide-right shadow-2xl">
            <Sidebar />
            <button
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
