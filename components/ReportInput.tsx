import React, { useState, useRef } from 'react';
import { SendIcon, UploadIcon, XIcon, ImageIcon } from './Icons';

interface ReportInputProps {
  onSubmit: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
}

const ReportInput: React.FC<ReportInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Keep the full data URL for display, extract base64 for API later if needed
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !selectedImage) return;
    
    // Extract base64 data part if image exists
    let imageBase64Data: string | undefined;
    if (selectedImage) {
      imageBase64Data = selectedImage.split(',')[1];
    }
    
    onSubmit(text, imageBase64Data);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 transition-all hover:shadow-md">
      <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center">
        <span className="bg-emerald-100 text-emerald-700 p-1 rounded mr-2">Step 1</span>
        输入报告内容或上传图片
      </label>
      
      {/* Image Preview Area */}
      {selectedImage && (
        <div className="mb-4 relative inline-block">
          <div className="relative rounded-xl overflow-hidden border-2 border-emerald-100 shadow-sm group">
            <img 
              src={selectedImage} 
              alt="Report preview" 
              className="h-32 w-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={removeImage}
                className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <textarea
          className="w-full min-h-[120px] p-4 pr-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-y outline-none placeholder-slate-400"
          placeholder="您可以直接粘贴文字，或者点击下方按钮上传体检报告照片..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        
        {/* Floating Actions within/below textarea */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex space-x-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-slate-200 hover:border-emerald-200"
            >
              <UploadIcon className="w-4 h-4" />
              <span>上传图片</span>
            </button>
            <button
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-slate-200 hover:border-emerald-200"
              onClick={() => setText("窦性心律不齐，谷丙转氨酶 65 U/L")}
            >
              <span className="text-xs">试试示例</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || (!text.trim() && !selectedImage)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 shadow-sm
              ${isLoading || (!text.trim() && !selectedImage)
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md transform hover:-translate-y-0.5'
              }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>分析中...</span>
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4" />
                <span>开始解读</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportInput;