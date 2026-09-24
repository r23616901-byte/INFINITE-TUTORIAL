import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { getLeaveRequestsApi, reviewLeaveRequestApi } from '../../services/leaveService';
import { LeaveRequest } from '../../types/leave';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Search,
  Check,
  X,
  FileText,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ReviewLeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('ALL');

  // Review Modal State
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [decisionAction, setDecisionAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadLeaves = async () => {
    try {
      setIsLoading(true);
      const data = await getLeaveRequestsApi();
      setLeaves(data);
    } catch (err) {
      console.error('Failed to load leave requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const openReviewModal = (req: LeaveRequest, action: 'APPROVED' | 'REJECTED') => {
    setSelectedRequest(req);
    setDecisionAction(action);
    setReviewNote(
      action === 'APPROVED'
        ? 'Sanctioned. Please collect notes from classmates upon returning.'
        : 'Leave cannot be sanctioned due to scheduled internal tests.'
    );
  };

  const handleConfirmDecision = async () => {
    if (!selectedRequest) return;

    try {
      setIsSubmitting(true);
      const updated = await reviewLeaveRequestApi(selectedRequest.id, {
        status: decisionAction,
        reviewNote: reviewNote.trim() || undefined,
      });

      // Update state locally
      setLeaves((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setNotification({
        type: 'success',
        message: `Leave request for ${selectedRequest.studentName} marked as ${decisionAction}. Parent has been notified.`,
      });
      setSelectedRequest(null);

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update leave request status',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered requests
  const filteredLeaves = leaves.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (batchFilter !== 'ALL' && !l.batchName.toLowerCase().includes(batchFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const sName = l.studentName.toLowerCase();
      const sRoll = l.studentRoll.toLowerCase();
      const sReason = l.reason.toLowerCase();
      if (!sName.includes(q) && !sRoll.includes(q) && !sReason.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const pendingCount = leaves.filter((l) => l.status === 'PENDING').length;
  const approvedCount = leaves.filter((l) => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter((l) => l.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <FileCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Review Student Leave Requests
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                FACULTY & ADMIN PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sanction or decline student absence submissions. Review medical slips and notify parents in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadLeaves}
            isLoading={isLoading}
            leftIcon={<Clock className="w-3.5 h-3.5" />}
          >
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Pending Requests"
          value={pendingCount.toString()}
          subtitle="Action Required by Faculty"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          badge={pendingCount > 0 ? `${pendingCount} Urgent` : 'Clear'}
          badgeVariant={pendingCount > 0 ? 'amber' : 'emerald'}
          isLoading={isLoading}
        />
        <StatCard
          title="Approved Leaves"
          value={approvedCount.toString()}
          subtitle="Sanctioned Excused Absences"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badge="Authorized"
          badgeVariant="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="Rejected Requests"
          value={rejectedCount.toString()}
          subtitle="Declined Submissions"
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          badge="Declined"
          badgeVariant="slate"
          isLoading={isLoading}
        />
      </div>

      {/* Filter and Search Bar */}
      <Card
        title="Leave Requests Approval Desk"
        subtitle={`Showing ${filteredLeaves.length} of ${leaves.length} total applications`}
        headerAction={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    statusFilter === st
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' && 'All Requests'}
                  {st === 'PENDING' && (
                    <>
                      <span>🟡 Pending</span>
                      {pendingCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                          {pendingCount}
                        </span>
                      )}
                    </>
                  )}
                  {st === 'APPROVED' && '🟢 Approved'}
                  {st === 'REJECTED' && '🔴 Rejected'}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <div className="mb-5 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or reason (e.g. Rahul, Medical)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="w-full sm:w-56 border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-700"
          >
            <option value="ALL">All Batches</option>
            <option value="Batch A">Class 10th CBSE - Batch A</option>
            <option value="Batch B">Class 10th CBSE - Batch B</option>
            <option value="Class 9">Class 9th State Batches</option>
          </select>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-4 py-4">
            <SkeletonBlock height="90px" />
            <SkeletonBlock height="90px" />
            <SkeletonBlock height="90px" />
          </div>
        ) : filteredLeaves.length === 0 ? (
          <EmptyState
            title="No leave requests found"
            description={
              leaves.length === 0
                ? "All student leave applications are reviewed."
                : "No leave requests match your selected status or search filter."
            }
            icon={<FileCheck className="w-8 h-8 text-emerald-500 stroke-[1.5]" />}
            compact
          />
        ) : (
          <div className="space-y-4">
            {filteredLeaves.map((req) => {
              const isPending = req.status === 'PENDING';
              const isApproved = req.status === 'APPROVED';

              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPending
                      ? 'border-amber-300 bg-amber-50/25 shadow-xs'
                      : isApproved
                      ? 'border-emerald-200 bg-emerald-50/15'
                      : 'border-red-200 bg-red-50/15'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 text-sm flex-shrink-0">
                        {req.studentName ? (
                          req.studentName
                            .split(' ')
                            .map((p: string) => p[0])
                            .slice(0, 2)
                            .join('')
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-slate-900 text-sm">
                            {req.studentName}
                          </h3>
                          <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold border border-slate-200">
                            {req.studentRoll}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {req.className} &bull; {req.batchName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>
                            Submitted by:{' '}
                            <strong className="text-slate-700">
                              {req.parentName || 'Parent'}
                            </strong>
                          </span>
                          <span>&bull;</span>
                          <span>
                            Applied:{' '}
                            {new Date(req.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Review Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 ${
                          isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : isApproved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {isPending ? (
                          <>
                            <Clock className="w-3.5 h-3.5" /> PENDING REVIEW
                          </>
                        ) : isApproved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> SANCTIONED / APPROVED
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> REJECTED / DECLINED
                          </>
                        )}
                      </span>

                      {/* Action buttons */}
                      {isPending ? (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            onClick={() => openReviewModal(req, 'APPROVED')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => openReviewModal(req, 'REJECTED')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            onClick={() =>
                              openReviewModal(
                                req,
                                isApproved ? 'REJECTED' : 'APPROVED'
                              )
                            }
                            className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold px-2 py-1"
                          >
                            Change Decision
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Leave Details Body */}
                  <div className="pt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Leave Date & Session
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {req.fromDate === req.toDate
                            ? req.fromDate
                            : `${req.fromDate} → ${req.toDate}`}
                        </span>
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-800">
                        {req.session === 'BOTH' ? 'Full Day (Morning & Eve)' : req.session}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Category / Reason
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {req.reason}
                      </div>
                      {req.attachmentUrl && (
                        <a
                          href={req.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          <FileText className="w-3 h-3" /> Medical Attachment
                        </a>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Parent Description & Context
                      </div>
                      <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-slate-200/70 italic">
                        "{req.description}"
                      </p>
                    </div>
                  </div>

                  {/* Reviewer Note Display if Processed */}
                  {!isPending && req.reviewNote && (
                    <div
                      className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                        isApproved
                          ? 'bg-emerald-100/60 text-emerald-900 border border-emerald-200'
                          : 'bg-red-100/60 text-red-900 border border-red-200'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-600" />
                      <div>
                        <div className="font-extrabold">
                          Decision Note from {req.reviewedByName || 'Authorized Faculty'}:
                        </div>
                        <p className="mt-0.5 font-medium">{req.reviewNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Review Modal Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                    decisionAction === 'APPROVED' ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  {decisionAction === 'APPROVED' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {decisionAction === 'APPROVED' ? 'Sanction Leave' : 'Decline Leave'}:{' '}
                  {selectedRequest.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Dates Requested:</span>
                  <span className="text-slate-900 font-bold">
                    {selectedRequest.fromDate === selectedRequest.toDate
                      ? selectedRequest.fromDate
                      : `${selectedRequest.fromDate} → ${selectedRequest.toDate}`}{' '}
                    ({selectedRequest.session})
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Reason:</span>
                  <span className="text-slate-900 font-bold">
                    {selectedRequest.reason}
                  </span>
                </div>
                <div className="text-slate-600 pt-1 border-t border-slate-200">
                  <span className="font-semibold text-slate-500">Note: </span>
                  {selectedRequest.description}
                </div>
              </div>

              {/* Action Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Change Decision Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionAction('APPROVED')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      decisionAction === 'APPROVED'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Check className="w-4 h-4" /> Sanction / Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionAction('REJECTED')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      decisionAction === 'REJECTED'
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <X className="w-4 h-4" /> Decline / Reject
                  </button>
                </div>
              </div>

              {/* Review Note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reviewer Feedback / Note to Parent:
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Enter remarks visible to the student and parent..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </Button>
              <Button
                variant={decisionAction === 'APPROVED' ? 'primary' : 'danger'}
                size="sm"
                isLoading={isSubmitting}
                onClick={handleConfirmDecision}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Confirm {decisionAction === 'APPROVED' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
