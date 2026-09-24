import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  BookOpen,
  FileText,
  Award,
  Clock,
  FileCheck,
  CalendarCheck,
  Bell,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step 28 Exact Values:
  // Students: 82 | Today's Classes: 3 | Attendance Pending: 1 | Pending Leaves: 4 | Upcoming Tests: 2
  const metrics = {
    totalStudents: 82,
    todaysClasses: 3,
    attendancePending: 1,
    pendingLeaves: 4,
    upcomingTests: 2,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-white via-indigo-50/40 to-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md flex-shrink-0 text-2xl font-bold">
              👨‍🏫
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                Faculty Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {user?.name || 'Prof. Rajesh Sharma (Physics)'}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold text-gray-600 mt-1.5">
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md border border-indigo-200">
                  Physics & Mathematics Faculty
                </span>
                <span>•</span>
                <span className="text-gray-700">10A Morning & 10B Evening</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto flex-wrap gap-y-2">
            <button
              onClick={() => navigate('/teacher/daily-updates')}
              className="inline-flex items-center px-3.5 py-2 border border-amber-300 shadow-xs text-xs font-bold rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Daily Updates
            </button>
            <button
              onClick={() => navigate('/teacher/attendance')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              Take Attendance
            </button>
            <button
              onClick={() => navigate('/teacher/tests')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Create Test
            </button>
          </div>
        </div>
      </div>

      {/* 1. STEP 28: DASHBOARD METRIC CARDS (Students: 82, Classes: 3, Att Pending: 1, Leaves: 4, Tests: 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div
          onClick={() => navigate('/teacher/students')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Students</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
              {metrics.totalStudents}
            </span>
            <span className="text-xs text-gray-500 font-semibold block mt-1">Assigned Enrolled</span>
          </div>
        </div>

        {/* Today's Classes */}
        <div
          onClick={() => navigate('/teacher/timetable')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Today's Classes</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
              {metrics.todaysClasses}
            </span>
            <span className="text-xs text-blue-600 font-semibold block mt-1">Sessions Scheduled</span>
          </div>
        </div>

        {/* Today's Attendance / Attendance Pending */}
        <div
          onClick={() => navigate('/teacher/attendance')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Attendance Pending</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600">
              {metrics.attendancePending}
            </span>
            <span className="text-xs text-amber-700 font-semibold block mt-1">10A Morning (Pending)</span>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div
          onClick={() => navigate('/teacher/leave-requests')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Leaves</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-600">
              {metrics.pendingLeaves}
            </span>
            <span className="text-xs text-rose-700 font-semibold block mt-1">Awaiting Review</span>
          </div>
        </div>

        {/* Upcoming Tests */}
        <div
          onClick={() => navigate('/teacher/tests')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-purple-300 transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Upcoming Tests</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-purple-600">
              {metrics.upcomingTests}
            </span>
            <span className="text-xs text-purple-700 font-semibold block mt-1">This Week Scheduled</span>
          </div>
        </div>
      </div>

      {/* 2. RECENT RESULTS & ANNOUNCEMENTS (Exact Step 28 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-gray-900">Recent Results & Evaluations</h2>
            </div>
            <button
              onClick={() => navigate('/teacher/marks-entry')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Enter Marks
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">Rahul Kumar</span>
                  <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">IT10025</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Physics — Chapter 3 Light Reflection Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-600">42/50</span>
                <span className="text-xs text-gray-400 block font-medium">84% Grade A</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">Sneha Verma</span>
                  <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">IT10026</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Physics — Chapter 3 Light Reflection Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-600">46/50</span>
                <span className="text-xs text-gray-400 block font-medium">92% Grade A+</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">Aditya Rao</span>
                  <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">IT10027</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mathematics — Linear Equations Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-blue-600">38/50</span>
                <span className="text-xs text-gray-400 block font-medium">76% Grade B+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-gray-900">Announcements & Notices</h2>
            </div>
            <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
              Faculty Noticeboard
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Mandatory</span>
                <span className="text-[11px] text-gray-500">20 Sept 2026</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mt-1">Parent-Teacher Progress Meeting</h3>
              <p className="text-xs text-gray-600 mt-1">
                Scheduled for Saturday, 20 September at 10:00 AM in the Tuitions Main Hall. Ensure term scorecards are finalized.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Academic</span>
                <span className="text-[11px] text-gray-500">18 Sept 2026</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mt-1">Monthly Revision Test Submission</h3>
              <p className="text-xs text-gray-600 mt-1">
                Faculty members must upload original question papers for upcoming revision tests before Friday evening.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Attendance</span>
                <span className="text-[11px] text-gray-500">Daily</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mt-1">Home-Reach Transit Confirmation</h3>
              <p className="text-xs text-gray-600 mt-1">
                Please verify departure times at the conclusion of evening tuition sessions to trigger safety tracking updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
