import React, { useState } from 'react';
import {
  Bell,
  Search,
  Calendar,
  Download,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  category: 'ACADEMIC' | 'EXAMINATION' | 'ADMINISTRATIVE' | 'FACILITY';
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
  date: string;
  author: string;
  content: string;
  attachmentName?: string;
  attachmentUrl?: string;
  isRead?: boolean;
}

export const ParentAnnouncementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const announcements: Announcement[] = [
    {
      id: 'ann-1',
      title: 'Mandatory Parent-Teacher Meeting (PTM) for Term 1 Performance Review',
      category: 'ACADEMIC',
      priority: 'HIGH',
      date: '20 Sept 2026',
      author: 'Dr. Ramesh Sharma (Director)',
      content:
        'All parents are cordially invited for the Term 1 comprehensive performance review. Individual meeting slots with Physics, Chemistry, Biology, and Mathematics faculty will be organized to review answer sheets, homework compliance, and upcoming board preparation strategies.',
      attachmentName: 'PTM_Schedule_Slot_Details.pdf',
      attachmentUrl: '/uploads/documents/Academic_Timetable_Term1_orig_1790178073793.pdf',
    },
    {
      id: 'ann-2',
      title: 'CBSE Class 10 Pre-Board Test Series Schedule & Registration',
      category: 'EXAMINATION',
      priority: 'HIGH',
      date: '16 Sept 2026',
      author: 'Academic Examination Board',
      content:
        'The first round of simulated full-length Board examination papers will commence from October 22. Detailed date-sheets, question patterns, and marking schemes have been published. Revision sessions on weekends are mandatory.',
      attachmentName: 'Pre_Board_Schedule_2026.pdf',
      attachmentUrl: '/uploads/documents/Academic_Timetable_Term1_orig_1790178073793.pdf',
    },
    {
      id: 'ann-3',
      title: 'Science Practical Demonstration & Lab Workshop on 10th October',
      category: 'ACADEMIC',
      priority: 'NORMAL',
      date: '12 Sept 2026',
      author: 'Prof. Rajesh Sharma (HOD Physics)',
      content:
        'Hands-on experimental verification for ray optics, electric resistance in series/parallel, and salt analysis will be conducted this Saturday from 3:00 PM to 6:00 PM in Science Wing Lab 2.',
    },
    {
      id: 'ann-4',
      title: 'Tuition Departure & Safety Home-Reach Protocol Implementation',
      category: 'ADMINISTRATIVE',
      priority: 'NORMAL',
      date: '05 Sept 2026',
      author: 'Administration Office',
      content:
        'To ensure student safety in transit, Infinite Tutorial has launched the Tuition & Home-Reach module. Parents are requested to confirm student arrival with 1 tap on the portal as soon as students reach home after evening classes.',
    },
  ];

  const filtered = announcements.filter((ann) => {
    if (categoryFilter !== 'ALL' && ann.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        ann.title.toLowerCase().includes(q) ||
        ann.content.toLowerCase().includes(q) ||
        ann.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (p: Announcement['priority']) => {
    switch (p) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'URGENT':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Announcements &amp; Circulars
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Official institutional notifications, PTM schedules, and academic circulars.
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'ACADEMIC', 'EXAMINATION', 'ADMINISTRATIVE'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat === 'ALL' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-blue-300 transition-all space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadge(ann.priority)}`}>
                  {ann.priority} PRIORITY
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                  {ann.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Published: {ann.date}</span>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">{ann.title}</h2>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{ann.content}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 border-t border-gray-100">
              <span className="font-medium text-gray-700">Issued by: {ann.author}</span>
              {ann.attachmentName && (
                <a
                  href={ann.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors w-fit"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{ann.attachmentName}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentAnnouncementsPage;
