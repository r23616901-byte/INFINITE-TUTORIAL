import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  Bell,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Users,
  FileText,
  Trash2,
  Pin,
  Sparkles,
  Download,
  Send,
  X,
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  category: 'EXAM' | 'PTM' | 'CIRCULAR' | 'HOLIDAY' | 'COMPETITION';
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  targetAudience: string;
  publishedDate: string;
  author: string;
  content: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  isPinned?: boolean;
  viewCount: number;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-01',
    title: 'Mandatory Term 1 Progress Review & Parent-Teacher Meeting (PTM)',
    category: 'PTM',
    priority: 'URGENT',
    targetAudience: 'Batch 10A Morning & Evening Parents',
    publishedDate: '15 Sep 2026',
    author: 'Mrs. Priya Sundaram',
    content:
      'Dear Parents, The mandatory Term 1 progress review meeting with subject faculty and principal is scheduled for Saturday, 20 September 2026 from 09:30 AM to 01:30 PM. Evaluated answer sheets and diagnostic scorecards will be handed over in person.',
    hasAttachment: true,
    attachmentName: 'PTM_Slot_Schedule_Term1_2026.pdf',
    isPinned: true,
    viewCount: 41,
  },
  {
    id: 'ann-02',
    title: 'Term 1 Mid-Term Examination Date Sheet & Syllabus Guidelines',
    category: 'EXAM',
    priority: 'HIGH',
    targetAudience: 'Class 10 CBSE All Students',
    publishedDate: '10 Sep 2026',
    author: 'Mrs. Priya Sundaram',
    content:
      'Term 1 periodic assessments will commence from 28 September 2026. Detailed chapter-wise weightage, blueprint, and invigilation protocols have been attached. Students must carry their own geometry boxes and blue ballpoint pens.',
    hasAttachment: true,
    attachmentName: 'Class10_Term1_Datesheet_Timetable.pdf',
    isPinned: true,
    viewCount: 39,
  },
  {
    id: 'ann-03',
    title: 'National Science & Mathematics Olympiad (NSO/IMO) Registrations',
    category: 'COMPETITION',
    priority: 'NORMAL',
    targetAudience: 'All Batches (Classes 9 & 10)',
    publishedDate: '02 Sep 2026',
    author: 'Academic Coordinator',
    content:
      'Registrations for the upcoming Science and Mathematics Olympiad are now open. Interested students can collect application forms and preparatory material from the office front desk before 25 September 2026.',
    hasAttachment: false,
    viewCount: 32,
  },
  {
    id: 'ann-04',
    title: 'Special Sunday Numerical Problem Solving Masterclass in Physics',
    category: 'CIRCULAR',
    priority: 'NORMAL',
    targetAudience: 'Batch 10A Morning & Evening',
    publishedDate: '26 Aug 2026',
    author: 'Mrs. Priya Sundaram',
    content:
      'An intensive 2-hour problem solving workshop focusing on Chapter 10 (Light) and Chapter 12 (Electricity) numericals from NCERT Exemplar and past board papers will be held this Sunday at 10:00 AM.',
    hasAttachment: true,
    attachmentName: 'Physics_Exemplar_Handout.pdf',
    viewCount: 36,
  },
];

