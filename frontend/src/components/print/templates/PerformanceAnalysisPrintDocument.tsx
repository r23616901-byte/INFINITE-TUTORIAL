import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { StudentOverallPerformance, SubjectPerformanceBreakdown } from '../../../types/analytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface PerformanceAnalysisPrintDocumentProps {
  data: StudentOverallPerformance;
  activeSubjectKey?: 'physics' | 'chemistry' | 'biology' | 'mathematics' | 'overview';
  isForPreview?: boolean;
}

export const PerformanceAnalysisPrintDocument: React.FC<PerformanceAnalysisPrintDocumentProps> = ({
  data,
  activeSubjectKey = 'physics',
  isForPreview = false,
}) => {
  const currentSubjectData: SubjectPerformanceBreakdown | null =
    activeSubjectKey !== 'overview' && data.subjects[activeSubjectKey]
      ? data.subjects[activeSubjectKey]
      : data.subjects.physics || Object.values(data.subjects)[0];

  return (
    <PrintLayout
      documentTitle="STUDENT ACADEMIC PERFORMANCE & GRAPHIC ANALYSIS REPORT"
      documentSubtitle="Official Curriculum Mastery, Longitudinal Progression & Attendance Correlation"
      reportCategory="PERFORMANCE ANALYSIS REPORT"
      metadata={{
        studentName: data.studentName,
        studentId: data.studentRoll,
        className: data.className,
        boardName: data.boardName,
        batchName: data.batchName,
        subjectName: currentSubjectData ? currentSubjectData.subjectName : 'All Core Subjects',
        academicYear: 'AY 2024–2025',
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Academic Performance Analysis prepared by Infinite Tutorial Directorate. Based on longitudinal test records and verified milestones."
    >
      {/* 1. Executive Diagnostic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Overall Percentage</span>
          <span className="text-lg sm:text-xl font-black text-[#0A3622] mt-0.5 block">{data.overallPercentage}%</span>
          <span className="text-[8.5px] font-bold text-emerald-800">Distinction Grade</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Total Conducted Tests</span>
          <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">{data.totalTestsConducted}</span>
          <span className="text-[8.5px] font-medium text-slate-600">Across 4 Subjects</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Tuition Attendance Rate</span>
          <span className="text-lg sm:text-xl font-black text-[#0A3622] mt-0.5 block">{data.attendancePercentage}%</span>
          <span className="text-[8.5px] font-bold text-emerald-800">
            {data.attendancePercentage >= 75 ? 'Meets Board Criteria' : 'Requires Attention'}
          </span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Curriculum Syllabus Mastery</span>
          <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">
            {currentSubjectData ? currentSubjectData.averagePercentage : 82}%
          </span>
          <span className="text-[8.5px] font-semibold text-slate-600">
            {currentSubjectData ? currentSubjectData.subjectName : 'Composite'}
          </span>
        </div>
      </div>

      {/* 2. Longitudinal Test Progression Line Chart */}
      {currentSubjectData && currentSubjectData.testProgression && currentSubjectData.testProgression.length > 0 && (
        <div className="p-3.5 bg-white border border-slate-300 rounded-lg print-break-inside-avoid">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
                {currentSubjectData.subjectName} — Longitudinal Test Progression (Trend Graph)
              </h4>
              <p className="text-[9.5px] text-slate-500">
                Examination-by-examination percentage progression compared across unit and chapter tests.
              </p>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
              Avg: {currentSubjectData.averageMarks}%
            </span>
          </div>

          <div className="h-56 w-full print-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={currentSubjectData.testProgression}
                margin={{ top: 10, right: 25, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="testNumber" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}%`} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name={`${currentSubjectData.subjectName} (%)`}
                  stroke="#0A3622"
                  strokeWidth={2.5}
                  dot={{ fill: '#0A3622', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Test Progression Summary Table */}
          <div className="overflow-x-auto w-full mt-2">
            <table className="w-full text-left text-[9px] border border-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  {currentSubjectData.testProgression.map((t) => (
                    <th key={t.testNumber} className="py-1 px-1.5 text-center border border-slate-200 whitespace-nowrap">
                      {t.testNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {currentSubjectData.testProgression.map((t) => (
                    <td key={t.testNumber} className="py-1 px-1.5 text-center font-bold text-[#0A3622] border border-slate-200 whitespace-nowrap">
                      {t.percentage}%
                      <span className="block text-[8px] text-slate-500 font-normal">
                        {t.marksObtained}/{t.maxMarks}m
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Chapter-Wise Comprehension Bar Chart */}
      {currentSubjectData && currentSubjectData.chapterAnalysis && currentSubjectData.chapterAnalysis.length > 0 && (
        <div className="p-3.5 bg-white border border-slate-300 rounded-lg print-break-inside-avoid">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
                {currentSubjectData.subjectName} — Chapter-Wise Mastery &amp; Comprehension
              </h4>
              <p className="text-[9.5px] text-slate-500">
                Topic &amp; chapter syllabus comprehension evaluated across chapter-wise assessments.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                &ge; 85% Mastered
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-300 font-bold">
                75-84% Proficient
              </span>
            </div>
          </div>

          <div className="h-56 w-full print-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentSubjectData.chapterAnalysis}
                margin={{ top: 10, right: 25, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="chapterName"
                  stroke="#64748b"
                  fontSize={9.5}
                  tickLine={false}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}%`} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar
                  dataKey="percentage"
                  name="Mastery Score (%)"
                  fill="#0A3622"
                  radius={[3, 3, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chapter Table */}
          <div className="overflow-x-auto w-full mt-2">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr>
                  <th className="py-1 px-2.5 whitespace-nowrap">Chapter / Topic</th>
                  <th className="py-1 px-2.5 text-center whitespace-nowrap">Score (%)</th>
                  <th className="py-1 px-2.5 text-center whitespace-nowrap">Average Marks</th>
                  <th className="py-1 px-2.5 text-center whitespace-nowrap">Tests Taken</th>
                  <th className="py-1 px-2.5 text-center whitespace-nowrap">Comprehension Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentSubjectData.chapterAnalysis.map((ch) => (
                  <tr key={ch.chapterName} className="hover:bg-slate-50/50">
                    <td className="py-1 px-2.5 font-bold text-slate-900 whitespace-nowrap">{ch.chapterName}</td>
                    <td className="py-1 px-2.5 text-center font-bold text-[#0A3622]">{ch.percentage}%</td>
                    <td className="py-1 px-2.5 text-center text-slate-700 whitespace-nowrap">
                      {ch.avgMarks} / {ch.maxMarks}m
                    </td>
                    <td className="py-1 px-2.5 text-center text-slate-700">{ch.testsCount}</td>
                    <td className="py-1 px-2.5 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                          ch.masteryLevel === 'Mastered'
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                            : 'bg-blue-50 text-blue-900 border border-blue-300'
                        }`}
                      >
                        {ch.masteryLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Multi-Subject Academic Comparison Matrix */}
      <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg print-break-inside-avoid">
        <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide mb-1.5">
          Multi-Subject Comparative Matrix
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {Object.entries(data.subjects).map(([key, sub]) => (
            <div key={key} className="p-2 bg-white border border-slate-200 rounded">
              <span className="font-bold text-slate-800 text-[11px] block">{sub.subjectName}</span>
              <span className="text-lg font-black text-[#0A3622] block my-0.5">{sub.averagePercentage}%</span>
              <span className="text-[9px] text-slate-500 block">
                {sub.testProgression?.length || 0} Tests &bull; Peak: {sub.highestPercentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </PrintLayout>
  );
};
