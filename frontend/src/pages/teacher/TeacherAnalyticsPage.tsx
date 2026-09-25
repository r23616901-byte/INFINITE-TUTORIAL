import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  User,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { fetchStudents, StudentDto } from '../../services/studentService';
import analyticsService from '../../services/analyticsService';
import { StudentOverallPerformance } from '../../types/analytics';
import { PerformanceAnalysisView } from '../shared/PerformanceAnalysisView';

export const TeacherAnalyticsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-10025');
  const [data, setData] = useState<StudentOverallPerformance | null>(null);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await fetchStudents();
        setStudents(res.students || []);
        if (res.students && res.students.length > 0) {
          const defaultStu = res.students.find((s) => s.studentId === 'IT10025') || res.students[0];
          setSelectedStudentId(defaultStu.id || defaultStu.studentId);
        }
      } catch {
        setErrorMsg('Failed to load student list.');
      } finally {
        setLoadingStudents(false);
      }
    };
    loadStudents();
  }, []);

  const loadAnalytics = async () => {
    if (!selectedStudentId) return;
    try {
      setLoadingAnalytics(true);
      setErrorMsg('');
      const res = await analyticsService.getStudentAnalytics(selectedStudentId);
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load student performance analysis.');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      loadAnalytics();
    }
  }, [selectedStudentId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Student Performance & Chapter-Wise Analysis
              </h1>
              <p className="text-sm text-gray-500">
                Visual test-by-test progression line charts, chapter mastery bar graphs, and attendance metrics across all 4 subjects.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={loadingAnalytics}
          className="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loadingAnalytics ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 text-sm font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* STUDENT SELECTOR PANEL (Print hidden) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Select Student to View Graphs
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={loadingStudents}
                className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#155EEF] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {students.map((stu) => (
                  <option key={stu.id || stu.studentId} value={stu.id || stu.studentId}>
                    {stu.name} ({stu.studentId}) — {stu.className} • {stu.boardName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Quick Select Candidates
            </span>
            <div className="flex flex-wrap gap-2">
              {students.slice(0, 4).map((stu) => {
                const isSelected = selectedStudentId === stu.id || selectedStudentId === stu.studentId;
                return (
                  <button
                    key={stu.id || stu.studentId}
                    onClick={() => setSelectedStudentId(stu.id || stu.studentId)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#155EEF] text-white shadow-sm ring-2 ring-[#B2CCFF]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <User className="w-3 h-3 mr-1.5" />
                    {stu.name.split(' ')[0]} ({stu.studentId})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RENDER VIEW */}
      {loadingAnalytics ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#155EEF] animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">Compiling Graphical Analytics...</h3>
          <p className="text-xs text-gray-500 mt-1">Calculating test progressions and chapter mastery bar metrics.</p>
        </div>
      ) : data ? (
        <PerformanceAnalysisView data={data} onRefresh={loadAnalytics} loading={loadingAnalytics} />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">Analytics Data Not Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            No performance records were found for the selected student.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherAnalyticsPage;
