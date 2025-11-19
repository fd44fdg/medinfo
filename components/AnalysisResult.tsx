import React from 'react';
import { StethoscopeIcon, AlertCircleIcon, ActivityIcon } from './Icons';
import { MedicalAnalysis, Indicator } from '../services/gemini';

interface AnalysisResultProps {
  result: MedicalAnalysis | null;
  error: string | null;
}

const StatusBadge = ({ status }: { status: Indicator['status'] }) => {
  const colors = {
    'Normal': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Warning': 'bg-amber-100 text-amber-700 border-amber-200',
    'Critical': 'bg-red-100 text-red-700 border-red-200',
  };

  const labels = {
    'Normal': '正常',
    'Warning': '需注意',
    'Critical': '异常',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || colors['Normal']}`}>
      {labels[status] || status}
    </span>
  );
};

const IndicatorCard: React.FC<{ item: Indicator }> = ({ item }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-slate-800 text-sm truncate pr-2" title={item.name}>{item.name}</h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="mb-3">
      <span className="text-2xl font-bold text-slate-900">{item.value}</span>
      <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
    </div>
    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
      {item.interpretation}
    </p>
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-fade-in mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { summary, indicators } = result;
  const abnormalCount = indicators.filter(i => i.status !== 'Normal').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Visualization Grid */}
      {indicators && indicators.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <ActivityIcon className="w-5 h-5 mr-2 text-emerald-600" />
            关键指标可视化
            {abnormalCount > 0 && (
              <span className="ml-3 text-xs font-normal text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                发现 {abnormalCount} 项需关注
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {indicators.map((item, index) => (
              <IndicatorCard key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Friendly Analysis Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-4 border-b border-emerald-100 flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600 ring-1 ring-emerald-100">
            <StethoscopeIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900">AI 深度解读</h3>
            <p className="text-xs text-emerald-600/80">基于 {indicators.length} 项数据分析</p>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="prose prose-emerald max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center flex items-center justify-center">
            <AlertCircleIcon className="w-3 h-3 mr-1" />
            AI 解读仅供参考，不能替代专业医生的诊断。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;