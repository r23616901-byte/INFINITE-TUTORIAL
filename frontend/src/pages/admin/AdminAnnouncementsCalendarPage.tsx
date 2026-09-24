import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  Bell,
  Calendar,
  Plus,
  Users,
  AlertCircle,
  CheckCircle2,
  FileText,
  Pin,
  Trash2,
  Download,
  X,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  category: 'PTM' | 'EXAM' | 'CIRCULAR' | 'HOLIDAY' | 'COMPETITION';
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  targetAudience: string;
  publishedDate: string;
  content: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  isPinned?: boolean;
  viewCount: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  category: 'EXAM' | 'PTM' | 'HOLIDAY' | 'ACADEMIC' | 'CAMP';
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  targetAudience: string;
  description: string;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-01',
    title: 'Mandatory Term 1 Progress Review & Parent-Teacher Meeting (PTM)',
    category: 'PTM',
    priority: 'URGENT',
    targetAudience: 'Batch 10A Morning & Evening Parents',
    publishedDate: '15 Sep 2026',
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
    content:
      'An intensive 2-hour problem solving workshop focusing on Chapter 10 (Light) and Chapter 12 (Electricity) numericals from NCERT Exemplar and past board papers will be held this Sunday at 10:00 AM.',
    hasAttachment: true,
    attachmentName: 'Physics_Exemplar_Handout.pdf',
    viewCount: 36,
  },
];

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Term 1 Mid-Term Examinations (CBSE 10)',
    category: 'EXAM',
    date: '2026-09-28',
    startTime: '07:00 AM',
    endTime: '10:00 AM',
    venue: 'Examination Halls A & B',
    targetAudience: 'Class 10 All Batches',
    description: 'Half-yearly periodic unit assessment covering 40% syllabus across all 4 subjects.',
  },
  {
    id: 'ev-2',
    title: 'Parent-Teacher Meeting & Progress Review',
    category: 'PTM',
    date: '2026-09-20',
    startTime: '09:30 AM',
    endTime: '01:30 PM',
    venue: 'Infinite Tutorial Campus Main Auditorium',
    targetAudience: 'Parents of Classes 9 & 10',
    description: 'One-on-one consultation with subject faculty and delivery of evaluated answer sheets.',
  },
  {
    id: 'ev-3',
    title: 'Gandhi Jayanti Public Holiday',
    category: 'HOLIDAY',
    date: '2026-10-02',
    startTime: 'All Day',
    endTime: '',
    venue: 'Tuition Closed',
    targetAudience: 'All Students & Faculty',
    description: 'Tuition classes will remain closed in observance of Gandhi Jayanti.',
  },
  {
    id: 'ev-4',
    title: 'Dussehra / Vijayadashami Break',
    category: 'HOLIDAY',
    date: '2026-10-12',
    startTime: 'All Day',
    endTime: '',
    venue: 'Tuition Closed',
    targetAudience: 'All Students & Faculty',
    description: 'Tuition holiday for Vijayadashami festivities.',
  },
  {
    id: 'ev-5',
    title: 'Intensive Science & Mathematics Bootcamp',
    category: 'CAMP',
    date: '2026-10-25',
    startTime: '08:00 AM',
    endTime: '01:00 PM',
    venue: 'Room 101 & 102',
    targetAudience: 'Batch 10A Morning & Evening',
    description: 'Deep dive into Electricity numerical circuits and Triangles riders with past 10-year question banks.',
  },
  {
    id: 'ev-6',
    title: 'Diwali Festival Break',
    category: 'HOLIDAY',
    date: '2026-11-01',
    startTime: 'All Day',
    endTime: '',
    venue: 'Tuition Closed',
    targetAudience: 'All Students & Faculty',
    description: 'Annual Diwali festival vacation.',
  },
];

export const AdminAnnouncementsCalendarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'calendar'>('announcements');
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [notification, setNotification] = useState<string | null>(null);

  // New Announcement Modal
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'PTM' | 'EXAM' | 'CIRCULAR' | 'HOLIDAY' | 'COMPETITION'>('CIRCULAR');
  const [newAnnPriority, setNewAnnPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('NORMAL');
  const [newAnnAudience, setNewAnnAudience] = useState('All Students & Parents');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnAttachment, setNewAnnAttachment] = useState('');

  // New Event Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'EXAM' | 'PTM' | 'HOLIDAY' | 'ACADEMIC' | 'CAMP'>('ACADEMIC');
  const [newEventDate, setNewEventDate] = useState('2026-10-15');
  const [newEventStartTime, setNewEventStartTime] = useState('09:00 AM');
  const [newEventEndTime, setNewEventEndTime] = useState('11:00 AM');
  const [newEventVenue, setNewEventVenue] = useState('Campus Auditorium');
  const [newEventAudience, setNewEventAudience] = useState('All Students');
  const [newEventDesc, setNewEventDesc] = useState('');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle.trim(),
      category: newAnnCategory,
      priority: newAnnPriority,
      targetAudience: newAnnAudience,
      publishedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      content: newAnnContent.trim(),
      hasAttachment: !!newAnnAttachment.trim(),
      attachmentName: newAnnAttachment.trim() || undefined,
      isPinned: newAnnPriority === 'URGENT',
      viewCount: 0,
    };

    setAnnouncements([newAnn, ...announcements]);
    setIsAnnModalOpen(false);
    setNewAnnTitle('');
    setNewAnnContent('');
    setNewAnnAttachment('');
    setNotification('Official circular published across all student and parent portals.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      category: newEventCategory,
      date: newEventDate,
      startTime: newEventStartTime,
      endTime: newEventEndTime,
      venue: newEventVenue,
      targetAudience: newEventAudience,
      description: newEventDesc.trim(),
    };

    setEvents([...events, newEv]);
    setIsEventModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
    setNotification('Calendar event scheduled and synchronized with parent timetable.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Bell className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-indigo-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Institutional Broadcast & Academic Calendar
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Announcements & Academic Calendar
            </h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-2xl">
              Publish official circulars, exam schedules, and manage the master institutional calendar for students, parents, and faculty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'announcements' ? (
              <Button
                onClick={() => setIsAnnModalOpen(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Publish Announcement
              </Button>
            ) : (
              <Button
                onClick={() => setIsEventModalOpen(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Calendar Event
              </Button>
            )}
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
          subtitle="Broadcasting to Portals"
          icon={<Bell className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          title="Calendar Events"
          value={events.length}
          subtitle="Term 1 & Term 2 Milestones"
          icon={<Calendar className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="High Priority Alerts"
          value={announcements.filter((a) => a.priority !== 'NORMAL').length}
          subtitle="Mandatory PTM & Exams"
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
        />
        <StatCard
          title="Total Audience Reach"
          value="84 Enrolled"
          subtitle="Parents & Students"
          icon={<Users className="w-5 h-5 text-purple-600" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          Announcements & Circulars ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'calendar'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Academic Calendar ({events.length})
        </button>
      </div>

      {/* Announcements Tab Content */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              className={`p-6 border transition-all ${
                ann.isPinned
                  ? 'border-indigo-200 bg-indigo-50/20 shadow-sm'
                  : 'border-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    {ann.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
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
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium mt-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Attachment: {ann.attachmentName}</span>
                      <a
                        href={`/uploads/documents/${ann.attachmentName}`}
                        download
                        className="text-indigo-700 hover:text-indigo-900 ml-2 font-bold flex items-center gap-0.5"
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

                  <button
                    onClick={() => setAnnouncements(announcements.filter((a) => a.id !== ann.id))}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 transition-all self-end"
                    title="Delete circular"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Calendar Tab Content */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => (
              <Card key={ev.id} className="p-5 border border-gray-100 hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ev.category === 'EXAM'
                        ? 'bg-red-100 text-red-700'
                        : ev.category === 'PTM'
                        ? 'bg-purple-100 text-purple-700'
                        : ev.category === 'HOLIDAY'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {ev.category}
                  </span>
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {ev.date}
                  </span>
                </div>

                <h4 className="text-base font-bold text-gray-900">{ev.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{ev.description}</p>

                <div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                  {ev.startTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{ev.targetAudience}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Publish Official Announcement</h3>
              <button onClick={() => setIsAnnModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  placeholder="e.g. Term 1 Progress Review Meeting"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newAnnCategory}
                    onChange={(e) => setNewAnnCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="CIRCULAR">General Circular</option>
                    <option value="PTM">Parent-Teacher Meeting</option>
                    <option value="EXAM">Examination</option>
                    <option value="HOLIDAY">Holiday</option>
                    <option value="COMPETITION">Olympiad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newAnnPriority}
                    onChange={(e) => setNewAnnPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Audience</label>
                <select
                  value={newAnnAudience}
                  onChange={(e) => setNewAnnAudience(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="All Students & Parents">All Students & Parents</option>
                  <option value="Batch 10A Morning & Evening Parents">Batch 10A Morning & Evening Parents</option>
                  <option value="All Faculty Teachers">All Faculty Teachers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Content Details *</label>
                <textarea
                  required
                  rows={4}
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  placeholder="Enter details..."
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Attachment File Name</label>
                <input
                  type="text"
                  value={newAnnAttachment}
                  onChange={(e) => setNewAnnAttachment(e.target.value)}
                  placeholder="e.g. Schedule_Notice.pdf"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAnnModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Publish Circular
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Schedule Calendar Event</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. CBSE 10 Mock Board Practical Test"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="ACADEMIC">Academic Session</option>
                    <option value="EXAM">Examination</option>
                    <option value="PTM">PTM</option>
                    <option value="HOLIDAY">Holiday</option>
                    <option value="CAMP">Bootcamp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Audience</label>
                  <input
                    type="text"
                    value={newEventAudience}
                    onChange={(e) => setNewEventAudience(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newEventStartTime}
                    onChange={(e) => setNewEventStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newEventEndTime}
                    onChange={(e) => setNewEventEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEventModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Add to Calendar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminAnnouncementsCalendarPage;
