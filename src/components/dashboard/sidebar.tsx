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
  Lightbulb,
  FolderCheck,
  Compass,
  ClipboardCheck,
  RefreshCw,
  BarChart3,
  Database,
  Wrench,
  BookOpen,
  X,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["student", "trainer", "institute", "employer", "government", "analyst"] },
  // Learner workflow
  { href: "/dashboard/gap-analysis", label: "Skill Gap & AI", icon: BrainCircuit, roles: ["student"] },
  { href: "/dashboard/portfolio", label: "Skill Portfolio", icon: FolderCheck, roles: ["student"] },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: Briefcase, roles: ["student", "employer", "government", "institute"] },
  { href: "/dashboard/assistant", label: "Career Assistant", icon: MessageSquare, roles: ["student"] },
  { href: "/dashboard/ikigai", label: "Career Discovery", icon: Compass, roles: ["student"] },
  // Trainer / Institution workflow
  { href: "/dashboard/assessments", label: "Skill Validation", icon: ClipboardCheck, roles: ["trainer", "institute", "government"] },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen, roles: ["student", "trainer", "institute", "government", "analyst"] },
  { href: "/dashboard/curriculum", label: "Curriculum Align", icon: GraduationCap, roles: ["trainer", "institute", "government", "analyst"] },
  { href: "/dashboard/trainers", label: "Trainers", icon: Users, roles: ["institute", "trainer", "government"] },
  { href: "/dashboard/equipment", label: "Equipment", icon: Wrench, roles: ["institute", "trainer", "government"] },
  // Industry & Ecosystem Intelligence
  { href: "/dashboard/skills", label: "Skill Intelligence", icon: BarChart3, roles: ["trainer", "institute", "employer", "government", "analyst"] },
  { href: "/dashboard/labour-market", label: "Labour Market", icon: Target, roles: ["employer", "government", "analyst", "institute"] },
  { href: "/dashboard/employers", label: "Employers", icon: Building2, roles: ["employer", "institute", "government", "analyst"] },
  { href: "/dashboard/candidates", label: "Talent & Learners", icon: Users, roles: ["employer", "institute", "trainer", "government", "analyst"] },
  { href: "/dashboard/outcomes", label: "Outcomes", icon: Target, roles: ["institute", "government", "analyst"] },
  { href: "/dashboard/districts", label: "Districts", icon: Map, roles: ["government", "analyst", "institute"] },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb, roles: ["institute", "government", "analyst"] },
  { href: "/dashboard/kaizen", label: "Kaizen Loop", icon: RefreshCw, roles: ["institute", "trainer", "government", "analyst"] },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3, roles: ["government", "analyst", "institute"] },
  { href: "/dashboard/data-sources", label: "Data Sources", icon: Database, roles: ["government", "analyst"] },
];

interface SidebarProps {
  userRole: UserRole;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ userRole, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  const sidebarBody = (
    <aside
      className={cn(
        "bg-slate-900 text-slate-300 h-full flex flex-col transition-all duration-200",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-white text-lg tracking-tight">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div className="leading-tight">
              <span>SkillSync</span>
              <span className="block text-[10px] font-medium text-blue-400">Proof of Skill</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Collapse sidebar"
          className={cn(
            "hidden lg:inline-flex p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft size={18} />
        </button>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="w-full hidden lg:flex justify-center p-2 mb-3 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
        )}

        {filteredNav.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-blue-600/15 text-blue-400"
                  : "hover:bg-slate-800 hover:text-white text-slate-300",
                collapsed ? "justify-center" : "justify-start"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className={cn(isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white shrink-0")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-800 shrink-0">
        <Link
          href="/dashboard/settings"
          onClick={onCloseMobile}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-300 hover:bg-slate-800 hover:text-white group",
            pathname === "/dashboard/settings" && "bg-blue-600/15 text-blue-400",
            collapsed ? "justify-center" : "justify-start"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={18} className="text-slate-400 group-hover:text-white shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-full shrink-0">{sidebarBody}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60" onClick={onCloseMobile} />
          <div className="relative z-10 h-full">{sidebarBody}</div>
        </div>
      )}
    </>
  );
}
