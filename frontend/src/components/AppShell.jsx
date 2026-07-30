import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";
import GlobalSearch from "./GlobalSearch.jsx";
import Avatar from "./Avatar.jsx";

const AppShell = ({ children, workspaces = [], activeWorkspaceId, onCreateWorkspace }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("syncboard_theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("syncboard_theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);

  return (
    <div className="min-h-screen flex bg-paper dark:bg-bg-dark">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-slate-faint dark:border-white/10 flex flex-col hidden md:flex">
        <div className="px-4 py-4 border-b border-slate-faint dark:border-white/10">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sync flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-display font-semibold text-lg">SyncBoard</span>
          </button>
        </div>

        <div className="px-3 py-3 border-b border-slate-faint dark:border-white/10">
          <p className="px-2 text-[11px] font-medium text-slate uppercase tracking-wide mb-2">Workspaces</p>
          <div className="space-y-0.5 max-h-40 overflow-y-auto">
            {workspaces.map((w) => (
              <button
                key={w._id}
                onClick={() => navigate(`/workspaces/${w._id}`)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-left transition-colors ${
                  w._id === activeWorkspaceId
                    ? "bg-sync/10 text-sync font-medium"
                    : "hover:bg-slate-faint dark:hover:bg-white/5"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: w.color }}
                />
                <span className="truncate">{w.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onCreateWorkspace}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-slate hover:bg-slate-faint dark:hover:bg-white/5 mt-1"
          >
            <Plus size={14} /> New workspace
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                isActive ? "bg-sync/10 text-sync font-medium" : "hover:bg-slate-faint dark:hover:bg-white/5"
              }`
            }
          >
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                isActive ? "bg-sync/10 text-sync font-medium" : "hover:bg-slate-faint dark:hover:bg-white/5"
              }`
            }
          >
            <Settings size={16} /> Settings
          </NavLink>
        </nav>

        <div className="px-3 py-3 border-t border-slate-faint dark:border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-coral hover:bg-coral/10 transition-colors"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="h-14 border-b border-slate-faint dark:border-white/10 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="text-sm text-slate truncate">
            {activeWorkspace ? activeWorkspace.name : "Dashboard"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-faint dark:border-white/10 text-sm text-slate hover:bg-slate-faint dark:hover:bg-white/5 transition-colors"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[10px] border border-slate-faint dark:border-white/10 rounded px-1">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setDark((d) => !d)}
              className="p-2 rounded-lg hover:bg-slate-faint dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <NotificationBell />

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-faint dark:hover:bg-white/10 transition-colors"
              >
                <Avatar name={user?.name} size={28} />
                <ChevronDown size={14} className="text-slate hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface-dark rounded-xl shadow-pop border border-slate-faint dark:border-white/10 py-1 z-40">
                  <div className="px-3 py-2 border-b border-slate-faint dark:border-white/10">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-slate truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-paper dark:hover:bg-white/5"
                  >
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-coral hover:bg-coral/10"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </div>
  );
};

export default AppShell;
