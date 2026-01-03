
import React, { useState, useEffect } from 'react';
import { Mic, PhoneCall, X, Heart, MessageSquare, Camera, Sparkles } from 'lucide-react';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLive: boolean;
  onToggleLive: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({ 
  isOpen, onClose, isLive, onToggleLive, onFileUpload 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A001A] p-8 text-white flex flex-col animate-in zoom-in-95 duration-500 overflow-hidden">
      {/* 顶部状态栏 */}
      <div className="flex justify-between items-center mb-16 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-white/10 relative">
             <Heart className="fill-white" size={24} />
             {isLive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A001A]" />}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">小紫卡 AI</h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} /> 实时健康分析
            </p>
          </div>
        </div>
        <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-white/10 active:scale-90 transition">
          <X size={24} />
        </button>
      </div>

      {/* 核心交互区 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
        <div className="relative">
          {/* 呼吸灯效果层 */}
          <div className={`absolute inset-[-80px] bg-purple-600 rounded-full blur-[100px] opacity-30 transition-all duration-1000 ${isLive ? 'scale-150 animate-pulse' : 'scale-0 opacity-0'}`} />
          <div className={`absolute inset-[-40px] bg-indigo-500 rounded-full blur-[60px] opacity-20 transition-all duration-1000 delay-150 ${isLive ? 'scale-125 animate-pulse' : 'scale-0 opacity-0'}`} />
          
          <button 
            onClick={onToggleLive}
            className={`w-44 h-44 rounded-full shadow-2xl flex items-center justify-center border-[8px] border-white/10 transition-all active:scale-95 z-10 relative ${isLive ? 'bg-white text-purple-900 scale-105' : 'bg-purple-600 text-white'}`}
          >
            {isLive ? <PhoneCall size={72} className="animate-bounce" /> : <Mic size={72} />}
          </button>
        </div>

        <div className="space-y-3 px-10">
          <p className="text-2xl font-black tracking-tight">
            {isLive ? "正在为您分析..." : "开启实时语音讨论"}
          </p>
          <p className="text-sm text-purple-400/80 font-medium leading-relaxed">
            我已同步您最近 3 个月的化验趋势，<br/>您可以随时提问或上传新报告。
          </p>
        </div>
      </div>

      {/* 底部操作区 */}
      <div className="grid grid-cols-2 gap-5 mt-auto pb-6">
        <button className="py-5 bg-white/5 rounded-[2rem] font-bold flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-white/10 transition active:scale-95">
          <MessageSquare size={24} className="text-purple-400" />
          <span className="text-xs">文字交谈</span>
        </button>
        <label className="py-5 bg-white/5 rounded-[2rem] font-bold flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-white/10 transition cursor-pointer active:scale-95">
          <Camera size={24} className="text-indigo-400" />
          <span className="text-xs">拍照识别</span>
          <input type="file" className="hidden" onChange={onFileUpload} accept="image/*" />
        </label>
      </div>
    </div>
  );
};
