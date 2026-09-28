import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

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
}

export const QuickAccessHub: React.FC<QuickAccessHubProps> = ({
  sectionTitle,
  sectionSubtitle,
  categories,
}) => {
  const navigate = useNavigate();

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 sm:p-6 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4FA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#0B1F4D] tracking-tight">
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
        <span className="text-[11px] font-medium text-[#8A9BB0] hidden sm:inline-block">
          Click any module card to navigate
        </span>
      </div>

      {/* Category Sections */}
      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6B82]">
                {category.title}
              </h3>
              <div className="flex-1 h-px bg-[#F0F4FA]" />
              <span className="text-[10px] font-semibold text-[#8A9BB0]">
                {category.items.length}
              </span>
            </div>

            {/* Responsive Grid: Desktop (4 cols), Tablet (3 cols), Mobile (2 cols), Extra Small (1 col) */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
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
                    className="group relative text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#DCE5F2] hover:border-[#155EEF] hover:bg-[#F8FAFD] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:ring-offset-2 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between w-full">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${item.iconStyle}`}
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

                    <div className="mt-3">
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
          </div>
        ))}
      </div>
    </div>
  );
};
