import React from 'react';
import { SkeletonCard } from './LoadingSkeleton';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: {
    text: string;
    type?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
  };
  badge?: string;
  badgeVariant?: 'blue' | 'emerald' | 'indigo' | 'amber' | 'purple' | 'slate';
  isLoading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-blue-50 text-blue-600',
  trend,
  badge,
  badgeVariant = 'slate',
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return <SkeletonCard className={className} />;
  }

  const badgeStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  }[badgeVariant];

  const trendStyles = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-slate-500',
  }[trend?.type || 'neutral'];

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </p>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyles}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </h3>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
          {trend && (
            <span className={`font-medium flex items-center gap-1 ml-auto ${trendStyles}`}>
              {trend.icon}
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
