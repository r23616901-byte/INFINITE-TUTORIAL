import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
  LogOut,
  Filter,
} from 'lucide-react';
import homeReachService from '../../services/homeReachService';
import { HomeReachRecord, HomeReachStatus } from '../../types/homeReach';

export const TeacherHomeReachPage: React.FC = () => {
  const [records, setRecords] = useState<HomeReachRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Departure Form State
  const [selectedBatch, setSelectedBatch] = useState('batch-10a-evening');
  const [selectedSession, setSelectedSession] = useState('EVENING');
  const [classEndedTime, setClassEndedTime] = useState('7:30 PM');
  const [departureNotes, setDepartureNotes] = useState('Class concluded on schedule.');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Filter State
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadRecords = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await homeReachService.getRecords({
        status: filterStatus === 'ALL' ? undefined : (filterStatus as HomeReachStatus),
        search: searchQuery.trim() || undefined,
      });
      setRecords(data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load transit records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [filterStatus]);

  const handleRecordBatchDeparture = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      const result = await homeReachService.recordClassEnded({
        batchId: selectedBatch,
        session: selectedSession,
        classEndedTime: classEndedTime.trim() || '7:30 PM',
        studentIds: selectedStudentIds.length > 0 ? selectedStudentIds : undefined,
        notes: departureNotes.trim(),
      });

      setSuccessMsg(
        `Class dismissal recorded successfully! Departure logged for ${result.length} student(s) at ${classEndedTime}.`
      );
      setSelectedStudentIds([]);
      await loadRecords();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to record batch departure.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REACHED_HOME':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Reached Home
          </span>
        );
      case 'LEFT_TUITION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 animate-pulse">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            In Transit
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
            Delayed Alert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            In Class
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Class Dismissal & Home-Reach Desk
              </h1>
              <p className="text-sm text-gray-500">
                Record student departures when tuition concludes and monitor transit statuses.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={loadRecords}
          disabled={loading}
          className="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 text-sm">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 text-sm">Dismiss</button>
        </div>
      )}

      {/* Quick Dismissal Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 flex items-center mb-4">
          <Clock className="w-5 h-5 text-indigo-600 mr-2" />
          Record Class Ended / Batch Departure
        </h2>

        <form onSubmit={handleRecordBatchDeparture} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Select Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="batch-10a-evening">10A Evening (CBSE)</option>
                <option value="batch-10a-morning">10-A Morning (CBSE)</option>
                <option value="batch-10b-evening">10-B Evening (CBSE)</option>
                <option value="batch-9a-evening">9-A Evening (State)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Session
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="EVENING">Evening Session</option>
                <option value="MORNING">Morning Session</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Class Ended Time
              </label>
              <input
                type="text"
                value={classEndedTime}
                onChange={(e) => setClassEndedTime(e.target.value)}
                placeholder="e.g. 7:30 PM"
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Departure Notes
              </label>
              <input
                type="text"
                value={departureNotes}
                onChange={(e) => setDepartureNotes(e.target.value)}
                placeholder="e.g. Class ended on schedule"
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              * Applies to all students in the batch. Parents will receive an automated departure alert.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {submitting ? 'Recording...' : 'End Class & Mark Departure'}
            </button>
          </div>
        </form>
      </div>

      {/* Transit Monitoring Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Transit Monitor</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadRecords()}
                className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 w-48"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="LEFT_TUITION">In Transit</option>
              <option value="REACHED_HOME">Reached Home</option>
              <option value="DELAYED">Delayed Alert</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Ended</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reached Home</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold text-gray-900">{rec.studentName}</div>
                    <div className="text-xs text-gray-500 font-mono">{rec.studentRoll}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <div className="font-medium text-gray-800">{rec.batchName}</div>
                    <div className="text-gray-400 capitalize">{rec.session.toLowerCase()} • {rec.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-900">
                    {rec.classEndedTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-emerald-700">
                    {rec.reachedHomeTime || (
                      <span className="text-amber-600 font-normal italic">In transit...</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                    {rec.transitMinutes ? (
                      <span className="font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {rec.transitMinutes} mins
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
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

export default TeacherHomeReachPage;
