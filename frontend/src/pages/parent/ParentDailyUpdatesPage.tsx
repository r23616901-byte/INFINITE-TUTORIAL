import React, { useState, useEffect } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  DailyUpdateDto,
  fetchDailyUpdates,
} from '../../services/dailyUpdateService';
import {
  Bell,
  Calendar,
  Layers,
  BookOpen,
  FileText,
  ClipboardList,
  Info,
  Sparkles,
} from 'lucide-react';

export const ParentDailyUpdatesPage: React.FC = () => {
  const [updates, setUpdates] = useState<DailyUpdateDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  const loadUpdates = async () => {
    setIsLoading(true);
    try {
      // Default to 10-A Morning for sample parent student
      const data = await fetchDailyUpdates({
        batchId: 'batch-10a-morning',
        date: selectedDate || undefined,
      });
      setUpdates(data);
    } catch {
      // Handled in fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner flex-shrink-0">
            <Bell className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Daily Class Updates & Homework
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                DAILY LOG
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              Enrolled Student: <strong className="text-white">Rahul Kumar</strong> &bull; Class 10 | CBSE &bull; Batch 10-A Morning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-indigo-200 font-semibold">Filter Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white focus:outline-hidden focus:bg-white/20"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-indigo-200 hover:text-white underline text-xs ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Daily Updates Feed */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonBlock height="h-32" />
            <SkeletonBlock height="h-32" />
          </div>
        ) : updates.length === 0 ? (
          <EmptyState
            title="No Updates for Selected Date"
            description="No tuition daily updates were published for this date. Check back after today's sessions conclude."
            actionText="View Latest Updates"
            onAction={() => setSelectedDate('')}
          />
        ) : (
          updates.map((update, idx) => (
            <div
              key={update.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 relative overflow-hidden"
            >
              {/* Top Accent Strip for latest update */}
              {idx === 0 && !selectedDate && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500" />
              )}

              {/* Title & Date Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{update.title}</h2>
                    <span className="text-[11px] text-slate-400">
                      Published by {update.postedByName} ({update.postedByRole})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {update.date}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-400" />
                    {update.batchName}
                  </span>
                </div>
              </div>

              {/* Subject Breakdown (Prompt Example: Physics, Chemistry, Maths) */}
              {update.subjectUpdates && update.subjectUpdates.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Subject Progress Summary
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {update.subjectUpdates.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 hover:border-indigo-200 transition-colors"
                      >
                        <span className="font-bold text-indigo-700 text-xs uppercase tracking-wide">
                          {sub.subject}:
                        </span>
                        <p className="font-semibold text-slate-800 text-xs leading-relaxed">
                          {sub.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Today's Lesson & Topics Covered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1.5 text-xs">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Today's Lesson
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {update.todayLesson || 'N/A'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1.5 text-xs">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Topics Covered
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {update.topicsCovered || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Homework Highlight Container (Prompt: Complete questions 1–10.) */}
              <div className="p-4 rounded-xl bg-amber-50/90 border-2 border-amber-300/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-amber-950 text-xs uppercase tracking-wider">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                    Homework Task
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                    MANDATORY
                  </span>
                </div>
                <p className="font-black text-slate-900 text-base pl-6">
                  {update.homework}
                </p>
              </div>

              {/* Important Instructions (Step 19) */}
              {update.instructions && (
                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs flex items-start gap-3">
                  <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-950 text-xs block">
                      Teacher's Special Instructions:
                    </span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed font-medium">
                      {update.instructions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentDailyUpdatesPage;
