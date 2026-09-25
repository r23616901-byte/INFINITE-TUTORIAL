import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  DailyUpdateDto,
  SubjectUpdateItem,
  fetchDailyUpdates,
  createDailyUpdateApi,
  updateDailyUpdateApi,
  deleteDailyUpdateApi,
} from '../../services/dailyUpdateService';
import {
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Layers,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  FileText,
  BookmarkCheck,
  ClipboardList,
  Info,
} from 'lucide-react';

const BATCH_OPTIONS = [
  { id: 'batch-10a-morning', name: '10-A Morning' },
  { id: 'batch-10b-evening', name: '10-B Evening' },
  { id: 'batch-9a-evening', name: '9-A Evening' },
];

const DEFAULT_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

export const DailyUpdatesPage: React.FC = () => {
  const [updates, setUpdates] = useState<DailyUpdateDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<DailyUpdateDto | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState<{
    date: string;
    batchId: string;
    batchName: string;
    title: string;
    todayLesson: string;
    topicsCovered: string;
    homework: string;
    instructions: string;
    subjectUpdates: SubjectUpdateItem[];
  }>({
    date: new Date().toISOString().split('T')[0],
    batchId: 'batch-10a-morning',
    batchName: '10-A Morning',
    title: "Today's Update",
    todayLesson: '',
    topicsCovered: '',
    homework: '',
    instructions: '',
    subjectUpdates: [
      { subject: 'Physics', status: 'Chapter 4 completed.' },
      { subject: 'Chemistry', status: 'Numericals discussed.' },
      { subject: 'Mathematics', status: 'Exercise 5.2 completed.' },
    ],
  });

  const loadUpdates = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDailyUpdates({
        batchId: selectedBatch || undefined,
        date: selectedDate || undefined,
        search: search || undefined,
      });
      setUpdates(data);
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();
  }, [selectedBatch, selectedDate, search]);

  const handleResetFilters = () => {
    setSelectedBatch('');
    setSelectedDate('');
    setSearch('');
  };

  const handleOpenCreateModal = () => {
    setEditingUpdate(null);
    setFormError('');
    setFormSuccess('');
    setFormData({
      date: new Date().toISOString().split('T')[0],
      batchId: 'batch-10a-morning',
      batchName: '10-A Morning',
      title: "Today's Update",
      todayLesson: 'Physics Chapter 4 Ray Optics, Chemistry Solutions, Maths Arithmetic Progressions',
      topicsCovered: 'Refraction through glass prisms, Molarity numericals, AP nth term derivation',
      homework: 'Complete questions 1–10.',
      instructions: "Bring NCERT exemplar and graph book for tomorrow's mathematics session.",
      subjectUpdates: [
        { subject: 'Physics', status: 'Chapter 4 completed.' },
        { subject: 'Chemistry', status: 'Numericals discussed.' },
        { subject: 'Mathematics', status: 'Exercise 5.2 completed.' },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DailyUpdateDto) => {
    setEditingUpdate(item);
    setFormError('');
    setFormSuccess('');
    setFormData({
      date: item.date,
      batchId: item.batchId,
      batchName: item.batchName,
      title: item.title,
      todayLesson: item.todayLesson,
      topicsCovered: item.topicsCovered,
      homework: item.homework,
      instructions: item.instructions || '',
      subjectUpdates: [...item.subjectUpdates],
    });
    setIsModalOpen(true);
  };

  const handleSubjectChange = (index: number, field: 'subject' | 'status', value: string) => {
    setFormData((prev) => {
      const copy = [...prev.subjectUpdates];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, subjectUpdates: copy };
    });
  };

  const handleAddSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjectUpdates: [...prev.subjectUpdates, { subject: 'Biology', status: 'Topics discussed.' }],
    }));
  };

  const handleRemoveSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subjectUpdates: prev.subjectUpdates.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.batchId || !formData.date) {
      setFormError('Please select a batch and date.');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingUpdate) {
        await updateDailyUpdateApi(editingUpdate.id, {
          title: formData.title,
          todayLesson: formData.todayLesson,
          topicsCovered: formData.topicsCovered,
          homework: formData.homework,
          instructions: formData.instructions,
          subjectUpdates: formData.subjectUpdates,
        });
        setFormSuccess('Daily update modified successfully!');
      } else {
        await createDailyUpdateApi(formData);
        setFormSuccess('Daily update published successfully!');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        loadUpdates();
      }, 700);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save daily update');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this daily update?')) return;
    try {
      await deleteDailyUpdateApi(id);
      await loadUpdates();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete update');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = updates.filter((u) => u.date === todayStr).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Daily Updates & Homework
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              FACULTY POSTING
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish daily syllabus progress, homework assignments, and important instructions for parents & students.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Publish Daily Update
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Updates"
          value={updates.length}
          subtitle="All published logs"
          icon={<Bell className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF]"
        />
        <StatCard
          title="Today's Updates"
          value={todayCount}
          subtitle={`Logged on ${todayStr}`}
          icon={<BookmarkCheck className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Homework Active"
          value={updates.filter((u) => u.homework && u.homework !== 'No homework assigned.').length}
          subtitle="Assignments pending"
          icon={<ClipboardList className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Batches Covered"
          value={BATCH_OPTIONS.length}
          subtitle="Morning & Evening"
          icon={<Layers className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic, lesson, homework, or subject..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {(search || selectedBatch || selectedDate) && (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              >
                <option value="">All Batches</option>
                {BATCH_OPTIONS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#155EEF]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Updates Feed List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonBlock height="h-28" />
            <SkeletonBlock height="h-28" />
          </div>
        ) : updates.length === 0 ? (
          <EmptyState
            title="No Daily Updates Found"
            description="No daily logs match the selected filters. Click 'Publish Daily Update' to post today's syllabus summary."
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          updates.map((update) => (
            <div
              key={update.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EEF4FF] text-[#1048B5] border border-[#DCE5F2] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {update.date}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {update.batchName}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{update.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[11px] text-slate-400">
                    By <strong className="text-slate-600">{update.postedByName}</strong>
                  </span>
                  <button
                    onClick={() => handleOpenEditModal(update)}
                    title="Edit Update"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(update.id)}
                    title="Delete Update"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject Breakdown (Prompt Example: Physics, Chemistry, Maths) */}
              {update.subjectUpdates && update.subjectUpdates.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {update.subjectUpdates.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                    >
                      <span className="font-bold text-[#1048B5] text-[11px] uppercase tracking-wide">
                        {sub.subject}:
                      </span>
                      <p className="font-medium text-slate-800 leading-snug">{sub.status}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Today's Lesson & Topics Covered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1 text-[11px]">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Today's Lesson
                  </div>
                  <p className="text-slate-700 leading-relaxed">{update.todayLesson || 'N/A'}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#EEF4FF]/70 border border-[#DCE5F2]">
                  <div className="flex items-center gap-1.5 font-bold text-[#0B1F4D] mb-1 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-[#155EEF]" />
                    Topics Covered
                  </div>
                  <p className="text-slate-700 leading-relaxed">{update.topicsCovered || 'N/A'}</p>
                </div>
              </div>

              {/* Homework Box (Prompt Example: Complete questions 1–10.) */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                  Homework Assignment
                </div>
                <p className="font-bold text-slate-900 text-sm pl-6">
                  {update.homework}
                </p>
              </div>

              {/* Important Instructions (Optional) */}
              {update.instructions && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block">
                      Important Instructions:
                    </span>
                    <p className="text-slate-600 mt-0.5">{update.instructions}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= PUBLISH / EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingUpdate ? 'Edit Daily Update' : 'Publish Daily Update'}
                  </h3>
                  <p className="text-xs text-slate-500">Post lesson progress, homework, and batch instructions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batch *</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => {
                      const selected = BATCH_OPTIONS.find((b) => b.id === e.target.value);
                      setFormData({
                        ...formData,
                        batchId: e.target.value,
                        batchName: selected?.name || '10-A Morning',
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    required
                  >
                    {BATCH_OPTIONS.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Session Date *"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />

                <Input
                  label="Update Title"
                  placeholder="e.g. Today's Update"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Subject Breakdown Editor */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Subject-Wise Lesson Status
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="text-xs text-[#155EEF] font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Subject
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.subjectUpdates.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={sub.subject}
                        onChange={(e) => handleSubjectChange(idx, 'subject', e.target.value)}
                        className="w-36 p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-bold"
                      >
                        {DEFAULT_SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={sub.status}
                        onChange={(e) => handleSubjectChange(idx, 'status', e.target.value)}
                        placeholder="e.g. Chapter 4 completed."
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                      {formData.subjectUpdates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Lesson & Topics Covered */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Today's Lesson</label>
                  <textarea
                    rows={2}
                    value={formData.todayLesson}
                    onChange={(e) => setFormData({ ...formData, todayLesson: e.target.value })}
                    placeholder="e.g. Physics Chapter 4 Ray Optics, Chemistry Solutions"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Topics Covered</label>
                  <textarea
                    rows={2}
                    value={formData.topicsCovered}
                    onChange={(e) => setFormData({ ...formData, topicsCovered: e.target.value })}
                    placeholder="e.g. Refraction through glass prisms, Molarity numericals"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Homework Assignment (Step 37 Prompt Example: Complete questions 1–10.) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
                  Homework Assignment *
                </label>
                <input
                  type="text"
                  value={formData.homework}
                  onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                  placeholder="e.g. Complete questions 1–10."
                  className="w-full p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs font-bold text-slate-900"
                  required
                />
              </div>

              {/* Important Instructions (Step 19) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Important Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="e.g. Bring NCERT exemplar and graph book for tomorrow."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={formSubmitting}
                >
                  {editingUpdate ? 'Update Changes' : 'Publish Daily Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyUpdatesPage;
