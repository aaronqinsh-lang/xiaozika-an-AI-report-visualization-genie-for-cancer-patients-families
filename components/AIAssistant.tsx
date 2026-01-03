
import React, { useRef } from 'react';
import { Mic, PhoneCall, X, Heart, MessageSquare, Camera } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  isLive: boolean;
  onToggleLive: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, onClose, isLive, onToggleLive, onFileUpload 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A001A] p-8 text-white flex flex-col animate-in zoom-in-95 duration-500 overflow-hidden">
      <div className="flex justify-between items-center mb-16 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-white/10">
            <Heart className="fill-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">紫康 AI 助手</h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">MemOS Persistent Context</p>
          </div>
        </div>
        <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-white/10"><X size={24} /></button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
        <div className="relative">
          {/* 呼吸灯动效 */}
          <div className={`absolute inset-[-60px] bg-purple-600 rounded-full blur-[80px] opacity-20 transition-all duration-1000 ${isLive ? 'scale-150 animate-pulse' : 'scale-0'}`} />
          <button 
            onClick={onToggleLive}
            className={`w-40 h-40 rounded-full shadow-2xl flex items-center justify-center border-[6px] border-white/10 transition-all active:scale-95 z-10 relative ${isLive ? 'bg-white text-purple-900' : 'bg-purple-600 text-white'}`}
          >
            {isLive ? <PhoneCall size={64} className="animate-bounce" /> : <Mic size={64} />}
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold tracking-tight">
            {isLive ? "正在倾听您的需求..." : "点击开启实时语音讨论"}
          </p>
          <p className="text-sm text-purple-400 font-medium">深度关联您的历史病情与最新化验趋势</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-auto pb-6">
        <button className="py-5 bg-white/5 rounded-3xl font-bold flex items-center justify-center gap-3 border border-white/5 hover:bg-white/10 transition">
          <MessageSquare size={20} /> 文字输入
        </button>
        <label className="py-5 bg-white/5 rounded-3xl font-bold flex items-center justify-center gap-3 border border-white/5 hover:bg-white/10 transition cursor-pointer">
          <Camera size={20} /> 拍照解析
          <input type="file" className="hidden" onChange={onFileUpload} />
        </label>
      </div>
    </div>
  );
};
