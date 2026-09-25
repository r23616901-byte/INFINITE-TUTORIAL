import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  Clock,
  Calendar,
  Layers,
  Users,
  MapPin,
  Plus,
  Printer,
  Sparkles,
  CheckCircle2,
  X,
  Trash2,
} from 'lucide-react';

interface TimetableSlot {
  id: string;
  day: string;
  batchId: string;
  batchName: string;
  session: 'MORNING' | 'AFTERNOON' | 'EVENING';
  startTime: string;
  endTime: string;
  subject: string;
  topic: string;
  faculty: string;
  room: string;
  studentCount: number;
}

const INITIAL_MASTER_SLOTS: TimetableSlot[] = [
  // Monday
  {
    id: 'slot-m1',
    day: 'Monday',
    batchId: 'batch-10a-morning',
    batchName: 'Batch 10A Morning',
    session: 'MORNING',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    subject: 'Physics',
    topic: 'Chapter 12: Electricity - Ohm’s Law & Resistance Factors',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
  },
  {
    id: 'slot-m2',
    day: 'Monday',
    batchId: 'batch-9a-morning',
    batchName: 'Batch 9A Morning',
    session: 'MORNING',
    startTime: '07:00 AM',
    endTime: '09:00 AM',
    subject: 'Mathematics',
    topic: 'Number Systems - Rationalisation & Laws of Exponents',
    faculty: 'Mr. Arvind Saxena',
    room: 'Room 103 (Junior Wing)',
    studentCount: 35,
  },
  {
    id: 'slot-m3',
    day: 'Monday',
    batchId: 'batch-10a-evening',
    batchName: 'Batch 10A Evening',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    subject: 'Physics',
    topic: 'Chapter 12: Electricity - Series & Parallel Combinations',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
  },

  // Tuesday
  {
    id: 'slot-t1',
    day: 'Tuesday',
    batchId: 'batch-10a-morning',
    batchName: 'Batch 10A Morning',
    session: 'MORNING',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    subject: 'Mathematics',
    topic: 'Chapter 6: Triangles - Criteria for Similarity (AAA, SSS, SAS)',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
  },
  {
    id: 'slot-t2',
    day: 'Tuesday',
    batchId: 'batch-10a-evening',
    batchName: 'Batch 10A Evening',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    subject: 'Chemistry',
    topic: 'Chapter 3: Metals and Non-metals - Reactivity Series',
    faculty: 'Dr. Anita Joshi',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
  },

  // Wednesday
  {
    id: 'slot-w1',
    day: 'Wednesday',
    batchId: 'batch-10a-morning',
    batchName: 'Batch 10A Morning',
    session: 'MORNING',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    subject: 'Biology',
    topic: 'Chapter 9: Heredity & Evolution - Mendel Monohybrid Cross',
    faculty: 'Dr. Vikram Rao',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
  },
  {
    id: 'slot-w2',
    day: 'Wednesday',
    batchId: 'batch-10a-evening',
    batchName: 'Batch 10A Evening',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    subject: 'Mathematics',
    topic: 'Chapter 6: Triangles - Similar Triangles Riders & Proofs',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
  },

  // Thursday
  {
    id: 'slot-th1',
    day: 'Thursday',
    batchId: 'batch-10a-morning',
    batchName: 'Batch 10A Morning',
    session: 'MORNING',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    subject: 'Chemistry',
    topic: 'Chapter 3: Metals & Non-metals - Ionic Bonds & Properties',
    faculty: 'Dr. Anita Joshi',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
  },
  {
    id: 'slot-th2',
    day: 'Thursday',
    batchId: 'batch-10a-evening',
    batchName: 'Batch 10A Evening',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    subject: 'Biology',
    topic: 'Chapter 9: Heredity & Evolution - Dihybrid Cross & Punnett Square',
    faculty: 'Dr. Vikram Rao',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
  },

  // Friday
  {
    id: 'slot-f1',
    day: 'Friday',
    batchId: 'batch-10a-morning',
    batchName: 'Batch 10A Morning',
    session: 'MORNING',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    subject: 'Physics',
    topic: 'Chapter 10 & 11: Formula Revision & Board Question Bank Analysis',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
  },
  {
    id: 'slot-f2',
    day: 'Friday',
    batchId: 'batch-10a-evening',
    batchName: 'Batch 10A Evening',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    subject: 'Physics',
    topic: 'Chapter 10 & 11: Formula Revision & Board Question Bank Analysis',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
  },

  // Saturday
  {
    id: 'slot-s1',
    day: 'Saturday',
    batchId: 'batch-10a-morning',
    batchName: 'Batch 10A Morning',
    session: 'MORNING',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    subject: 'Diagnostic Test',
    topic: 'Physics Chapter 12 Internal Assessment (50 Marks)',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Examination Hall A',
    studentCount: 42,
  },
  {
    id: 'slot-s2',
    day: 'Saturday',
    batchId: 'batch-10a-evening',
    batchName: 'Batch 10A Evening',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    subject: 'Diagnostic Test',
    topic: 'Physics Chapter 12 Internal Assessment (50 Marks)',
    faculty: 'Mrs. Priya Sundaram',
    room: 'Examination Hall B',
    studentCount: 38,
  },
];

