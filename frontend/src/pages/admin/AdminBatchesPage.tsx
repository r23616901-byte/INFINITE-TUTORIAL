import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  getBatchesApi,
  createBatchApi,
  getClassesApi,
  getBoardsApi,
} from '../../services/academicService';
import { BatchItem, ClassItem, BoardItem } from '../../types/attendance';
import {
  Layers,
  Plus,
  Calendar,
  CheckCircle2,
  X,
  Sun,
  Moon,
  Search,
} from 'lucide-react';

export const AdminBatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Batch Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    boardId: '',
    session: 'MORNING',
    startTime: '07:00 AM',
    endTime: '08:30 AM',
    days: 'Monday-Saturday',
    assignedTeacherName: 'Prof. Rajesh Sharma (Physics)',
    status: 'ACTIVE',
  });

  const loadAll = async () => {
    try {
      setIsLoading(true);
      const [btcList, clsList, brdList] = await Promise.all([
        getBatchesApi(),
        getClassesApi(),
        getBoardsApi(),
      ]);
      setBatches(btcList);
      setClasses(clsList);
      setBoards(brdList);

      if (clsList.length > 0 && !formData.classId) {
        setFormData((prev) => ({ ...prev, classId: clsList[0].id }));
      }
      if (brdList.length > 0 && !formData.boardId) {
        setFormData((prev) => ({ ...prev, boardId: brdList[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.classId || !formData.boardId) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      const timing = `${formData.startTime} - ${formData.endTime}`;
      const created = await createBatchApi({
        ...formData,
        timing,
      });

      setBatches((prev) => [created, ...prev]);
      setFormSuccess('Batch created successfully!');

      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess('');
        setFormData({
          name: '',
          classId: classes[0]?.id || '',
          boardId: boards[0]?.id || '',
          session: 'MORNING',
          startTime: '07:00 AM',
          endTime: '08:30 AM',
          days: 'Monday-Saturday',
          assignedTeacherName: 'Prof. Rajesh Sharma (Physics)',
          status: 'ACTIVE',
        });
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered batches
  const filtered = batches.filter((b) => {
    if (selectedClass && b.classId !== selectedClass) return false;
    if (selectedBoard && b.boardId !== selectedBoard) return false;
    if (selectedSession && b.session !== selectedSession) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        (b.assignedTeacherName && b.assignedTeacherName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-blue-800 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Batch Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#1048B5] border border-[#DCE5F2]">
                CLASS & BATCH SCHEDULER
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Create, configure, and assign faculty to Morning & Evening batches across Class 9 and Class 10.
            </p>
          </div>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-[#155EEF] hover:bg-[#1048B5] text-white font-bold"
        >
          Create New Batch
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Batches"
          value={batches.length.toString()}
          subtitle="Configured batches"
          icon={<Layers className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF]"
          isLoading={isLoading}
        />
        <StatCard
          title="Morning Batches"
          value={batches.filter((b) => b.session === 'MORNING').length.toString()}
          subtitle="7:00 AM – 8:30 AM"
          icon={<Sun className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Evening Batches"
          value={batches.filter((b) => b.session === 'EVENING').length.toString()}
          subtitle="5:00 PM – 7:00 PM"
          icon={<Moon className="w-5 h-5 text-[#0B1F4D]" />}
          iconBg="bg-[#EEF4FF]"
          isLoading={isLoading}
        />
        <StatCard
          title="Schedule Pattern"
          value="Mon–Sat"
          subtitle="6 Days / Week"
          icon={<Calendar className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badge="Active"
          badgeVariant="emerald"
          isLoading={isLoading}
        />
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by batch name, faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
        >
          <option value="">All Boards</option>
          {boards.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
        >
          <option value="">All Sessions</option>
          <option value="MORNING">Morning Only</option>
          <option value="EVENING">Evening Only</option>
        </select>
      </div>

      {/* Batch Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonBlock height="180px" />
          <SkeletonBlock height="180px" />
          <SkeletonBlock height="180px" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No batches match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#B2CCFF] transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {b.id}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-0.5">
                    {b.name}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    b.session === 'MORNING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-[#EEF4FF] text-[#0B1F4D] border border-[#DCE5F2]'
                  }`}
                >
                  {b.session === 'MORNING' ? (
                    <Sun className="w-3 h-3 text-amber-600" />
                  ) : (
                    <Moon className="w-3 h-3 text-[#155EEF]" />
                  )}
                  {b.session}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Class & Board:</span>
                  <span className="font-bold text-slate-800">
                    {b.className || 'Class 10'} &bull; {b.boardName || 'CBSE'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Timing:</span>
                  <span className="font-medium text-slate-800 font-mono">
                    {b.timing || `${b.startTime} - ${b.endTime}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Operating Days:</span>
                  <span className="font-medium text-slate-800">{b.days}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Teacher:</span>
                  <span className="font-semibold text-[#1048B5]">
                    {b.assignedTeacherName || 'Prof. Rajesh Sharma'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {b.status}
                </span>
                <span className="text-slate-500 font-bold">
                  {b.studentCount || 14} Students
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#155EEF] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Create New Batch</h3>
                  <p className="text-xs text-slate-500">Configure class, board, timing, and session</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batch Name (e.g. 10th A Morning, 9th B Evening)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10th A Morning"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Board
                  </label>
                  <select
                    value={formData.boardId}
                    onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  >
                    {boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Session
                  </label>
                  <select
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                  >
                    <option value="MORNING">Morning</option>
                    <option value="EVENING">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    placeholder="07:00 AM"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    placeholder="08:30 AM"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Days
                </label>
                <input
                  type="text"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Teacher / Faculty
                </label>
                <input
                  type="text"
                  placeholder="Prof. Rajesh Sharma (Physics)"
                  value={formData.assignedTeacherName}
                  onChange={(e) => setFormData({ ...formData, assignedTeacherName: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
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
                  size="sm"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="bg-[#155EEF] hover:bg-[#1048B5]"
                >
                  Save Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
