import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  fetchStudents,
  fetchAcademicLookups,
  StudentDto,
  AcademicLookups,
} from '../../services/studentService';
import {
  Users,
  Search,
  X,
  BookOpen,
  Layers,
  RotateCcw,
  CalendarCheck,
  Award,
  TrendingUp,
  FileCheck,
  UploadCloud,
  FileText,
  Lock,
} from 'lucide-react';

export const TeacherStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [lookups, setLookups] = useState<AcademicLookups | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // View Modal
  const [activeStudent, setActiveStudent] = useState<StudentDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [lookupData, studentsData] = await Promise.all([
        fetchAcademicLookups(),
        fetchStudents({
          search: search || undefined,
          batchId: selectedBatch || undefined,
          classId: selectedClass || undefined,
        }),
      ]);

      setLookups(lookupData);
      setStudents(studentsData.students);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedBatch, selectedClass]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Assigned Students Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
              FACULTY DESK
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Search, filter, view academic profiles, evaluate papers, and track student attendance and performance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/teacher/test-papers')}
            leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
          >
            Upload Test Paper
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/teacher/marks-entry')}
            leftIcon={<Award className="w-3.5 h-3.5" />}
          >
            Enter Marks
          </Button>
        </div>
      </div>

      {/* Mandatory Step 29: Protected Identity Information Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-amber-950 shadow-xs">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-amber-900 text-sm">Protected Student Profile Fields (Read-Only for Faculty)</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            As a faculty teacher, you can view student profiles, attendance, marks, scorecards, and performance graphs, upload answer sheets, and enter/edit marks.
            However, <strong>you cannot change</strong>:
            <span className="font-semibold text-amber-900 ml-1">
              Student Name, DOB, Parent Details, School, Board, Class, Batch, or Student Photo.
            </span>
            &nbsp;(Any adjustments must be submitted to the School Administrator).
          </p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Students"
          value={students.length}
          subtitle="Enrolled in your batches"
          icon={<Users className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF]"
        />
        <StatCard
          title="Active Batches"
          value={lookups?.batches.length || 3}
          subtitle="10A Morning & 10B Evening"
          icon={<Layers className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Curriculum Grades"
          value="Class 10 & 9"
          subtitle="CBSE & State Board"
          icon={<BookOpen className="w-5 h-5 text-[#00B8F8]" />}
          iconBg="bg-[#E0F8FF]"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or student ID (e.g. Rahul, IT10025)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#155EEF]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#155EEF]"
            >
              <option value="">All Batches</option>
              {lookups?.batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#155EEF]"
            >
              <option value="">All Classes</option>
              {lookups?.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {(search || selectedBatch || selectedClass) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedBatch('');
                  setSelectedClass('');
                }}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Student List with Direct Step 29 Action Hub */}
      <Card>
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonBlock height="h-12" />
            <SkeletonBlock height="h-12" />
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No Assigned Students Found"
            description="No students matched your search criteria."
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Batch</th>
                  <th className="px-6 py-3.5">Class & Board</th>
                  <th className="px-6 py-3.5">School</th>
                  <th className="px-6 py-3.5">Parent Contact</th>
                  <th className="px-6 py-3.5 text-right">Academic Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                          {student.photoUrl ? (
                            <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-xs text-gray-500">{student.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{student.name}</p>
                          <span className="font-mono text-[11px] font-semibold text-[#155EEF]">
                            {student.studentId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                        {student.batchName}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-gray-800">{student.className}</p>
                      <p className="text-[11px] text-gray-500">{student.boardName}</p>
                    </td>

                    <td className="px-6 py-3.5 text-gray-600">
                      {student.school}
                    </td>

                    <td className="px-6 py-3.5">
                      <p className="font-medium text-gray-800">{student.parentName}</p>
                      <p className="text-[11px] text-gray-500 font-mono">{student.parentPhone}</p>
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setActiveStudent(student);
                            setIsViewModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#EEF4FF] text-[#155EEF] hover:bg-[#DCE5F2] border border-[#DCE5F2] transition-colors"
                        >
                          Profile & Actions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* STEP 29: STUDENT PROFILE & COMPLETE ACTION HUB MODAL */}
      {isViewModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0B1F4D] text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                  {activeStudent.photoUrl ? (
                    <img src={activeStudent.photoUrl} alt={activeStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    activeStudent.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-900 text-lg">{activeStudent.name}</h3>
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">
                      {activeStudent.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {activeStudent.className} • {activeStudent.boardName} • Batch: {activeStudent.batchName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Immutability Notice in Modal */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center space-x-2 text-xs text-amber-800">
              <Lock className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Read-Only Identity:</strong> Faculty cannot change Name, DOB, Parent Details, School, Board, Class, Batch, or Photo.
              </span>
            </div>

            {/* Profile Information Grid (Read-Only) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">School</span>
                <span className="text-gray-900 font-bold block mt-0.5">{activeStudent.school}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Date of Birth</span>
                <span className="text-gray-900 font-bold block mt-0.5">{formatDate(activeStudent.dateOfBirth)}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Admission Date</span>
                <span className="text-gray-900 font-bold block mt-0.5">{formatDate(activeStudent.admissionDate)}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Parent Name</span>
                <span className="text-gray-900 font-bold block mt-0.5">{activeStudent.parentName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Parent Phone</span>
                <span className="text-gray-900 font-bold font-mono block mt-0.5">{activeStudent.parentPhone}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Academic Status</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5">
                  {activeStudent.status}
                </span>
              </div>
            </div>

            {/* Step 29: Teacher Actions Matrix */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Teacher Authorized Actions (Step 29)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => navigate('/teacher/attendance-history')}
                  className="p-3 text-left rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all group"
                >
                  <CalendarCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-bold text-gray-900 text-xs block group-hover:text-emerald-700">View Attendance</span>
                  <span className="text-[10px] text-gray-400 block">History & sessions</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/scorecards')}
                  className="p-3 text-left rounded-xl bg-[#F8FAFD] hover:bg-[#EEF4FF] border border-[#DCE5F2] hover:border-[#155EEF] transition-all group"
                >
                  <Award className="w-4 h-4 text-[#155EEF] mb-1" />
                  <span className="font-bold text-[#0B1F4D] text-xs block group-hover:text-[#155EEF]">View Scorecard</span>
                  <span className="text-[10px] text-gray-400 block">4-Subject breakdown</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/performance')}
                  className="p-3 text-left rounded-xl bg-[#F8FAFD] hover:bg-[#E0F8FF] border border-[#DCE5F2] hover:border-[#00B8F8] transition-all group"
                >
                  <TrendingUp className="w-4 h-4 text-[#00B8F8] mb-1" />
                  <span className="font-bold text-[#0B1F4D] text-xs block group-hover:text-[#00B8F8]">View Performance</span>
                  <span className="text-[10px] text-[#5B6B82] block">Line & chapter bars</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/marks')}
                  className="p-3 text-left rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all group"
                >
                  <FileText className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="font-bold text-gray-900 text-xs block group-hover:text-blue-700">View Marks</span>
                  <span className="text-[10px] text-gray-400 block">Published test results</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/leave-requests')}
                  className="p-3 text-left rounded-xl bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 transition-all group"
                >
                  <FileCheck className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="font-bold text-gray-900 text-xs block group-hover:text-amber-700">View Leave History</span>
                  <span className="text-[10px] text-gray-400 block">Review medical/leave</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/answer-sheets')}
                  className="p-3 text-left rounded-xl bg-gray-50 hover:bg-rose-50 border border-gray-200 hover:border-rose-300 transition-all group"
                >
                  <UploadCloud className="w-4 h-4 text-rose-600 mb-1" />
                  <span className="font-bold text-gray-900 text-xs block group-hover:text-rose-700">Upload Answer Sheet</span>
                  <span className="text-[10px] text-gray-400 block">Scanned evaluations</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/test-papers')}
                  className="p-3 text-left rounded-xl bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 transition-all group"
                >
                  <FileText className="w-4 h-4 text-teal-600 mb-1" />
                  <span className="font-bold text-gray-900 text-xs block group-hover:text-teal-700">Upload Test Paper</span>
                  <span className="text-[10px] text-gray-400 block">Question paper repository</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/marks-entry')}
                  className="p-3 text-left rounded-xl bg-[#F8FAFD] hover:bg-[#EEF4FF] border border-[#DCE5F2] hover:border-[#155EEF] transition-all group col-span-2"
                >
                  <Award className="w-4 h-4 text-[#155EEF] mb-1" />
                  <span className="font-bold text-[#0B1F4D] text-xs block group-hover:text-[#155EEF]">Enter / Edit Marks (Authorized)</span>
                  <span className="text-[10px] text-gray-400 block">Audit-trailed mark revisions with mandatory faculty reason</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsPage;
