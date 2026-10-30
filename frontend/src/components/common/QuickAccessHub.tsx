import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, LayoutGrid, Rows3, type LucideIcon } from 'lucide-react';

export interface QuickAccessItem {
  id: string;
  title: string;
  description?: string;
  route?: string;
  action?: () => void;
  icon: LucideIcon;
  iconStyle: string;
  badge?: string;
}

export interface QuickAccessCategory {
  title: string;
  items: QuickAccessItem[];
}

export interface QuickAccessHubProps {
  sectionTitle: string;
  sectionSubtitle: string;
  categories: QuickAccessCategory[];
  defaultCompact?: boolean;
}

export const QuickAccessHub: React.FC<QuickAccessHubProps> = ({
  sectionTitle,
  sectionSubtitle,
  categories,
  defaultCompact = true,
}) => {
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(defaultCompact);

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F2] p-4 sm:p-5 shadow-xs space-y-4 sm:space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4FA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F4D] tracking-tight">
              {sectionTitle}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
              {totalItems} Modules
            </span>
          </div>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            {sectionSubtitle}
          </p>
        </div>

        {/* View Layout Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setIsCompact(true)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isCompact
                  ? 'bg-white text-[#155EEF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compact mini cards (space-saving)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Compact</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCompact(false)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isCompact
                  ? 'bg-white text-[#155EEF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Detailed cards with descriptions"
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span>Detailed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-4">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {category.title}
              </h3>
              <div className="flex-1 h-px bg-[#F0F4FA]" />
              <span className="text-[10px] font-semibold text-slate-400">
                {category.items.length}
              </span>
            </div>

            {/* Compact Grid View (Little card with icon & title below it, minimal space) */}
            {isCompact ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.route) {
                          navigate(item.route);
                        } else if (item.action) {
                          item.action();
                        }
                      }}
                      aria-label={`Open ${item.title}`}
                      className="group relative p-3 rounded-xl bg-white border border-[#DCE5F2] hover:border-[#155EEF] hover:bg-[#F8FAFD] hover:shadow-xs hover:-translate-y-0.5 transition-all duration-150 cursor-pointer flex flex-col items-center justify-center text-center min-h-[90px]"
                    >
                      {item.badge && (
                        <span className="absolute top-1.5 right-1.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                          {item.badge}
                        </span>
                      )}

                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-150 group-hover:scale-105 mb-1.5 ${item.iconStyle}`}
                      >
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>

                      <span className="font-bold text-[#0B1F4D] text-xs sm:text-[12.5px] group-hover:text-[#155EEF] transition-colors leading-tight line-clamp-1">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Detailed Grid View */
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.route) {
                          navigate(item.route);
                        } else if (item.action) {
                          item.action();
                        }
                      }}
                      aria-label={`Open ${item.title}`}
                      className="group relative text-left p-3.5 rounded-xl bg-white border border-[#DCE5F2] hover:border-[#155EEF] hover:bg-[#F8FAFD] hover:shadow-xs hover:-translate-y-0.5 transition-all duration-150 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-150 group-hover:scale-105 ${item.iconStyle}`}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                              {item.badge}
                            </span>
                          )}
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[#8A9BB0] group-hover:text-[#155EEF] group-hover:bg-[#EEF4FF] transition-all">
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <h4 className="font-bold text-[#0B1F4D] text-xs sm:text-sm group-hover:text-[#155EEF] transition-colors line-clamp-1 leading-snug">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-[11px] text-[#5B6B82] mt-0.5 line-clamp-1 leading-normal">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