export const TeacherAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Create Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'EXAM' | 'PTM' | 'CIRCULAR' | 'HOLIDAY' | 'COMPETITION'>('CIRCULAR');
  const [formPriority, setFormPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('NORMAL');
  const [formAudience, setFormAudience] = useState('Batch 10A Morning & Evening Parents');
  const [formContent, setFormContent] = useState('');
  const [formAttachmentName, setFormAttachmentName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredAnnouncements = announcements.filter((ann) => {
    if (categoryFilter !== 'ALL' && ann.category !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && ann.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ann.title.toLowerCase().includes(q) ||
        ann.content.toLowerCase().includes(q) ||
        ann.targetAudience.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      priority: formPriority,
      targetAudience: formAudience,
      publishedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: 'Mrs. Priya Sundaram',
      content: formContent.trim(),
      hasAttachment: !!formAttachmentName.trim(),
      attachmentName: formAttachmentName.trim() || undefined,
      isPinned: formPriority === 'URGENT',
      viewCount: 1,
    };

    setAnnouncements([newAnn, ...announcements]);
    setIsCreateOpen(false);
    setFormTitle('');
    setFormContent('');
    setFormAttachmentName('');
    setNotification('Announcement published successfully to parents and students.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    setNotification('Announcement deleted.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Bell className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-emerald-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Tuition Notice Board & Circular Broadcast
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Class Announcements & Circulars
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl">
              Publish official announcements, exam circulars, and PTM notices directly to parents and students in your assigned batches.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md font-semibold px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Publish Announcement
            </Button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Announcements"
          value={announcements.length}
          subtitle="Displayed on Portal"
          icon={<Bell className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Urgent / High Priority"
          value={announcements.filter((a) => a.priority !== 'NORMAL').length}
          subtitle="Alert Notifications Sent"
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
        />
        <StatCard
          title="Total Audience Reach"
          value="80 Parents"
          subtitle="Batch 10A Morning & Evening"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Circulars With PDF"
          value={announcements.filter((a) => a.hasAttachment).length}
          subtitle="Available for Download"
          icon={<FileText className="w-5 h-5 text-purple-600" />}
        />
      </div>

      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars, topics, keywords..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Categories</option>
                <option value="PTM">Parent-Teacher Meeting</option>
                <option value="EXAM">Examination</option>
                <option value="CIRCULAR">General Circular</option>
                <option value="COMPETITION">Olympiad / Contests</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High Priority</option>
                <option value="NORMAL">Normal</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <Card
            key={ann.id}
            className={`p-6 border transition-all ${
              ann.isPinned
                ? 'border-emerald-200 bg-emerald-50/20 shadow-sm'
                : 'border-gray-100 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ann.priority === 'URGENT'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : ann.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                    {ann.category}
                  </span>
                  <span className="text-xs text-gray-400">&bull;</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {ann.targetAudience}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{ann.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{ann.content}</p>

                {ann.hasAttachment && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mt-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Attachment: {ann.attachmentName}</span>
                    <a
                      href={`/uploads/documents/${ann.attachmentName}`}
                      download
                      className="text-emerald-700 hover:text-emerald-900 ml-2 font-bold flex items-center gap-0.5"
                    >
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:items-end justify-between self-stretch gap-4">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ann.publishedDate}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePin(ann.id)}
                    className={`p-1.5 rounded-lg border text-xs transition-all ${
                      ann.isPinned
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200'
                    }`}
                    title={ann.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 transition-all"
                    title="Delete circular"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Publish Class Announcement</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Chapter 12 Electricity Test Schedule & Question Format"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="CIRCULAR">General Circular</option>
                    <option value="EXAM">Examination</option>
                    <option value="PTM">Parent-Teacher Meeting</option>
                    <option value="HOLIDAY">Holiday Notice</option>
                    <option value="COMPETITION">Olympiad / Contest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Batch 10A Morning & Evening Parents">Batch 10A Morning & Evening Parents</option>
                  <option value="Batch 10A Morning (Students & Parents)">Batch 10A Morning (Students & Parents)</option>
                  <option value="Batch 10A Evening (Students & Parents)">Batch 10A Evening (Students & Parents)</option>
                  <option value="Class 10 All Batches">Class 10 All Batches</option>
                  <option value="Entire Tuition Portal">Entire Tuition Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Announcement Details / Circular Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Enter message details for parents and students..."
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Attachment Name (PDF / Handout)
                </label>
                <input
                  type="text"
                  value={formAttachmentName}
                  onChange={(e) => setFormAttachmentName(e.target.value)}
                  placeholder="e.g. Chapter_12_Formula_Sheet.pdf"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Publish Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherAnnouncementsPage;
