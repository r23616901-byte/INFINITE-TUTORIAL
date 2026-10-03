import React, { useState, useEffect } from 'react';
import {
  Award,
  AlertTriangle,
  RefreshCw,
  Info,
} from 'lucide-react';
import scorecardService from '../../services/scorecardService';
import { StudentScorecard } from '../../types/scorecard';
import { ScorecardViewer } from '../shared/ScorecardViewer';

export const ParentMarksPage: React.FC = () => {
  const [scorecard, setScorecard] = useState<StudentScorecard | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const scorecardData = await scorecardService.getMyChildScorecard();
      setScorecard(scorecardData);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load scorecard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Academic Scorecards & Marks
              </h1>
              <p className="text-sm text-gray-500">
                Official student scorecard across Physics, Chemistry, Biology & Mathematics with verified test papers and evaluations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
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

      {/* COMPREHENSIVE 4-SUBJECT SCORECARD */}
      {loading && !scorecard ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#155EEF] animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">Compiling 4-Subject Scorecard...</h3>
          <p className="text-xs text-gray-500 mt-1">Aggregating Physics, Chemistry, Biology and Mathematics results.</p>
        </div>
      ) : scorecard ? (
        <ScorecardViewer scorecard={scorecard} onRefresh={loadData} loading={loading} />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-900">Scorecard Pending</h3>
          <p className="text-xs text-gray-400 mt-1">Academic records are currently being compiled by the school faculty.</p>
        </div>
      )}
    </div>
  );
};

export default ParentMarksPage;
