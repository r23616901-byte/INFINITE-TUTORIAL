import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Info,
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import { StudentOverallPerformance } from '../../types/analytics';
import { PerformanceAnalysisView } from '../shared/PerformanceAnalysisView';

export const ParentPerformanceGraphsPage: React.FC = () => {
  const [data, setData] = useState<StudentOverallPerformance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await analyticsService.getMyChildAnalytics();
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load performance graphs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Academic Performance & Chapter-Wise Graphs
              </h1>
              <p className="text-sm text-gray-500">
                Visual test-by-test learning curves, chapter mastery bar charts, and attendance correlation.
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
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 text-sm font-medium">
            Dismiss
          </button>
        </div>
      )}

      {loading && !data ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">Loading Performance Analytics...</h3>
          <p className="text-xs text-gray-500 mt-1">Generating subject line graphs and chapter mastery charts.</p>
        </div>
      ) : data ? (
        <PerformanceAnalysisView data={data} onRefresh={loadData} loading={loading} />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-900">Performance Data Unavailable</h3>
          <p className="text-xs text-gray-400 mt-1">
            Academic performance and chapter mastery graphs will appear once sufficient tests are conducted.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentPerformanceGraphsPage;
