import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%';
}

export function formatCurrency(value: number): string {
  return '₹' + formatNumber(value);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function getDemandColor(level: string): string {
  switch (level) {
    case 'high_demand': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'emerging': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'stable': return 'text-slate-600 bg-slate-50 border-slate-200';
    case 'declining': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'oversupplied': return 'text-rose-600 bg-rose-50 border-rose-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
}

export function getDemandLabel(level: string): string {
  switch (level) {
    case 'high_demand': return 'High Demand';
    case 'emerging': return 'Emerging';
    case 'stable': return 'Stable';
    case 'declining': return 'Declining';
    case 'oversupplied': return 'Oversupplied';
    default: return level;
  }
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-rose-600';
}

export function getHealthLevel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Attention';
  return 'Critical';
}

export function getHealthBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'bg-blue-50 border-blue-200';
  if (score >= 40) return 'bg-amber-50 border-amber-200';
  return 'bg-rose-50 border-rose-200';
}

export function getGapColor(classification: string): string {
  switch (classification) {
    case 'missing': return 'text-rose-600 bg-rose-50';
    case 'under_covered': return 'text-amber-600 bg-amber-50';
    case 'adequate': return 'text-emerald-600 bg-emerald-50';
    case 'over_covered': return 'text-blue-600 bg-blue-50';
    case 'obsolete': return 'text-slate-400 bg-slate-50';
    default: return 'text-slate-600 bg-slate-50';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'employed':
    case 'placed':
    case 'active':
    case 'connected':
    case 'completed':
    case 'validated':
      return 'text-emerald-600 bg-emerald-50';
    case 'self_employed':
    case 'apprenticeship':
    case 'imported':
      return 'text-blue-600 bg-blue-50';
    case 'seeking_employment':
    case 'pending':
    case 'running':
      return 'text-amber-600 bg-amber-50';
    case 'unemployed':
    case 'dropped_out':
    case 'error':
    case 'rejected':
    case 'failed':
    case 'disconnected':
      return 'text-rose-600 bg-rose-50';
    default:
      return 'text-slate-600 bg-slate-50';
  }
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up': return '↑';
    case 'down': return '↓';
    case 'stable': return '→';
  }
}

export function getTrendColor(trend: 'up' | 'down' | 'stable', positive: boolean = true): string {
  if (trend === 'stable') return 'text-slate-500';
  if (trend === 'up') return positive ? 'text-emerald-600' : 'text-rose-600';
  return positive ? 'text-rose-600' : 'text-emerald-600';
}
