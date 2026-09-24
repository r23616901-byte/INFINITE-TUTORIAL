import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { getTestsApi } from '../../services/testService';
import { TestItem } from '../../types/test';
import {
  FileText,
  Calendar,
  Clock,
  Award,
  Download,
  Eye,
  Search,
  BookOpen,
  X,
  FileCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const ParentTestsPage: React.FC = () => {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Preview Modal
  const [viewingPaper, setViewingPaper] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const loadTests = async () => {
    try {
      setIsLoading(true);
      const data = await getTestsApi();
      setTests(data);
    } catch (err) {
      console.error('Failed to load tests for parent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const filteredTests = tests.filter((t) => {
    if (subjectFilter !== 'ALL' && !t.subjectName.toLowerCase().includes(subjectFilter.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'ALL' && t.testType !== typeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !t.name.toLowerCase().includes(q) &&
        !t.chapter.toLowerCase().includes(q) &&
        !t.subjectName.toLowerCase().includes(q) &&
        !t.testId.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const now = new Date().toISOString().split('T')[0];
  const upcomingCount = tests.filter((t) => t.date >= now).length;
  const completedCount = tests.filter((t) => t.date < now).length;
  const papersAvailableCount = tests.filter((t) => !!t.testPaperUrl).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Tests & Question Papers
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                STUDENT & PARENT REPOSITORY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              View scheduled unit tests, chapter assessments, maximum marks, duration, and download official question papers.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={loadTests}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Schedule
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Upcoming Tests"
          value={upcomingCount.toString()}
          subtitle="Scheduled Assessments"
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          badge="Scheduled"
          badgeVariant="indigo"
          isLoading={isLoading}
        />
        <StatCard
          title="Past Examinations"
          value={completedCount.toString()}
          subtitle="Conducted Tests"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badge="Completed"
          badgeVariant="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="Papers Available"
          value={papersAvailableCount.toString()}
          subtitle="Downloadable Question Papers"
          icon={<Download className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
          badge="Ready"
          badgeVariant="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Filter and List */}
      <Card
        title="Test Schedule & Repository"
        subtitle={`Showing ${filteredTests.length} tests for your enrolled curriculum`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tests, chapters (e.g. Real Numbers, Electricity)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full sm:w-44 border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-700"
          >
            <option value="ALL">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-44 border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-700"
          >
            <option value="ALL">All Types</option>
            <option value="Unit Test">Unit Test</option>
            <option value="Chapter-wise Test">Chapter-wise Test</option>
            <option value="Test 1">Test 1</option>
            <option value="Monthly Test">Monthly Test</option>
            <option value="Revision Test">Revision Test</option>
          </select>
        </div>

        {/* Tests List */}
        {isLoading ? (
          <div className="space-y-4 py-4">
            <SkeletonBlock height="90px" />
            <SkeletonBlock height="90px" />
            <SkeletonBlock height="90px" />
          </div>
        ) : filteredTests.length === 0 ? (
          <EmptyState
            title="No scheduled tests found"
            description="There are currently no unit tests or assessments scheduled matching your selected subject or test type."
            icon={<BookOpen className="w-8 h-8 text-blue-500 stroke-[1.5]" />}
            compact
          />
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test) => {
              const isPast = test.date < now;
              const hasPaper = !!test.testPaperUrl;

              return (
                <div
                  key={test.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {test.name}
                        </span>
                        <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold">
                          {test.testId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {test.testType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPast
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isPast ? 'Conducted' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {test.className} &bull; {test.boardName} &bull; <strong>{test.subjectName}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasPaper && (
                        <>
                          <button
                            onClick={() =>
                              setViewingPaper({
                                url: test.testPaperUrl!,
                                name: test.testPaperName || test.name,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Paper
                          </button>
                          <a
                            href={test.testPaperUrl!}
                            download={test.testPaperName || 'test-paper.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Test Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Chapter Syllabus
                      </span>
                      <span className="font-bold text-slate-800">{test.chapter}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Test Date
                      </span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {test.date}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Maximum Marks
                      </span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        {test.maxMarks} Marks
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Duration
                      </span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {test.duration}
                      </span>
                    </div>
                  </div>

                  {test.instructions && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <span className="font-bold text-slate-500 block mb-0.5 text-[10px] uppercase tracking-wider">
                        Instructions:
                      </span>
                      <p className="whitespace-pre-line leading-relaxed italic">{test.instructions}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Viewing Paper Modal */}
      {viewingPaper && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-sm truncate max-w-md">{viewingPaper.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewingPaper.url}
                  download={viewingPaper.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  onClick={() => setViewingPaper(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 overflow-auto">
              {viewingPaper.url.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={viewingPaper.url}
                  title={viewingPaper.name}
                  className="w-full h-full rounded-xl bg-white border border-slate-200 shadow-xs"
                />
              ) : (
                <img
                  src={viewingPaper.url}
                  alt={viewingPaper.name}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-md border border-slate-200"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
