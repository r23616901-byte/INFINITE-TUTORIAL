import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  BookOpen,
  FileText,
  Clock,
  FileCheck,
  CalendarCheck,
  Bell,
  GraduationCap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-[#00B8F8]" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#155EEF] block mb-1">
                Faculty Educator Desk
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                {user?.name || 'Prof. Rajesh Sharma (Physics)'}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-[#5B6B82] mt-1.5">
                <span className="bg-[#EEF4FF] text-[#155EEF] px-2.5 py-0.5 rounded-lg border border-[#DCE5F2]">
                  Physics &amp; Mathematics Faculty
                </span>
                <span>•</span>
                <span className="text-[#0B1F4D] font-bold">10A Morning &amp; 10B Evening</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-start md:self-auto flex-wrap gap-y-2">
            <Button
              size="sm"
              variant="accent"
              onClick={() => navigate('/teacher/daily-updates')}
              leftIcon={<Bell className="w-3.5 h-3.5" />}
            >
              Daily Updates
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/teacher/attendance')}
              leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}
            >
              Take Attendance
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/teacher/tests')}
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Create Test
            </Button>
          </div>
        </div>
      </div>

      {/* 5 METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Students */}
        <div
          onClick={() => navigate('/teacher/students')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Total Students</span>
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2] group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#155EEF] transition-colors">
              {metrics.totalStudents}
            </span>
            <span className="text-xs text-[#5B6B82] font-semibold block mt-1">Assigned Enrolled</span>
          </div>
        </div>

        {/* Today's Classes */}
        <div
          onClick={() => navigate('/teacher/timetable')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Today's Classes</span>
            <div className="p-2 bg-[#EEF4FF] text-[#1677FF] rounded-xl border border-[#DCE5F2] group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#1677FF] transition-colors">
              {metrics.todaysClasses}
            </span>
            <span className="text-xs text-[#1677FF] font-semibold block mt-1">Sessions Scheduled</span>
          </div>
        </div>

        {/* Today's Attendance Pending */}
        <div
          onClick={() => navigate('/teacher/attendance')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Attendance</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              {metrics.attendancePending}
            </span>
            <span className="text-xs text-amber-800 font-semibold block mt-1">10A Morning Pending</span>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div
          onClick={() => navigate('/teacher/leave-requests')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Pending Leaves</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              {metrics.pendingLeaves}
            </span>
            <span className="text-xs text-amber-800 font-semibold block mt-1">Awaiting Review</span>
          </div>
        </div>

        {/* Upcoming Tests */}
        <div
          onClick={() => navigate('/teacher/tests')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Upcoming Tests</span>
            <div className="p-2 bg-[#E0F8FF] text-[#008BBF] rounded-xl border border-[#BAE6FD] group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#008BBF] transition-colors">
              {metrics.upcomingTests}
            </span>
            <span className="text-xs text-[#5B6B82] font-semibold block mt-1">This Week Scheduled</span>
          </div>
        </div>
      </div>

      {/* RECENT RESULTS & ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <Card
          title="Recent Results & Evaluations"
          subtitle="Latest scores entered for assigned batches"
          headerAction={
            <button
              onClick={() => navigate('/teacher/marks-entry')}
              className="text-xs font-bold text-[#155EEF] hover:underline"
            >
              Enter Marks &rarr;
            </button>
          }
        >
          <div className="space-y-3">
            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0B1F4D]">Rahul Kumar</span>
                  <span className="text-xs font-mono bg-[#EEF4FF] text-[#155EEF] font-bold px-2 py-0.5 rounded-md border border-[#DCE5F2]">
                    IT10025
                  </span>
                </div>
                <p className="text-xs text-[#5B6B82] mt-1 font-medium">Physics — Chapter 3 Light Reflection Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-700">42/50</span>
                <span className="text-xs text-[#5B6B82] block font-semibold">84% Grade A</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0B1F4D]">Sneha Verma</span>
                  <span className="text-xs font-mono bg-[#EEF4FF] text-[#155EEF] font-bold px-2 py-0.5 rounded-md border border-[#DCE5F2]">
                    IT10026
                  </span>
                </div>
                <p className="text-xs text-[#5B6B82] mt-1 font-medium">Physics — Chapter 3 Light Reflection Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-700">46/50</span>
                <span className="text-xs text-[#5B6B82] block font-semibold">92% Grade A+</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0B1F4D]">Aditya Rao</span>
                  <span className="text-xs font-mono bg-[#EEF4FF] text-[#155EEF] font-bold px-2 py-0.5 rounded-md border border-[#DCE5F2]">
                    IT10027
                  </span>
                </div>
                <p className="text-xs text-[#5B6B82] mt-1 font-medium">Mathematics — Linear Equations Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#155EEF]">38/50</span>
                <span className="text-xs text-[#5B6B82] block font-semibold">76% Grade B+</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Announcements */}
        <Card
          title="Announcements & Notices"
          subtitle="Official circulars from Institute Administration"
          headerAction={
            <span className="text-[11px] bg-[#EEF4FF] text-[#155EEF] font-bold px-2.5 py-0.5 rounded-full border border-[#DCE5F2]">
              Faculty Board
            </span>
          }
        >
          <div className="space-y-3">
            <div className="p-4 bg-[#FFF4E5] rounded-xl border border-[#FDE68A]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-white/70 px-2 py-0.5 rounded">
                  Mandatory Notice
                </span>
                <span className="text-[11px] text-[#5B6B82] font-semibold">20 Sept 2026</span>
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-sm mt-1.5">Parent-Teacher Progress Meeting</h3>
              <p className="text-xs text-[#5B6B82] mt-1 leading-relaxed">
                Scheduled for Saturday, 20 September at 10:00 AM in the Tuitions Main Hall. Ensure term scorecards are finalized.
              </p>
            </div>

            <div className="p-4 bg-[#EEF4FF] rounded-xl border border-[#DCE5F2]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#155EEF] bg-white/70 px-2 py-0.5 rounded">
                  Academic Update
                </span>
                <span className="text-[11px] text-[#5B6B82] font-semibold">18 Sept 2026</span>
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-sm mt-1.5">Monthly Revision Test Submission</h3>
              <p className="text-xs text-[#5B6B82] mt-1 leading-relaxed">
                Faculty members must upload original question papers for upcoming revision tests before Friday evening.
              </p>
            </div>

            <div className="p-4 bg-[#E0F8FF] rounded-xl border border-[#BAE6FD]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#008BBF] bg-white/70 px-2 py-0.5 rounded">
                  Safety Protocol
                </span>
                <span className="text-[11px] text-[#5B6B82] font-semibold">Daily</span>
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-sm mt-1.5">Home-Reach Transit Confirmation</h3>
              <p className="text-xs text-[#5B6B82] mt-1 leading-relaxed">
                Please verify departure times at the conclusion of evening tuition sessions to trigger safety tracking updates.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
