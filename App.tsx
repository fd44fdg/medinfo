import React, { useState } from 'react';
import { ActivityIcon } from './components/Icons';
import ReportInput from './components/ReportInput';
import AnalysisResult from './components/AnalysisResult';
import { analyzeMedicalReport, MedicalAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MedicalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string, imageBase64?: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeMedicalReport(text, imageBase64);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-md">
              <ActivityIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">MedInfo-AI</h1>
              <p className="text-xs text-slate-500 hidden sm:block">智能体检报告解读助手</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            看不懂体检报告？
            <span className="text-emerald-600">AI 帮您读</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            就像问老朋友一样简单。拍照上传或输入异常指标，获取可视化解读、风险评估和生活建议。
          </p>
        </div>

        {/* Input Section */}
        <ReportInput onSubmit={handleAnalyze} isLoading={isLoading} />

        {/* Result Section */}
        <AnalysisResult result={result} error={error} />
        
        {/* Features / Footer Grid - Only show when no result is displayed */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <FeatureCard 
              title="拍照识别" 
              description="无需手动输入，直接拍摄体检报告单，AI 自动识别分析。" 
              color="bg-blue-50 text-blue-700 border-blue-100"
            />
            <FeatureCard 
              title="可视化解读" 
              description="关键指标通过卡片直观展示，异常项一目了然。" 
              color="bg-amber-50 text-amber-700 border-amber-100"
            />
            <FeatureCard 
              title="生活建议" 
              description="提供切实可行的饮食和运动建议，助您改善健康指标。" 
              color="bg-emerald-50 text-emerald-700 border-emerald-100"
            />
          </div>
        )}
      </main>
    </div>
  );
};

// Simple helper component for the feature grid
const FeatureCard = ({ title, description, color }: { title: string; description: string; color: string }) => (
  <div className={`p-6 rounded-2xl ${color} border bg-opacity-50 shadow-sm hover:shadow-md transition-shadow`}>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm opacity-90 leading-relaxed">{description}</p>
  </div>
);

export default App;