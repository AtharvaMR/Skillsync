"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings as SettingsIcon, Menu, UserCircle } from "lucide-react";
import type { User, UserRole } from "@/types";

interface TopbarProps {
  user: User;
  onOpenMobile?: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  student: "Learner",
  trainer: "Trainer / Assessor",
  institute: "Institution",
  employer: "Employer",
  government: "Administrator",
  analyst: "Analyst",
};

export function Topbar({ user, onOpenMobile }: TopbarProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            aria-label="Open navigation"
            className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800 truncate">
            {user.organisationName || "SkillSync Workspace"}
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            {ROLE_LABELS[user.role]} Portal
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          {ROLE_LABELS[user.role]}
        </span>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {initials || "U"}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <div className="py-1">
                {user.role === "student" && (
                  <Link
                    href="/dashboard/portfolio"
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserCircle size={16} /> My Skill Portfolio
                  </Link>
                )}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <SettingsIcon size={16} /> Settings
                </Link>
              </div>
              <div className="py-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 disabled:opacity-60"
                >
                  <LogOut size={16} /> {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
