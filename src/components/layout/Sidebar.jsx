import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, Truck, Warehouse, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AppLogo from "../AppLogo";

export default function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/warehouse", label: "Warehouse", icon: Warehouse },
    { path: "/sender", label: "Sender Portal", icon: Package },
    { path: "/receiver", label: "Receiver Portal", icon: Truck },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!user) return true;
    if (user.role === "admin") return true;
    if (user.role === "sender") return item.path !== "/receiver";
    if (user.role === "receiver") return item.path !== "/sender";
    return true;
  });

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--divider)] transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          width: isHovered
            ? "var(--sidebar-width)"
            : "var(--sidebar-collapsed)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-20 flex items-center justify-center border-b border-[var(--divider)] overflow-hidden">
          <div className="flex items-center gap-4 transition-all duration-300">
            <div className="flex-shrink-0 scale-110">
              <AppLogo
                iconClass="w-10 h-10"
                textClass={
                  isHovered
                    ? "block ml-3 text-2xl font-bold tracking-tight"
                    : "hidden"
                }
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-8">
                  <Icon
                    size={28}
                    className={`transition-transform duration-300 ${
                      active
                        ? "opacity-100"
                        : "opacity-80 group-hover:opacity-100 group-hover:scale-110"
                    }`}
                  />
                </div>

                <span
                  className={`whitespace-nowrap font-medium text-base transition-all duration-300 origin-left ${
                    isHovered
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>

                {!isHovered && (
                  <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl z-50 whitespace-nowrap border border-slate-700">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-3 border-t border-[var(--divider)]">
            <button
              onClick={logout}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group relative ${
                !isHovered ? "justify-center" : ""
              }`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-8">
                <LogOut size={26} />
              </div>
              <span
                className={`whitespace-nowrap font-medium text-base transition-all duration-300 origin-left ${
                  isHovered
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                }`}
              >
                Logout
              </span>
            </button>
            {isHovered && (
              <div className="mt-4 px-4 pb-2 animate-fadeIn">
                <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">
                  Signed in as
                </div>
                <div className="text-sm font-medium text-white truncate">
                  {user.email}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
  );
}
