import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { submitLeaveRequestApi, getLeaveRequestsApi } from '../../services/leaveService';
import { LeaveRequest } from '../../types/leave';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Calendar,
  Upload,
  AlertCircle,
  FileText,
  Check,
} from 'lucide-react';

const REASON_OPTIONS = [
  'Medical / Sickness',
  'Family Function / Wedding',
  'School Examination / Internal Test',
  'Personal / Emergency',
  'Travel / Out of Station',
  'Other Reason',
];

export const ParentLeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form State
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [session, setSession] = useState('BOTH');
  const [reason, setReason] = useState('Medical / Sickness');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadLeaves = async () => {
    try {
      setIsLoading(true);
      const data = await getLeaveRequestsApi();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !reason || !description.trim()) {
      setFormError('Please fill in all mandatory fields (Dates, Reason, Description).');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      setFormSuccess('');

      const cleanReason = reason.split('/')[0].trim();
      const created = await submitLeaveRequestApi({
        studentId: 'IT10025',
        fromDate,
        toDate: toDate || fromDate,
        session,
        reason: cleanReason,
        description,
        attachmentUrl: attachmentUrl || undefined,
      });

      setLeaves((prev) => [created, ...prev]);
      setFormSuccess('Leave request submitted successfully! Your status is now PENDING review.');
      setDescription('');
      setAttachmentUrl('');

      setTimeout(() => {
        setFormSuccess('');
      }, 5000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered requests
  const filteredLeaves = leaves.filter((l) => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const pendingCount = leaves.filter((l) => l.status === 'PENDING').length;
  const approvedCount = leaves.filter((l) => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter((l) => l.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <FileCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Leave Request System
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                PARENT APPLICATION PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Submit leave requests for <strong>Rahul Kumar</strong> (Roll: IT10025 &bull; 10th A Morning). Track approval status in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Pending Requests"
          value={pendingCount.toString()}
          subtitle="Awaiting Faculty Review"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          badge="In Review"
          badgeVariant="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="Approved Leaves"
          value={approvedCount.toString()}
          subtitle="Excused Absences"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badge="Sanctioned"
          badgeVariant="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="Rejected / Declined"
          value={rejectedCount.toString()}
          subtitle="Non-Permitted Dates"
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          badge="Declined"
          badgeVariant="slate"
          isLoading={isLoading}
        />
      </div>

      {/* Grid: Submit Form (1 Col) & History Tracker (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Request Form */}
        <div className="lg:col-span-1">
          <Card
            title="Submit Leave Request"
            subtitle="Fill details and notify teachers/admin"
          >
            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {formSuccess}
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              {/* From Date */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* To Date */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Session Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Session <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSession('MORNING')}
                    className={`py-1.5 rounded-md font-bold text-[11px] transition-all ${
                      session === 'MORNING'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => setSession('EVENING')}
                    className={`py-1.5 rounded-md font-bold text-[11px] transition-all ${
                      session === 'EVENING'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Evening
                  </button>
                  <button
                    type="button"
                    onClick={() => setSession('BOTH')}
                    className={`py-1.5 rounded-md font-bold text-[11px] transition-all ${
                      session === 'BOTH'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Full Day
                  </button>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Absence <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {REASON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Explanation / Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context for the teacher/admin (e.g. Doctor recommendation, fever, family wedding)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Attachment Optional */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Attachment Link (Optional medical slip / document)
                </label>
                <div className="relative">
                  <Upload className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://... or doctor slip URL"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 shadow-sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Submit Leave Request
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Leave Requests Tracker & History */}
        <div className="lg:col-span-2">
          <Card
            title="Leave Request History & Status Tracker"
            subtitle="Review current progress and teacher responses"
            headerAction={
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL'
                      ? 'All'
                      : st === 'PENDING'
                      ? '🟡 Pending'
                      : st === 'APPROVED'
                      ? '🟢 Approved'
                      : '🔴 Rejected'}
                  </button>
                ))}
              </div>
            }
          >
            {isLoading ? (
              <div className="space-y-3 py-4">
                <SkeletonBlock height="70px" />
                <SkeletonBlock height="70px" />
                <SkeletonBlock height="70px" />
              </div>
            ) : filteredLeaves.length === 0 ? (
              <EmptyState
                title="No leave requests found"
                description={
                  leaves.length === 0
                    ? "Submit a leave request when needed."
                    : "No leave requests match the selected status filter."
                }
                icon={<FileCheck className="w-8 h-8 text-emerald-500 stroke-[1.5]" />}
                compact
              />
            ) : (
              <div className="space-y-3.5">
                {filteredLeaves.map((req) => {
                  const isPending = req.status === 'PENDING';
                  const isApproved = req.status === 'APPROVED';
                  const isRejected = req.status === 'REJECTED';

                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isPending
                          ? 'border-amber-200 bg-amber-50/20'
                          : isApproved
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-red-200 bg-red-50/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">
                            {req.reason}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : isApproved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {isPending
                              ? '⏳ Pending Review'
                              : isApproved
                              ? '✓ Approved'
                              : '✕ Rejected'}
                          </span>
                        </div>

                        <div className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {req.fromDate === req.toDate
                            ? req.fromDate
                            : `${req.fromDate} to ${req.toDate}`}
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">
                            {req.session}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                        {req.description}
                      </p>

                      {/* Optional Attachment */}
                      {req.attachmentUrl && (
                        <div className="mt-2.5">
                          <a
                            href={req.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Medical Slip / Attachment
                          </a>
                        </div>
                      )}

                      {/* Review feedback note if processed */}
                      {(isApproved || isRejected) && req.reviewNote && (
                        <div
                          className={`mt-3 p-3 rounded-lg text-xs ${
                            isApproved
                              ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                              : 'bg-red-100/70 text-red-900 border border-red-200'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>Review Note from {req.reviewedByName || 'Faculty'}:</span>
                            <span className="text-[10px] opacity-75 font-normal">
                              {req.reviewedAt
                                ? new Date(req.reviewedAt).toLocaleDateString()
                                : ''}
                            </span>
                          </div>
                          <p className="mt-0.5 italic">{req.reviewNote}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
