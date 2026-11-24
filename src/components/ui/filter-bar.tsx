"use client";

import React from "react";
import { Filter } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, values, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
      <div className="flex items-center gap-2 px-3 text-slate-500 border-r border-slate-200">
        <Filter size={16} />
        <span className="text-sm font-medium">Filters</span>
      </div>
      
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <select
            value={values[filter.key] || ""}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="text-sm border border-slate-300 text-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[140px]"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
