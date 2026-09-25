import React, { useState, useEffect } from 'react';
import {
  Home,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import homeReachService from '../../services/homeReachService';
import { HomeReachRecord } from '../../types/homeReach';

export const ParentTuitionReachPage: React.FC = () => {
  const [records, setRecords] = useState<HomeReachRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await homeReachService.getParentChildSummary();
      setRecords(data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load home-reach updates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const latestRecord = records[0];

  const handleConfirmArrival = async (recordId?: string) => {
    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await homeReachService.confirmReachedHome({
        recordId: recordId || latestRecord?.id,
        studentId: latestRecord?.studentId,
        reachedHomeTime: customTime.trim() || undefined,
        notes: remarks.trim() || undefined,
      });

      setSuccessMsg(`Successfully confirmed! ${res.studentName} is safely marked as Reached Home (${res.reachedHomeTime || 'Now'}).`);
      setRemarks('');
      setCustomTime('');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to confirm arrival.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REACHED_HOME':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Reached Home
          </span>
        );
      case 'LEFT_TUITION':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            In Transit / Left Tuition
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Transit Delayed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            In Class
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Tuition & Home-Reach Updates
              </h1>
              <p className="text-sm text-gray-500">
                Live departure and arrival tracking to keep parents informed and assured.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800 text-sm">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 hover:text-rose-800 text-sm">Dismiss</button>
        </div>
      )}

      {/* PROMINENT LIVE STATUS CARD (Fulfilling Prompt Example) */}
      {latestRecord ? (
        <div className="bg-gradient-to-br from-white to-indigo-50/40 rounded-2xl border border-[#DCE5F2] shadow-sm overflow-hidden p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE5F2]/80 pb-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#155EEF] text-white flex items-center justify-center font-bold text-xl shadow-md">
                {latestRecord.studentName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-900">{latestRecord.studentName}</h2>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono font-medium">
                    {latestRecord.studentRoll}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                  <span className="font-medium text-[#1048B5]">{latestRecord.batchName}</span>
                  <span>•</span>
                  <span>{latestRecord.session} Session</span>
                  <span>•</span>
                  <span>{latestRecord.date}</span>
                </div>
              </div>
            </div>
            <div>
              {getStatusBadge(latestRecord.status)}
            </div>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5">
            <div className="bg-white/80 p-4 rounded-xl border border-gray-100">
              <span className="text-xs font-medium text-gray-500 block">Class Ended</span>
              <span className="text-lg font-bold text-gray-900 mt-1 block">
                {latestRecord.classEndedTime}
              </span>
              <span className="text-xs text-gray-400 mt-0.5 block">Logged by faculty</span>
            </div>

            <div className="bg-white/80 p-4 rounded-xl border border-gray-100">
              <span className="text-xs font-medium text-gray-500 block">Reached Home</span>
              <span className="text-lg font-bold text-emerald-700 mt-1 block">
                {latestRecord.reachedHomeTime || (latestRecord.status === 'LEFT_TUITION' ? 'En Route...' : 'Pending')}
              </span>
              <span className="text-xs text-gray-400 mt-0.5 block">
                {latestRecord.confirmedByName || 'Parent confirmation'}
              </span>
            </div>

            <div className="bg-white/80 p-4 rounded-xl border border-gray-100">
              <span className="text-xs font-medium text-gray-500 block">Transit Duration</span>
              <span className="text-lg font-bold text-[#1048B5] mt-1 block">
                {latestRecord.transitMinutes ? `${latestRecord.transitMinutes} mins` : '—'}
              </span>
              <span className="text-xs text-emerald-600 mt-0.5 block">
                {latestRecord.transitMinutes ? 'Standard commute' : 'Tracking in progress'}
              </span>
            </div>

            <div className="bg-white/80 p-4 rounded-xl border border-gray-100">
              <span className="text-xs font-medium text-gray-500 block">Current Status</span>
              <span className="text-lg font-bold text-gray-900 mt-1 block capitalize">
                {latestRecord.status.replace('_', ' ').toLowerCase()}
              </span>
              <span className="text-xs text-gray-400 mt-0.5 block">Infinite Tutorial Safety</span>
            </div>
          </div>

          {/* Real-time Journey Progress Steps */}
          <div className="pt-4 border-t border-[#DCE5F2]/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Tuition to Home Journey Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-emerald-200">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">1. Tuition Class Dismissed</p>
                  <p className="text-xs text-gray-500 mt-0.5">Time: {latestRecord.classEndedTime}</p>
                  <p className="text-[11px] text-gray-400">Teacher: {latestRecord.recordedByName || 'Staff'}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex items-start space-x-3 p-3 bg-white rounded-lg border ${
                latestRecord.status === 'LEFT_TUITION' ? 'border-amber-300 ring-2 ring-amber-100' : 'border-emerald-200'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  latestRecord.status === 'LEFT_TUITION' ? 'bg-amber-100 text-amber-700 animate-bounce' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {latestRecord.status === 'LEFT_TUITION' ? '→' : '✓'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">2. In-Transit Safety Watch</p>
                  <p className="text-xs text-gray-500 mt-0.5">Departed tuition premises</p>
                  <p className="text-[11px] text-gray-400">Automated monitor active</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex items-start space-x-3 p-3 bg-white rounded-lg border ${
                latestRecord.status === 'REACHED_HOME' ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-200 opacity-60'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  latestRecord.status === 'REACHED_HOME' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {latestRecord.status === 'REACHED_HOME' ? '✓' : '3'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">3. Reached Home Safely</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {latestRecord.reachedHomeTime ? `Time: ${latestRecord.reachedHomeTime}` : 'Awaiting parent confirmation'}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {latestRecord.transitMinutes ? `Transit: ${latestRecord.transitMinutes} mins` : 'Safety check complete'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action to confirm arrival if in transit or to update */}
          <div className="mt-6 pt-5 border-t border-[#DCE5F2]/60 bg-white/70 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Parent 1-Tap Arrival Confirmation
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Confirm when {latestRecord.studentName} arrives at your doorstep to notify tuition staff.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. 7:55 PM (Optional)"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-36 text-xs px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-[#155EEF] focus:border-[#155EEF]"
                />
                <button
                  onClick={() => handleConfirmArrival(latestRecord.id)}
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  {submitting ? 'Confirming...' : 'Confirm Reached Home'}
                </button>
              </div>
            </div>

            {latestRecord.notes && (
              <div className="mt-3 text-xs bg-gray-50 text-gray-600 p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700">Remarks / Log Note:</span> {latestRecord.notes}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
          <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">No home-reach departure records found for your child yet.</p>
          <p className="text-xs text-gray-400 mt-1">Once class ends, departure information will appear here immediately.</p>
        </div>
      )}

      {/* History Log */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="font-bold text-gray-900 text-sm">Past Tuition Departures & Reach Logs</h3>
          </div>
          <span className="text-xs text-gray-500">{records.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student & Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Ended</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reached Home</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                    <div className="font-medium">{rec.date}</div>
                    <div className="text-gray-500 capitalize">{rec.session.toLowerCase()} session</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                    <div className="font-medium">{rec.studentName}</div>
                    <div className="text-gray-500">{rec.batchName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-900">
                    {rec.classEndedTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-emerald-700">
                    {rec.reachedHomeTime || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                    {rec.transitMinutes ? (
                      <span className="font-medium bg-[#EEF4FF] text-[#1048B5] px-2 py-0.5 rounded">
                        {rec.transitMinutes} mins
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(rec.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParentTuitionReachPage;
