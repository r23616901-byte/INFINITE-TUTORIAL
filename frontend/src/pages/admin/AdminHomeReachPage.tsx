import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  RefreshCw,
  PhoneCall,
  Save,
  Home,
} from 'lucide-react';
import homeReachService from '../../services/homeReachService';
import { HomeReachRecord, HomeReachConfig, HomeReachStatus } from '../../types/homeReach';

export const AdminHomeReachPage: React.FC = () => {
  const [records, setRecords] = useState<HomeReachRecord[]>([]);
  const [config, setConfig] = useState<HomeReachConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Config Form State
  const [isEnabled, setIsEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(45);
  const [autoNotifyParents, setAutoNotifyParents] = useState(true);
  const [allowParentSelfConfirm, setAllowParentSelfConfirm] = useState(true);
  const [allowStudentSelfConfirm, setAllowStudentSelfConfirm] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [fetchedConfig, fetchedRecords] = await Promise.all([
        homeReachService.getConfig(),
        homeReachService.getRecords({
          status: statusFilter === 'ALL' ? undefined : (statusFilter as HomeReachStatus),
          search: searchQuery.trim() || undefined,
        }),
      ]);

      setConfig(fetchedConfig);
      setIsEnabled(fetchedConfig.isEnabled);
      setAlertThreshold(fetchedConfig.alertThresholdMinutes);
      setAutoNotifyParents(fetchedConfig.autoNotifyParents);
      setAllowParentSelfConfirm(fetchedConfig.allowParentSelfConfirm);
      setAllowStudentSelfConfirm(fetchedConfig.allowStudentSelfConfirm);

      setRecords(fetchedRecords);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load safety management data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingConfig(true);
      setConfigSuccessMsg('');
      setErrorMsg('');

      const updated = await homeReachService.updateConfig({
        isEnabled,
        alertThresholdMinutes: Number(alertThreshold),
        autoNotifyParents,
        allowParentSelfConfirm,
        allowStudentSelfConfirm,
      });

      setConfig(updated);
      setConfigSuccessMsg('Home-Reach configuration updated and applied system-wide!');
      setTimeout(() => setConfigSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update configuration.');
    } finally {
      setSavingConfig(false);
    }
  };

  // KPIs
  const totalStudents = records.length;
  const reachedHomeCount = records.filter((r) => r.status === 'REACHED_HOME').length;
  const inTransitCount = records.filter((r) => r.status === 'LEFT_TUITION').length;
  const delayedCount = records.filter((r) => r.status === 'DELAYED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REACHED_HOME':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Reached Home
          </span>
        );
      case 'LEFT_TUITION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 animate-pulse">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            In Transit
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Delayed Alert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
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
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Home-Reach Safety & Configuration
              </h1>
              <p className="text-sm text-gray-500">
                Administer transit safety alerts, parental reach confirmations, and system rules.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 text-sm">Dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Departures</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">{totalStudents}</span>
            <span className="text-xs text-gray-400 block mt-0.5">Recorded today</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reached Home</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-700">{reachedHomeCount}</span>
            <span className="text-xs text-emerald-600 block mt-0.5">Safely confirmed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Transit</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-700">{inTransitCount}</span>
            <span className="text-xs text-amber-600 block mt-0.5">Under threshold</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delayed Alerts</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-700">{delayedCount}</span>
            <span className="text-xs text-rose-600 block mt-0.5">Action required</span>
          </div>
        </div>
      </div>

      {/* Admin Feature Configuration Card (Requirement: "This feature should be configurable by Admin") */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">
              Admin Feature Configuration
            </h2>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md font-medium">
            System Control Panel {config?.isEnabled ? '• Active' : '• Disabled'}
          </span>
        </div>

        {configSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
            {configSuccessMsg}
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle 1: Enable Module */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50/60 rounded-xl border border-gray-200">
              <input
                id="module-toggle"
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="module-toggle" className="cursor-pointer">
                <span className="text-sm font-semibold text-gray-900 block">
                  Enable Home-Reach Module
                </span>
                <span className="text-xs text-gray-500 mt-0.5 block">
                  Turn on or off the student departure and home arrival logging system across the tuition center.
                </span>
              </label>
            </div>

            {/* Threshold: Transit Alert Threshold */}
            <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-900 block mb-1">
                Transit Alert Threshold (Minutes)
              </label>
              <div className="flex items-center space-x-3 mt-1.5">
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="w-28 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <span className="text-xs text-gray-500">
                  Flags student as <strong>DELAYED</strong> if arrival is not recorded within this time.
                </span>
              </div>
            </div>

            {/* Toggle 2: Automated Notification */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50/60 rounded-xl border border-gray-200">
              <input
                id="notify-toggle"
                type="checkbox"
                checked={autoNotifyParents}
                onChange={(e) => setAutoNotifyParents(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="notify-toggle" className="cursor-pointer">
                <span className="text-sm font-semibold text-gray-900 block">
                  Parent Departure Notifications
                </span>
                <span className="text-xs text-gray-500 mt-0.5 block">
                  Simulate automatic SMS/WhatsApp notification to parent as soon as teacher marks class ended.
                </span>
              </label>
            </div>

            {/* Toggle 3: Parent Self Confirmation */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50/60 rounded-xl border border-gray-200">
              <input
                id="confirm-toggle"
                type="checkbox"
                checked={allowParentSelfConfirm}
                onChange={(e) => setAllowParentSelfConfirm(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="confirm-toggle" className="cursor-pointer">
                <span className="text-sm font-semibold text-gray-900 block">
                  Allow Parent 1-Tap Arrival Confirmation
                </span>
                <span className="text-xs text-gray-500 mt-0.5 block">
                  Parents can mark their child as reached home directly from the parent portal.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingConfig}
              className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {savingConfig ? 'Saving Settings...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>

      {/* Master Monitoring Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Tuition Departures Master Log
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-48"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="REACHED_HOME">Reached Home</option>
              <option value="LEFT_TUITION">In Transit</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    {rec.status === 'DELAYED' ? (
                      <button
                        onClick={() => alert(`Initiating emergency safety check call for ${rec.studentName}...`)}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200"
                      >
                        <PhoneCall className="w-3 h-3 mr-1" /> Call Parent
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">Monitored</span>
                    )}
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

export default AdminHomeReachPage;
