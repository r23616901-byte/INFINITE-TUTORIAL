import React from 'react';
import { Eye, Loader2, Inbox } from 'lucide-react';

export type DashboardViewState = 'default' | 'loading' | 'empty';

export interface StateToggleBarProps {
  viewState: DashboardViewState;
  onViewStateChange: (state: DashboardViewState) => void;
  className?: string;
}

export const StateToggleBar: React.FC<StateToggleBarProps> = ({
  viewState,
  onViewStateChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-slate-700">UI Shell Preview State:</span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          (Toggle to inspect loading skeletons or empty states)
        </span>
      </div>

      <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
        <button
          type="button"
          onClick={() => onViewStateChange('default')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
            viewState === 'default'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Default</span>
        </button>
        <button
          type="button"
          onClick={() => onViewStateChange('loading')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
            viewState === 'loading'
              ? 'bg-white text-blue-600 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Loader2 className={`w-3.5 h-3.5 ${viewState === 'loading' ? 'animate-spin' : ''}`} />
          <span>Loading Skeleton</span>
        </button>
        <button
          type="button"
          onClick={() => onViewStateChange('empty')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
            viewState === 'empty'
              ? 'bg-white text-amber-700 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Empty State</span>
        </button>
      </div>
    </div>
  );
};
