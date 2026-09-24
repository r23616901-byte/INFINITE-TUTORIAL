import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  TeacherDto,
  fetchTeachers,
  createTeacherApi,
  updateTeacherApi,
  toggleTeacherStatusApi,
  assignSubjectsAndBatchesApi,
  resetTeacherPasswordApi,
  getAssignedStudentsApi,
} from '../../services/teacherService';
import {
  Users,
  Search,
  Plus,
  Edit2,
  KeyRound,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
  Activity,
  X,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';

const ALL_SUBJECTS = ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
const ALL_BATCHES = ['10A Morning', '10B Evening', '9A Evening'];

export const AdminTeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);

  const [activeTeacher, setActiveTeacher] = useState<TeacherDto | null>(null);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Form states
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  // Add/Edit Form Data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subjects: [] as string[],
    batches: [] as string[],
    joiningDate: '2024-06-01',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  // Load teachers
  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTeachers({
        search: search || undefined,
        status: selectedStatus || undefined,
      });
      setTeachers(data);
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [search, selectedStatus]);

  // Client filtering for subject & batch
  const filteredTeachers = teachers.filter((t) => {
    if (selectedSubject && !t.subjects.includes(selectedSubject)) return false;
    if (selectedBatch && !t.batches.includes(selectedBatch)) return false;
    return true;
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSubject('');
    setSelectedBatch('');
    setSelectedStatus('');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormError('');
    setFormSuccess('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      subjects: ['Physics'],
      batches: ['10A Morning'],
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (teacher: TeacherDto) => {
    setFormError('');
    setFormSuccess('');
    setActiveTeacher(teacher);
    setFormData({
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email,
      subjects: [...teacher.subjects],
      batches: [...teacher.batches],
      joiningDate: teacher.joiningDate ? teacher.joiningDate.split('T')[0] : '2024-06-01',
      status: teacher.status,
    });
    setIsEditModalOpen(true);
  };

  // Open Assign Modal
  const handleOpenAssignModal = (teacher: TeacherDto) => {
    setFormError('');
    setFormSuccess('');
    setActiveTeacher(teacher);
    setFormData({
      ...formData,
      subjects: [...teacher.subjects],
      batches: [...teacher.batches],
    });
    setIsAssignModalOpen(true);
  };

  // Open Reset Password Modal
  const handleOpenResetModal = async (teacher: TeacherDto) => {
    setActiveTeacher(teacher);
    setFormSubmitting(true);
    try {
      const res = await resetTeacherPasswordApi(teacher.id);
      setTempPassword(res.tempPassword || 'Teacher@1234');
      setIsResetModalOpen(true);
    } catch {
      setTempPassword('Teacher@1234');
      setIsResetModalOpen(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Activity Modal
  const handleOpenActivityModal = (teacher: TeacherDto) => {
    setActiveTeacher(teacher);
    setIsActivityModalOpen(true);
  };

  // Open Assigned Students Modal
  const handleOpenStudentsModal = async (teacher: TeacherDto) => {
    setActiveTeacher(teacher);
    setIsStudentsModalOpen(true);
    setStudentsLoading(true);
    try {
      const data = await getAssignedStudentsApi(teacher.id);
      setAssignedStudents(data?.students || []);
    } catch {
      setAssignedStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  // Toggle Active/Inactive status
  const handleToggleStatus = async (teacher: TeacherDto) => {
    const nextStatus = teacher.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await toggleTeacherStatusApi(teacher.id, nextStatus);
      await loadTeachers();
    } catch {
      // Fallback update
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacher.id ? { ...t, status: nextStatus } : t))
      );
    }
  };

  // Submit Add
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFormError('Please fill in Name, Phone, and Email.');
      return;
    }
    setFormSubmitting(true);
    try {
      await createTeacherApi(formData);
      setFormSuccess('Teacher added successfully!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        loadTeachers();
      }, 800);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to add teacher');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Edit
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher) return;
    setFormError('');
    setFormSubmitting(true);
    try {
      await updateTeacherApi(activeTeacher.id, formData);
      setFormSuccess('Teacher details updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        loadTeachers();
      }, 800);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to update teacher');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Assignments
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher) return;
    setFormError('');
    setFormSubmitting(true);
    try {
      await assignSubjectsAndBatchesApi(activeTeacher.id, formData.subjects, formData.batches);
      setFormSuccess('Subjects and batches assigned successfully!');
      setTimeout(() => {
        setIsAssignModalOpen(false);
        loadTeachers();
      }, 800);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to update assignments');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle checkbox helper
  const toggleSubjectSelection = (sub: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(sub)
        ? prev.subjects.filter((s) => s !== sub)
        : [...prev.subjects, sub],
    }));
  };

  const toggleBatchSelection = (bat: string) => {
    setFormData((prev) => ({
      ...prev,
      batches: prev.batches.includes(bat)
        ? prev.batches.filter((b) => b !== bat)
        : [...prev.batches, bat],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Faculty & Teacher Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage instructors, assign subjects & batches, reset credentials, and monitor faculty activity.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Teacher
        </Button>
      </div>

      {/* Admin Protection Policy */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-indigo-900 gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            <strong>System Security:</strong> Teachers are granted role-based access to enter marks, take attendance, and review student tests strictly for their assigned subjects and batches.
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          subtitle="Registered staff"
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Active Faculty"
          value={teachers.filter((t) => t.status === 'ACTIVE').length}
          subtitle="Currently teaching"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Subjects Taught"
          value={4}
          subtitle="Physics, Chem, Bio, Maths"
          icon={<BookOpen className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Covered Batches"
          value={3}
          subtitle="Morning & Evening batches"
          icon={<Layers className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teacher by Name, Email, or Phone..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {(search || selectedSubject || selectedBatch || selectedStatus) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="">All Subjects</option>
                {ALL_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="">All Batches</option>
                {ALL_BATCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Teachers Table */}
      <Card>
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonBlock height="h-12" />
            <SkeletonBlock height="h-12" />
            <SkeletonBlock height="h-12" />
          </div>
        ) : filteredTeachers.length === 0 ? (
          <EmptyState
            title="No Teachers Found"
            description="No faculty records matched your search query or filters. Click Add New Teacher to register."
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Teacher Name & Info</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Assigned Subjects</th>
                  <th className="px-6 py-3.5">Assigned Batches</th>
                  <th className="px-6 py-3.5">Joining Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex-shrink-0 flex items-center justify-center font-bold text-indigo-700">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{teacher.name}</p>
                          <span className="text-[11px] text-slate-500 font-mono">
                            ID: {teacher.id.replace('teacher-', '')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-3.5 space-y-0.5">
                      <p className="font-mono text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {teacher.phone}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {teacher.email}
                      </p>
                    </td>

                    {/* Subjects */}
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {teacher.subjects && teacher.subjects.length > 0 ? (
                          teacher.subjects.map((sub) => (
                            <span
                              key={sub}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">None assigned</span>
                        )}
                      </div>
                    </td>

                    {/* Batches */}
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {teacher.batches && teacher.batches.length > 0 ? (
                          teacher.batches.map((batch) => (
                            <span
                              key={batch}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                              {batch}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">None assigned</span>
                        )}
                      </div>
                    </td>

                    {/* Joining Date */}
                    <td className="px-6 py-3.5 text-slate-600 font-mono text-[11px]">
                      {teacher.joiningDate ? teacher.joiningDate.split('T')[0] : 'N/A'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(teacher)}
                        title="Click to toggle status"
                        className="flex items-center gap-1.5 focus:outline-hidden"
                      >
                        {teacher.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            INACTIVE
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentsModal(teacher)}
                          title="View Assigned Students"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(teacher)}
                          title="Assign Subjects & Batches"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenResetModal(teacher)}
                          title="Reset Password"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenActivityModal(teacher)}
                          title="View Activity Log"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(teacher)}
                          title="Edit Teacher"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
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

      {/* ================= ADD TEACHER MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add New Teacher</h3>
                  <p className="text-xs text-slate-500">Register teacher profile, credentials, and subjects</p>
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
                  label="Teacher Full Name *"
                  placeholder="e.g. Prof. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number *"
                  placeholder="e.g. 9800000002"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  helperText="Used for teacher login"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. teacher@infinite.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Joining Date *"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  required
                />
              </div>

              {/* Assign Subjects */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Assign Subjects
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SUBJECTS.map((sub) => (
                    <label key={sub} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(sub)}
                        onChange={() => toggleSubjectSelection(sub)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-800">{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assign Batches */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Assign Batches
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_BATCHES.map((batch) => (
                    <label key={batch} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300">
                      <input
                        type="checkbox"
                        checked={formData.batches.includes(batch)}
                        onChange={() => toggleBatchSelection(batch)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-800">{batch}</span>
                    </label>
                  ))}
                </div>
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
                  Save & Register Teacher
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT TEACHER MODAL ================= */}
      {isEditModalOpen && activeTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Teacher Profile</h3>
                  <p className="text-xs text-slate-500">{activeTeacher.name}</p>
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

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Teacher Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Joining Date *"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
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

      {/* ================= ASSIGN SUBJECTS & BATCHES MODAL ================= */}
      {isAssignModalOpen && activeTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Assign Subjects & Batches</h3>
                  <p className="text-xs text-slate-500">Instructor: {activeTeacher.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Subjects Authorized
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SUBJECTS.map((sub) => (
                    <label key={sub} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(sub)}
                        onChange={() => toggleSubjectSelection(sub)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-800">{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Batches Authorized
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_BATCHES.map((batch) => (
                    <label key={batch} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300">
                      <input
                        type="checkbox"
                        checked={formData.batches.includes(batch)}
                        onChange={() => toggleBatchSelection(batch)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-800">{batch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={formSubmitting}
                >
                  Save Assignments
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RESET PASSWORD MODAL ================= */}
      {isResetModalOpen && activeTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Password Reset</h3>
                <p className="text-xs text-slate-500">{activeTeacher.name}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <p className="text-slate-500">A temporary password has been generated:</p>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-sm text-center text-indigo-700 select-all">
                {tempPassword}
              </div>
              <p className="text-[11px] text-slate-400">
                Provide this credential to the teacher. They will be prompted to update it upon login.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsResetModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ACTIVITY LOG MODAL ================= */}
      {isActivityModalOpen && activeTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Faculty Activity Log</h3>
                  <p className="text-xs text-slate-500">{activeTeacher.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsActivityModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs max-h-80 overflow-y-auto">
              {activeTeacher.activityLog && activeTeacher.activityLog.length > 0 ? (
                activeTeacher.activityLog.map((act, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    <span className="font-medium text-slate-700">{act}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-medium text-slate-700">Submitted attendance for 10A Morning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-medium text-slate-700">Entered marks for Chapter 3 Physics Test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-medium text-slate-700">Reviewed 2 student leave requests</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsActivityModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ASSIGNED STUDENTS MODAL ================= */}
      {isStudentsModalOpen && activeTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Assigned Students</h3>
                  <p className="text-xs text-slate-500">
                    Students enrolled in {activeTeacher.name}'s assigned batches ({activeTeacher.batches.join(', ')})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStudentsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {studentsLoading ? (
              <div className="space-y-2">
                <SkeletonBlock height="h-10" />
                <SkeletonBlock height="h-10" />
              </div>
            ) : assignedStudents.length === 0 ? (
              <EmptyState
                title="No Students in Assigned Batches"
                description="Assign more batches to this teacher to populate the student roster."
              />
            ) : (
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Student ID</th>
                      <th className="px-6 py-3">Class & Board</th>
                      <th className="px-6 py-3">Batch</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignedStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-bold text-slate-900">{stu.name}</td>
                        <td className="px-6 py-3 font-mono text-indigo-600 font-semibold">{stu.studentId}</td>
                        <td className="px-6 py-3 text-slate-600">{stu.className} ({stu.boardName})</td>
                        <td className="px-6 py-3 font-medium text-slate-700">{stu.batchName}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {stu.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsStudentsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachersPage;
