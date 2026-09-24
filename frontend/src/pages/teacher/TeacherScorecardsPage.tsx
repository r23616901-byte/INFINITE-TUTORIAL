import React, { useState, useEffect } from 'react';
import {
  Award,
  User,
  RefreshCw,
  AlertTriangle,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { fetchStudents, StudentDto } from '../../services/studentService';
import scorecardService from '../../services/scorecardService';
import { StudentScorecard } from '../../types/scorecard';
import { ScorecardViewer } from '../shared/ScorecardViewer';
import { EmptyState } from '../../components/common/EmptyState';

export const TeacherScorecardsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-10025');
  const [scorecard, setScorecard] = useState<StudentScorecard | null>(null);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [loadingScorecard, setLoadingScorecard] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 1. Fetch Students
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

  // 2. Fetch Scorecard when selectedStudentId changes
  const loadScorecard = async () => {
    if (!selectedStudentId) return;
    try {
      setLoadingScorecard(true);
      setErrorMsg('');
      const data = await scorecardService.getStudentScorecard(selectedStudentId);
      setScorecard(data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load student scorecard.');
    } finally {
      setLoadingScorecard(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      loadScorecard();
    }
  }, [selectedStudentId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Student Academic Scorecards
              </h1>
              <p className="text-sm text-gray-500">
                Official Infinite Tutorial 4-subject breakdown: Physics, Chemistry, Biology & Mathematics with verified papers and teacher evaluations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadScorecard}
            disabled={loadingScorecard}
            className="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingScorecard ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </button>
        </div>
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
              Select Student to View Scorecard
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={loadingStudents}
                className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
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
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
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

      {/* RENDER SCORECARD VIEWER */}
      {loadingScorecard ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">Compiling 4-Subject Scorecard...</h3>
          <p className="text-xs text-gray-500 mt-1">Aggregating Physics, Chemistry, Biology and Mathematics results.</p>
        </div>
      ) : scorecard ? (
        <ScorecardViewer scorecard={scorecard} onRefresh={loadScorecard} loading={loadingScorecard} />
      ) : (
        <EmptyState
          title="No scorecards generated yet"
          description="No scorecard records or marks evaluations have been compiled for this student yet. Enter assessment marks to generate this student's scorecard."
          icon={<Award className="w-8 h-8 text-amber-500 stroke-[1.5]" />}
          actionText="Refresh Record"
          onAction={loadScorecard}
        />
      )}
    </div>
  );
};

export default TeacherScorecardsPage;
