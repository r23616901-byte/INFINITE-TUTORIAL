import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-slate-200 rounded-md animate-pulse ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

export const SkeletonBlock: React.FC<{ height?: string; className?: string }> = ({
  height = 'h-24',
  className = '',
}) => {
  return (
    <div className={`${height} w-full bg-slate-200/80 rounded-xl animate-pulse ${className}`} />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
        <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-36 bg-slate-200 rounded animate-pulse" />
    </div>
  );
};

export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 4 }) => {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
};
