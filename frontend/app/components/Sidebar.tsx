import { NavLink, Link } from "react-router";
import { LayoutDashboard, ShoppingCart, TrendingUp, History, User, Users, Settings, Info } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { getMe } from "../lib/api";

export function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getMe().then(res => {
      if (res.data.role === "Admin") setIsAdmin(true);
    }).catch(() => {});
  }, []);

  const mainNavigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "Sell Oil", href: "/dashboard/sell", icon: TrendingUp },
    { name: "Buy Oil", href: "/dashboard/buy", icon: ShoppingCart },
    { name: "My Transactions", href: "/dashboard/transactions", icon: History },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Pusat Informasi", href: "/dashboard/info", icon: Info },
    { name: "Contact Support", href: "/dashboard/contact", icon: Users },
  ];

  const adminNavigation = [
    { name: "Admin Panel", href: "/dashboard/admin", icon: Settings, end: true },
    { name: "All Transactions", href: "/dashboard/admin/transactions", icon: Users },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-100 bg-white">
      {/* Logo Area */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary-600 transition-transform hover:scale-105">
          <div>UC<span className="text-secondary-500">OB</span></div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main Menu
          </div>
          {mainNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Administration
              </div>
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors mt-1",
                      isActive
                        ? "bg-secondary-50 text-secondary-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          isActive ? "text-secondary-600" : "text-gray-400 group-hover:text-gray-500"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
