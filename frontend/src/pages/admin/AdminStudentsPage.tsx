import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  fetchStudents,
  fetchAcademicLookups,
  createStudent,
  updateStudent,
  setStudentStatus,
  StudentDto,
  StudentStatusType,
  AcademicLookups,
  CreateStudentPayload,
  UpdateStudentPayload,
} from '../../services/studentService';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Eye,
  Shield,
  Phone,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  UserX,
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [lookups, setLookups] = useState<AcademicLookups | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<StudentDto | null>(null);

  // Form Submission State
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Add/Edit Form State
  const [formData, setFormData] = useState<{
    studentId: string;
    name: string;
    photoUrl: string;
    school: string;
    parentName: string;
    parentPhone: string;
    studentPhone: string;
    dateOfBirth: string;
    classId: string;
    boardId: string;
    batchId: string;
    academicYear: string;
    admissionDate: string;
    status: StudentStatusType;
  }>({
    studentId: '',
    name: '',
    photoUrl: '',
    school: '',
    parentName: '',
    parentPhone: '',
    studentPhone: '',
    dateOfBirth: '',
    classId: '',
    boardId: '',
    batchId: '',
    academicYear: '2024-2025',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });

  // Target status for Deactivate Modal
  const [targetStatus, setTargetStatus] = useState<StudentStatusType>('INACTIVE');

  // Load Initial Lookups & Students
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [lookupData, studentsData] = await Promise.all([
        fetchAcademicLookups(),
        fetchStudents({
          search: search || undefined,
          classId: selectedClass || undefined,
          boardId: selectedBoard || undefined,
          batchId: selectedBatch || undefined,
          school: selectedSchool || undefined,
          academicYear: selectedAcademicYear || undefined,
          status: (selectedStatus as StudentStatusType) || undefined,
        }),
      ]);

      setLookups(lookupData);
      setStudents(studentsData.students);
    } catch {
      // Handled in service fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedClass, selectedBoard, selectedBatch, selectedSchool, selectedStatus, selectedAcademicYear]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedClass('');
    setSelectedBoard('');
    setSelectedBatch('');
    setSelectedStatus('');
    setSelectedSchool('');
    setSelectedAcademicYear('');
  };

  // Unique list of schools for quick school filter
  const schoolOptions = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.school).filter(Boolean)));
    return list;
  }, [students]);

  // Open Add Modal with fresh defaults
  const handleOpenAddModal = () => {
    setFormError('');
    setFormSuccess('');
    const defaultClass = lookups?.classes[0]?.id || 'cls-10';
    const defaultBoard = lookups?.boards[0]?.id || 'brd-cbse';
    const defaultBatch = lookups?.batches[0]?.id || 'batch-10a-morning';

    setFormData({
      studentId: '',
      name: '',
      photoUrl: '',
      school: '',
      parentName: '',
      parentPhone: '',
      studentPhone: '',
      dateOfBirth: '2011-05-15',
      classId: defaultClass,
      boardId: defaultBoard,
      batchId: defaultBatch,
      academicYear: '2024-2025',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal with active student values
  const handleOpenEditModal = (student: StudentDto) => {
    setFormError('');
    setFormSuccess('');
    setActiveStudent(student);

    // Format DOB for date input
    const dobFormatted = student.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().split('T')[0]
      : '';
    const admFormatted = student.admissionDate
      ? new Date(student.admissionDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    setFormData({
      studentId: student.studentId,
      name: student.name,
      photoUrl: student.photoUrl || '',
      school: student.school,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      studentPhone: student.studentPhone || '',
      dateOfBirth: dobFormatted,
      classId: student.classId,
      boardId: student.boardId,
      batchId: student.batchId,
      academicYear: student.academicYear,
      admissionDate: admFormatted,
      status: student.status,
    });
    setIsEditModalOpen(true);
  };

  // Open Deactivate / Status Modal
  const handleOpenStatusModal = (student: StudentDto) => {
    setActiveStudent(student);
    setTargetStatus(student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
    setIsStatusModalOpen(true);
  };

  // Submit Add Student
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.school.trim() || !formData.parentName.trim() || !formData.parentPhone.trim() || !formData.dateOfBirth) {
      setFormError('Please fill in all mandatory fields (*).');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload: CreateStudentPayload = {
        studentId: formData.studentId.trim() || undefined,
        name: formData.name.trim(),
        photoUrl: formData.photoUrl.trim() || null,
        school: formData.school.trim(),
        parentName: formData.parentName.trim(),
        parentPhone: formData.parentPhone.trim(),
        studentPhone: formData.studentPhone.trim() || null,
        dateOfBirth: formData.dateOfBirth,
        classId: formData.classId,
        boardId: formData.boardId,
        batchId: formData.batchId,
        academicYear: formData.academicYear,
        admissionDate: formData.admissionDate,
        status: formData.status,
      };

      await createStudent(payload);
      setFormSuccess('Student created successfully!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        loadData();
      }, 1000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create student';
      setFormError(errorMsg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Edit Student
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;
    setFormError('');

    setFormSubmitting(true);
    try {
      const payload: UpdateStudentPayload = {
        name: formData.name.trim(),
        photoUrl: formData.photoUrl.trim() || null,
        school: formData.school.trim(),
        parentName: formData.parentName.trim(),
        parentPhone: formData.parentPhone.trim(),
        studentPhone: formData.studentPhone.trim() || null,
        dateOfBirth: formData.dateOfBirth,
        classId: formData.classId,
        boardId: formData.boardId,
        batchId: formData.batchId,
        academicYear: formData.academicYear,
        status: formData.status,
      };

      await updateStudent(activeStudent.id, payload);
      setFormSuccess('Student record updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        loadData();
      }, 1000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update student';
      setFormError(errorMsg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Status Change / Deactivate
  const handleStatusSubmit = async () => {
    if (!activeStudent) return;
    setFormSubmitting(true);
    try {
      await setStudentStatus(activeStudent.id, targetStatus);
      setIsStatusModalOpen(false);
      loadData();
    } catch {
      // Handled
    } finally {
      setFormSubmitting(false);
    }
  };

  // Stats calculation
  const totalCount = students.length;
  const activeCount = students.filter((s) => s.status === 'ACTIVE').length;
  const inactiveCount = students.filter((s) => s.status !== 'ACTIVE').length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getStatusBadge = (status: StudentStatusType) => {
    const config = {
      ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      INACTIVE: 'bg-slate-100 text-slate-700 border-slate-200',
      TRANSFERRED: 'bg-blue-50 text-blue-700 border-blue-200',
      COMPLETED: 'bg-[#EEF4FF] text-[#155EEF] border-[#DCE5F2]',
      SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
    }[status] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${config}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Students Directory & Enrollment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#1048B5] border border-[#DCE5F2]">
              ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage student records, batch assignments, locked parent contacts, and enrollment statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Student
          </Button>
        </div>
      </div>

      {/* Admin Protection Policy Note */}
      <div className="bg-[#EEF4FF]/70 border border-[#DCE5F2] rounded-xl p-3.5 flex items-center justify-between text-xs text-[#071633] gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#155EEF] flex-shrink-0" />
          <span>
            <strong>Protected Academic Records:</strong> Only administrators possess authority to register, edit identity fields, or deactivate students. Parents and teachers have read-only access.
          </span>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Students"
          value={totalCount}
          subtitle="All enrolled cohorts"
          icon={<GraduationCap className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF]"
        />
        <StatCard
          title="Active Students"
          value={activeCount}
          subtitle="Currently attending"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Inactive / Other"
          value={inactiveCount}
          subtitle="Transferred or suspended"
          icon={<UserX className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Active Batches"
          value={lookups?.batches.length || 3}
          subtitle="Morning & Evening"
          icon={<Layers className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
      </div>

      {/* Search & Multi-Criteria Filter Bar */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Universal Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Student Name, Parent Phone, School, Class, Board, Batch, Student ID..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Filter Count & Reset */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              {(search || selectedClass || selectedBoard || selectedBatch || selectedStatus || selectedSchool || selectedAcademicYear) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#155EEF] hover:text-[#0B1F4D] font-semibold transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Multi-Filter Dropdowns Grid (Step 31: Class, Board, Batch, School, Status, Academic Year) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            {/* Class Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Class / Grade
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              >
                <option value="">All Classes</option>
                {lookups?.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Board Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Board
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              >
                <option value="">All Boards</option>
                {lookups?.boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              >
                <option value="">All Batches</option>
                {lookups?.batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* School Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                School
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              >
                <option value="">All Schools</option>
                {schoolOptions.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TRANSFERRED">Transferred</option>
                <option value="COMPLETED">Completed</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            {/* Academic Year Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Academic Year
              </label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              >
                <option value="">All Years</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Students Data Table */}
      <Card>
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonBlock height="h-12" />
            <SkeletonBlock height="h-12" />
            <SkeletonBlock height="h-12" />
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No Students Found"
            description="No student records matched your search terms or active filters. Try adjusting your search query or reset filters."
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Student Details</th>
                  <th className="px-6 py-3.5">Class & Board</th>
                  <th className="px-6 py-3.5">Batch</th>
                  <th className="px-6 py-3.5">School</th>
                  <th className="px-6 py-3.5">Parent Contact</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Student Details */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {student.photoUrl ? (
                            <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-xs text-slate-500">
                              {student.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <span className="font-mono text-[11px] font-semibold text-[#155EEF]">
                            {student.studentId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Class & Board */}
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-800">{student.className}</p>
                      <p className="text-[11px] text-slate-500">{student.boardName}</p>
                    </td>

                    {/* Batch */}
                    <td className="px-6 py-3.5">
                      <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {student.batchName}
                      </span>
                    </td>

                    {/* School */}
                    <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate" title={student.school}>
                      {student.school}
                    </td>

                    {/* Parent Contact */}
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-slate-800">{student.parentName}</p>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {student.parentPhone}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3.5">
                      {getStatusBadge(student.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStudent(student);
                            setIsViewModalOpen(true);
                          }}
                          title="View Profile"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#155EEF] hover:bg-[#EEF4FF] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(student)}
                          title="Edit Student Record (Admin Authority)"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(student)}
                          title="Change Status / Deactivate"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <UserX className="w-4 h-4" />
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

      {/* ========================================================= */}
      {/* ADD STUDENT MODAL */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1048B5] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add New Student</h3>
                  <p className="text-xs text-slate-500">Register student with batch and linked parent details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Student Full Name *"
                  placeholder="e.g. Rahul Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Student ID (Leave blank to auto-generate)"
                  placeholder="e.g. IT10030"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="School Name *"
                  placeholder="e.g. ABC Public School"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  required
                />
                <Input
                  label="Date of Birth (DOB) *"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Class / Grade *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    required
                  >
                    {lookups?.classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Board *</label>
                  <select
                    value={formData.boardId}
                    onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    required
                  >
                    {lookups?.boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batch Assignment *</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    required
                  >
                    {lookups?.batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.timing})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Parent / Guardian Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Parent / Guardian Name *"
                    placeholder="e.g. Mr. Kumar"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    required
                  />
                  <Input
                    label="Parent Phone Number *"
                    placeholder="e.g. 9876543210"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    helperText="This number is used for parent portal login"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Student Phone Number (Optional)"
                    placeholder="e.g. 9876500000"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                  />
                  <Input
                    label="Student Photo URL (Optional)"
                    placeholder="https://..."
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Year *</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    required
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                <Input
                  label="Admission Date *"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={formSubmitting}
                >
                  Save & Enroll Student
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT STUDENT MODAL (ADMIN ONLY) */}
      {/* ========================================================= */}
      {isEditModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Student Record</h3>
                  <p className="text-xs text-slate-500">
                    Modifying protected profile: <span className="font-bold text-slate-800">{activeStudent.name}</span> ({activeStudent.studentId})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Student Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student ID (Protected)</label>
                  <input
                    type="text"
                    disabled
                    value={formData.studentId}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="School Name *"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  required
                />
                <Input
                  label="Date of Birth (DOB) *"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Class / Grade *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    {lookups?.classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Board *</label>
                  <select
                    value={formData.boardId}
                    onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    {lookups?.boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batch Assignment *</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    {lookups?.batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.timing})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Parent Contact Record
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Parent / Guardian Name *"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    required
                  />
                  <Input
                    label="Parent Phone Number *"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Student Phone Number"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                  />
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Enrollment Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatusType })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="TRANSFERRED">TRANSFERRED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={formSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW STUDENT DETAIL MODAL */}
      {/* ========================================================= */}
      {isViewModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  {activeStudent.photoUrl ? (
                    <img src={activeStudent.photoUrl} alt={activeStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm text-slate-600">{activeStudent.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{activeStudent.name}</h3>
                  <p className="text-xs text-[#155EEF] font-mono font-semibold">{activeStudent.studentId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-500 font-medium">Class & Board:</span>
                  <p className="font-bold text-slate-800">{activeStudent.className} ({activeStudent.boardName})</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Batch:</span>
                  <p className="font-bold text-slate-800">{activeStudent.batchName}</p>
                </div>
              </div>

              <dl className="divide-y divide-slate-100">
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500">School Name</dt>
                  <dd className="font-semibold text-slate-800">{activeStudent.school}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500">Date of Birth</dt>
                  <dd className="font-semibold text-slate-800">{formatDate(activeStudent.dateOfBirth)}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500">Parent / Guardian</dt>
                  <dd className="font-semibold text-slate-800">{activeStudent.parentName}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500">Parent Phone</dt>
                  <dd className="font-semibold font-mono text-slate-800">{activeStudent.parentPhone}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500">Student Phone</dt>
                  <dd className="font-semibold text-slate-800">{activeStudent.studentPhone || 'N/A'}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500">Admission Date</dt>
                  <dd className="font-semibold text-slate-800">{formatDate(activeStudent.admissionDate)}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500">Status</dt>
                  <dd>{getStatusBadge(activeStudent.status)}</dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEditModal(activeStudent);
                }}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Student
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STATUS CHANGE / DEACTIVATE MODAL */}
      {/* ========================================================= */}
      {isStatusModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Change Enrollment Status</h3>
                <p className="text-xs text-slate-500">{activeStudent.name} ({activeStudent.studentId})</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 font-semibold">Select Target Status</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as StudentStatusType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                <option value="ACTIVE">ACTIVE (Enrolled & Attending)</option>
                <option value="INACTIVE">INACTIVE (Temporarily Inactive)</option>
                <option value="SUSPENDED">SUSPENDED (Disciplinary / Admin Hold)</option>
                <option value="TRANSFERRED">TRANSFERRED (Shifted to another institute)</option>
                <option value="COMPLETED">COMPLETED (Course Completed)</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Updating student status immediately updates attendance rosters, parent portals, and test eligibility records.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleStatusSubmit}
                isLoading={formSubmitting}
              >
                Confirm Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
