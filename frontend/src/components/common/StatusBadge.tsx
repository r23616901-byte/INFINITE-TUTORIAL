import React from 'react';

export type StatusType =
  | 'present'
  | 'absent'
  | 'late'
  | 'leave'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'completed'
  | 'in-progress'
  | 'info'
  | 'danger';

export interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  dot = true,
  className = '',
}) => {
  const normalized = (status || '').toLowerCase().trim();

  // Status mapping
  let variant: 'green' | 'red' | 'amber' | 'blue' | 'gray' = 'gray';
  let displayLabel = label || status;

  if (['present', 'approved', 'active', 'completed', 'verified', 'passed'].includes(normalized)) {
    variant = 'green';
  } else if (['absent', 'rejected', 'failed', 'danger', 'suspended', 'cancelled'].includes(normalized)) {
    variant = 'red';
  } else if (['pending', 'review', 'in-progress', 'upcoming', 'due', 'warning'].includes(normalized)) {
    variant = 'amber';
  } else if (['info', 'new', 'scheduled', 'assigned'].includes(normalized)) {
    variant = 'blue';
  } else {
    variant = 'gray';
  }

  const variantStyles = {
    green: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    red: {
      badge: 'bg-red-50 text-red-800 border-red-200',
      dot: 'bg-red-500',
    },
    amber: {
      badge: 'bg-amber-50 text-amber-900 border-amber-200',
      dot: 'bg-amber-500',
    },
    blue: {
      badge: 'bg-blue-50 text-blue-800 border-blue-200',
      dot: 'bg-blue-500',
    },
    gray: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
  }[variant];

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border tracking-wide uppercase ${variantStyles.badge} ${sizeStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variantStyles.dot} flex-shrink-0`} />}
      <span>{displayLabel}</span>
    </span>
  );
};
