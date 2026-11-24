"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onSearch: (value: string) => void;
}

export function SearchBar({ placeholder = "Search...", value, onSearch }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        placeholder={placeholder}
      />
    </div>
  );
}
