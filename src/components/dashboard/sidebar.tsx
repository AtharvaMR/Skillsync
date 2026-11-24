"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Map, 
  Target,
  Settings,
  Menu,
  ChevronLeft,
  Building2,
  BrainCircuit,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["ADMIN", "GOVERNMENT", "TRAINING_PROVIDER", "EMPLOYER"] },
  { href: "/dashboard/skills", label: "Skill Intelligence", icon: BrainCircuit, roles: ["ADMIN", "GOVERNMENT", "TRAINING_PROVIDER"] },
  { href: "/dashboard/curriculum", label: "Curriculum Alignment", icon: GraduationCap, roles: ["ADMIN", "TRAINING_PROVIDER"] },
  { href: "/dashboard/placement", label: "Placement Tracking", icon: Target, roles: ["ADMIN", "GOVERNMENT", "TRAINING_PROVIDER"] },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users, roles: ["ADMIN", "TRAINING_PROVIDER", "EMPLOYER"] },
  { href: "/dashboard/employers", label: "Employers", icon: Building2, roles: ["ADMIN", "GOVERNMENT"] },
  { href: "/dashboard/districts", label: "District Analysis", icon: Map, roles: ["ADMIN", "GOVERNMENT"] },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb, roles: ["ADMIN", "GOVERNMENT"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const userRole = "ADMIN"; // Mock role for now

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <aside className={cn(
      "bg-slate-900 text-slate-300 h-screen flex flex-col transition-all duration-300 sticky top-0",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-white text-xl tracking-tight">
            <div className="bg-indigo-500 p-1 rounded-md text-white">
              <Briefcase size={20} />
            </div>
            SkillSync
          </div>
        )}
        {collapsed && (
          <div className="mx-auto bg-indigo-500 p-1.5 rounded-md text-white">
            <Briefcase size={20} />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors", collapsed && "hidden")}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {collapsed && (
          <button 
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-2 mb-4 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all group",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400" 
                  : "hover:bg-slate-800 hover:text-white text-slate-400",
                collapsed ? "justify-center" : "justify-start"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} className={cn(isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-slate-400 hover:bg-slate-800 hover:text-white group",
            collapsed ? "justify-center" : "justify-start"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={20} className="group-hover:text-white" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
