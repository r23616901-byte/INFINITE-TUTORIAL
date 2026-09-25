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
  badgeVariant?: 'blue' | 'emerald' | 'amber' | 'cyan' | 'navy' | 'slate' | 'indigo' | 'purple';
  accentBorder?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]',
  trend,
  badge,
  badgeVariant = 'blue',
  accentBorder = false,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return <SkeletonCard className={className} />;
  }

  const badgeStyles = {
    blue: 'bg-[#EEF4FF] text-[#155EEF] border-[#DCE5F2]',
    cyan: 'bg-[#E0F8FF] text-[#008BBF] border-[#BAE6FD]',
    amber: 'bg-[#FFF4E5] text-[#D97706] border-[#FDE68A]',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    navy: 'bg-[#0B1F4D] text-white border-transparent',
    indigo: 'bg-[#EEF4FF] text-[#155EEF] border-[#DCE5F2]',
    purple: 'bg-[#EEF4FF] text-[#155EEF] border-[#DCE5F2]',
    slate: 'bg-[#F5F8FC] text-[#5B6B82] border-[#DCE5F2]',
  }[badgeVariant];

  const trendStyles = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-[#5B6B82]',
  }[trend?.type || 'neutral'];

  return (
    <div
      className={`bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md transition-all duration-200 relative overflow-hidden group ${
        accentBorder ? 'border-t-4 border-t-[#155EEF]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-[#5B6B82] uppercase tracking-wider truncate">
          {title}
        </p>
        {badge && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${badgeStyles}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] tracking-tight leading-none group-hover:text-[#155EEF] transition-colors">
          {value}
        </h3>
        {icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs ${iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 pt-3 border-t border-[#F0F4FA] flex items-center justify-between text-xs">
          {subtitle && <span className="text-[#5B6B82] truncate font-normal">{subtitle}</span>}
          {trend && (
            <span className={`font-semibold flex items-center gap-1 ml-auto text-[11px] ${trendStyles}`}>
              {trend.icon}
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