const DAYS = ['ALL', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AdminTimetablePage: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>(INITIAL_MASTER_SLOTS);
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');

  // Add Slot Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDay, setNewDay] = useState('Monday');
  const [newBatchName, setNewBatchName] = useState('Batch 10A Morning');
  const [newSession, setNewSession] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');
  const [newStartTime, setNewStartTime] = useState('06:30 AM');
  const [newEndTime, setNewEndTime] = useState('08:30 AM');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newTopic, setNewTopic] = useState('');
  const [newFaculty, setNewFaculty] = useState('Mrs. Priya Sundaram');
  const [newRoom, setNewRoom] = useState('Room 101');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredSlots = slots.filter((slot) => {
    if (selectedDay !== 'ALL' && slot.day !== selectedDay) return false;
    if (selectedBatch !== 'ALL' && slot.batchName !== selectedBatch) return false;
    if (selectedFaculty !== 'ALL' && slot.faculty !== selectedFaculty) return false;
    return true;
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newSlot: TimetableSlot = {
      id: `slot-${Date.now()}`,
      day: newDay,
      batchId: newBatchName.toLowerCase().replace(/\s+/g, '-'),
      batchName: newBatchName,
      session: newSession,
      startTime: newStartTime,
      endTime: newEndTime,
      subject: newSubject,
      topic: newTopic.trim(),
      faculty: newFaculty,
      room: newRoom,
      studentCount: 40,
    };

    setSlots([...slots, newSlot]);
    setIsAddOpen(false);
    setNewTopic('');
    setNotification('New timetable class slot scheduled successfully.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id));
    setNotification('Class session removed from timetable.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Clock className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155EEF]/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-[#155EEF]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Master Timetable & Classroom Allocation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Timetable & Academic Sessions
            </h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-2xl">
              Centralized institutional schedule across all cohorts, batches, classrooms, and faculty teaching assignments. Synchronized across Teacher and Parent portals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Master Schedule
            </Button>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#155EEF] hover:bg-[#155EEF] text-white font-semibold shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
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
          title="Active Batches"
          value="3 Batches"
          subtitle="Batch 10A Morn, 10A Eve, 9A Morn"
          icon={<Layers className="w-5 h-5 text-[#155EEF]" />}
        />
        <StatCard
          title="Weekly Class Sessions"
          value={slots.length}
          subtitle="Across Mon - Sat Cycles"
          icon={<Clock className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Active Faculty"
          value="4 Faculty"
          subtitle="Mrs. Priya, Dr. Anita, Dr. Vikram, Mr. Arvind"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Allocated Rooms"
          value="4 Rooms"
          subtitle="Room 101, 102, 103, Halls A/B"
          icon={<MapPin className="w-5 h-5 text-[#00B8F8]" />}
        />
      </div>

      {/* Filter Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Day:
            </span>
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDay === day
                    ? 'bg-[#155EEF] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Batch:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              >
                <option value="ALL">All Batches</option>
                <option value="Batch 10A Morning">Batch 10A Morning</option>
                <option value="Batch 10A Evening">Batch 10A Evening</option>
                <option value="Batch 9A Morning">Batch 9A Morning</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Faculty:</span>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              >
                <option value="ALL">All Faculty</option>
                <option value="Mrs. Priya Sundaram">Mrs. Priya Sundaram</option>
                <option value="Dr. Anita Joshi">Dr. Anita Joshi</option>
                <option value="Dr. Vikram Rao">Dr. Vikram Rao</option>
                <option value="Mr. Arvind Saxena">Mr. Arvind Saxena</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Slots Table / List */}
      <div className="space-y-3">
        {filteredSlots.map((slot) => (
          <Card
            key={slot.id}
            className="p-5 border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-24 text-center py-2 px-3 bg-[#EEF4FF] border border-[#DCE5F2] rounded-xl flex-shrink-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1048B5]">
                  {slot.day}
                </span>
                <span className="block text-xs font-extrabold text-gray-900 mt-0.5">
                  {slot.startTime}
                </span>
                <span className="block text-[10px] text-gray-400">to {slot.endTime}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                    {slot.batchName}
                  </span>
                  <span className="text-xs text-gray-400">&bull;</span>
                  <span className="text-xs font-semibold text-[#1048B5] bg-[#EEF4FF] px-2 py-0.5 rounded">
                    {slot.subject}
                  </span>
                  <span className="text-xs text-gray-400">&bull;</span>
                  <span className="text-xs text-gray-500 font-medium">Faculty: {slot.faculty}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{slot.topic}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gray-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#155EEF]" />
                    {slot.room}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {slot.studentCount} Students Enrolled
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Roster Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleDeleteSlot(slot.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Delete session"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Slot Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Schedule Academic Session</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Day of Week</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                  >
                    {DAYS.filter((d) => d !== 'ALL').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Batch</label>
                  <select
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                  >
                    <option value="Batch 10A Morning">Batch 10A Morning</option>
                    <option value="Batch 10A Evening">Batch 10A Evening</option>
                    <option value="Batch 9A Morning">Batch 9A Morning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Session Timing Bracket</label>
                <select
                  value={newSession}
                  onChange={(e) => setNewSession(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                >
                  <option value="MORNING">Morning (06:30 - 09:00)</option>
                  <option value="AFTERNOON">Afternoon (04:00 - 05:00)</option>
                  <option value="EVENING">Evening (05:30 - 07:30)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Faculty</label>
                  <select
                    value={newFaculty}
                    onChange={(e) => setNewFaculty(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                  >
                    <option value="Mrs. Priya Sundaram">Mrs. Priya Sundaram</option>
                    <option value="Dr. Anita Joshi">Dr. Anita Joshi</option>
                    <option value="Dr. Vikram Rao">Dr. Vikram Rao</option>
                    <option value="Mr. Arvind Saxena">Mr. Arvind Saxena</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Topic / Lesson Name *</label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Chapter 12: Electric Power & Commercial Units"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Room / Venue</label>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="Room 101"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#155EEF] hover:bg-[#1048B5] text-white">
                  Save Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminTimetablePage;
