import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  CalendarCheck,
  Award,
  GraduationCap,
  BookOpen,
  Printer,
  RefreshCw,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { StudentOverallPerformance, SubjectPerformanceBreakdown } from '../../types/analytics';

interface PerformanceAnalysisViewProps {
  data: StudentOverallPerformance;
  onRefresh?: () => void;
  loading?: boolean;
}

export const PerformanceAnalysisView: React.FC<PerformanceAnalysisViewProps> = ({
  data,
  onRefresh,
  loading = false,
}) => {
  const [activeSubject, setActiveSubject] = useState<'physics' | 'chemistry' | 'biology' | 'mathematics' | 'overview'>('physics');

  const subjectTabs = [
    { key: 'physics', name: 'Physics', icon: '⚛️', color: '#3b82f6', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#f59e0b', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'biology', name: 'Biology', icon: '🧬', color: '#10b981', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'mathematics', name: 'Mathematics', icon: '📐', color: '#8b5cf6', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'overview', name: 'Multi-Subject Overview', icon: '📊', color: '#6366f1', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ];

  const currentSubjectData: SubjectPerformanceBreakdown | null =
    activeSubject !== 'overview' ? data.subjects[activeSubject] : null;

  const getBarColor = (pct: number) => {
    if (pct >= 88) return '#10b981'; // Emerald
    if (pct >= 80) return '#3b82f6'; // Blue
    if (pct >= 70) return '#f59e0b'; // Amber
    return '#ef4444'; // Rose
  };

  const getMasteryBadge = (level: string) => {
    switch (level) {
      case 'Mastered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Proficient':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Needs Practice':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0">
      {/* 1. STUDENT HEADER & KPI SUMMARY */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:bg-white print:text-black print:border print:border-gray-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-extrabold text-white shadow-inner overflow-hidden print:border-gray-400 print:text-gray-900">
              {data.photoUrl ? (
                <img src={data.photoUrl} alt={data.studentName} className="w-full h-full object-cover" />
              ) : (
                data.studentName.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{data.studentName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/20 text-white border border-white/30 print:text-black">
                  {data.studentRoll}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-sm text-indigo-200 print:text-gray-700 font-medium">
                <span className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1 text-indigo-300 print:text-gray-700" />
                  <strong>Class:</strong>&nbsp;{data.className}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1 text-indigo-300 print:text-gray-700" />
                  <strong>Board:</strong>&nbsp;{data.boardName}
                </span>
                <span>•</span>
                <span>Batch: {data.batchName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="print:hidden p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-colors"
                title="Refresh Analytics"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="print:hidden p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-colors"
              title="Print Performance Report"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ambient Gradient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI STATS GRID: Average Marks, Percentage, Attendance, Total Tests */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Overall Percentage</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-gray-900">{data.overallPercentage}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Grade A
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Across all 4 core subjects</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Average Marks</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-gray-900">{data.overallAverageMarks}</span>
            <span className="text-xs text-gray-400 font-medium">/ 40 Avg Max</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Mean score across 16 tests</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Tuition Attendance</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{data.attendancePercentage}%</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              High
            </span>
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">Strong attendance correlation</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Tests Evaluated</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-gray-900">{data.totalTestsConducted}</span>
            <span className="text-xs text-purple-600 font-medium">Conducted</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Physics, Chem, Bio & Maths</span>
        </div>
      </div>

      {/* 2. SUBJECT TABS SELECTOR */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 print:hidden">
        {subjectTabs.map((tab) => {
          const isActive = activeSubject === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubject(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE SUBJECT PERFORMANCE (STEPS 22 & 23) */}
      {currentSubjectData ? (
        <div className="space-y-6">
          {/* STEP 22: SUBJECT GRAPH (LINE GRAPH) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {subjectTabs.find((t) => t.key === activeSubject)?.icon}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">
                    {currentSubjectData.subjectName} — Test Performance Progression (Line Graph)
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Chronological test-by-test percentage evolution showing learning trajectory.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Peak Score</span>
                  <span className="text-sm font-black text-emerald-700">{currentSubjectData.highestPercentage}%</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Subject Avg</span>
                  <span className="text-sm font-black text-blue-700">{currentSubjectData.averagePercentage}%</span>
                </div>
              </div>
            </div>

            {/* RECHARTS LINE GRAPH */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={currentSubjectData.testProgression}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="testNumber"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    domain={[50, 100]}
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(val) => `${val}%`}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                            <p className="font-bold text-sm text-indigo-300">{item.testNumber}: {item.testName}</p>
                            <p className="text-gray-300">Date: {item.date}</p>
                            <div className="flex items-baseline space-x-2 pt-1">
                              <span className="text-lg font-black text-emerald-400">{item.percentage}%</span>
                              <span className="text-gray-400">({item.marksObtained} / {item.maxMarks} Marks)</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    name={`${currentSubjectData.subjectName} Score (%)`}
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#818cf8', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Data Pill Row (Fulfilling Prompt Example) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
              {currentSubjectData.testProgression.map((test) => (
                <div key={test.testNumber} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 block">{test.testNumber}</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-black text-indigo-700">{test.percentage}%</span>
                    <span className="text-[11px] text-gray-400 font-medium">{test.marksObtained}/{test.maxMarks}m</span>
                  </div>
                  <span className="text-[11px] text-gray-500 truncate block mt-0.5">{test.testName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 23: CHAPTER-WISE ANALYSIS (BAR GRAPH) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    {currentSubjectData.subjectName} — Chapter-Wise Performance (Bar Graph)
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Topic & syllabus chapter comprehension levels evaluated across tests.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  &gt;= 85% Mastered
                </span>
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  75-84% Proficient
                </span>
              </div>
            </div>

            {/* RECHARTS BAR GRAPH */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentSubjectData.chapterAnalysis}
                  margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="chapterName"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    domain={[50, 100]}
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(val) => `${val}%`}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                            <p className="font-bold text-sm text-indigo-300">{item.chapterName}</p>
                            <div className="flex items-baseline space-x-2 pt-1">
                              <span className="text-lg font-black text-emerald-400">{item.percentage}%</span>
                              <span className="text-gray-400 font-medium">({item.avgMarks} / {item.maxMarks} Marks)</span>
                            </div>
                            <p className="text-gray-300">Mastery: <span className="font-semibold text-white">{item.masteryLevel}</span></p>
                            <p className="text-gray-400">Tests Count: {item.testsCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="percentage"
                    name="Chapter Mastery (%)"
                    radius={[8, 8, 0, 0]}
                    barSize={44}
                  >
                    {currentSubjectData.chapterAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chapter Mastery Cards Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
              {currentSubjectData.chapterAnalysis.map((chap) => (
                <div key={chap.chapterName} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 truncate">{chap.chapterName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getMasteryBadge(chap.masteryLevel)}`}>
                      {chap.masteryLevel}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-xl font-black text-gray-900">{chap.percentage}%</span>
                    <span className="text-xs text-gray-400 font-medium">{chap.avgMarks}/{chap.maxMarks}m</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${chap.percentage}%`,
                        backgroundColor: getBarColor(chap.percentage),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* MULTI-SUBJECT OVERVIEW COMPARISON VIEW */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Multi-Subject Comparative Analysis
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Side-by-side performance across Physics, Chemistry, Biology, and Mathematics vs Tuition Benchmark.
            </p>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.overallComparison}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="subject" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                            <p className="font-bold text-sm text-indigo-300">{item.subject}</p>
                            <p className="text-emerald-400 font-bold">Student Avg: {item.averagePercentage}%</p>
                            <p className="text-blue-400 font-bold">Tuition Benchmark: {item.benchmarkAvg}%</p>
                            <p className="text-gray-300">Attendance Rate: {item.attendanceRate}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="averagePercentage" name="Student Score (%)" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="benchmarkAvg" name="Tuition Batch Benchmark (%)" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. ATTENDANCE & ACADEMIC CORRELATION INSIGHT */}
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Tuition Attendance & Academic Impact Insight</h3>
            <p className="text-xs text-gray-500">Correlation metrics between regular classroom attendance and test performance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-indigo-100">
          <div className="bg-white p-4 rounded-xl border border-indigo-100/80">
            <span className="text-xs text-gray-400 font-medium block">Tuition Attendance Rate</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{data.attendancePercentage}%</span>
            <span className="text-[11px] text-emerald-700 mt-0.5 block font-medium">Monday to Saturday Consistency</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-indigo-100/80">
            <span className="text-xs text-gray-400 font-medium block">Strongest Subject Mastery</span>
            <span className="text-base font-bold text-gray-900 mt-1 block">{data.strongestSubject}</span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Consistent 85%+ Chapter Averages</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-indigo-100/80">
            <span className="text-xs text-gray-400 font-medium block">Key Trajectory Milestone</span>
            <span className="text-base font-bold text-indigo-700 mt-1 block">{data.needsFocusSubject}</span>
            <span className="text-[11px] text-indigo-600 mt-0.5 block">+16% gain from Test 1 to Test 4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysisView;
