"use client";

import React from "react";
import { Bell, UserCircle, LogOut, Settings as SettingsIcon } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { DataFreshnessBadge } from "@/components/ui/data-freshness-badge";
import type { User } from "@/types";

interface TopbarProps {
  user?: User;
}

export function Topbar({ user }: TopbarProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Mock user if none provided
  const currentUser = user || {
    id: "u1",
    name: "Jane Doe",
    email: "jane.doe@gov.in",
    role: "ADMIN",
    organization: "Ministry of Skill Development",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex-1 flex items-center gap-6">
        <SearchBar value="" onSearch={() => {}} placeholder="Search skills, districts, candidates..." />
        <DataFreshnessBadge lastUpdated={new Date().toISOString()} />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700 leading-tight">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{currentUser.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <span className="font-bold text-sm">
                {currentUser.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <UserCircle size={16} /> Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <SettingsIcon size={16} /> Settings
                </button>
              </div>
              <div className="py-1 border-t border-slate-100">
                <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
