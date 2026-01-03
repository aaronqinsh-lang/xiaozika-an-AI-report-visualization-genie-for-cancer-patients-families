
import React from 'react';
import { Heart, User, Layout as LayoutIcon, History, Wrench, Settings, Mic, Sparkles } from 'lucide-react';

export const Header: React.FC<{ seniorMode: boolean }> = ({ seniorMode }) => (
  <header className={`px-6 ${seniorMode ? 'pt-14 pb-8' : 'pt-12 pb-6'} bg-white/70 backdrop-blur-2xl sticky top-0 z-40 flex justify-between items-center border-b border-purple-50/50`}>
    <div className="flex items-center gap-3">
      <div className={`bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 ${seniorMode ? 'w-16 h-16' : 'w-11 h-11'}`}>
        <Heart className="text-white fill-white" size={seniorMode ? 32 : 22} />
      </div>
      <div>
        <h1 className={`${seniorMode ? 'text-4xl' : 'text-2xl'} font-black text-purple-900 tracking-tighter`}>小紫卡</h1>
        <p className={`${seniorMode ? 'text-base' : 'text-[10px]'} font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1`}>
          <Sparkles size={seniorMode ? 16 : 10} /> 智慧病情助手
        </p>
      </div>
    </div>
    <button className={`${seniorMode ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-inner overflow-hidden active:scale-95 transition-all`}>
      <User size={seniorMode ? 36 : 24} />
    </button>
  </header>
);

export const Dock: React.FC<{ activeTab: string, onTabChange: (tab: string) => void, onOpenAI: () => void, seniorMode: boolean }> = ({ activeTab, onTabChange, onOpenAI, seniorMode }) => (
  <nav className="fixed bottom-0 inset-x-0 h-24 bg-white/95 backdrop-blur-3xl border-t border-purple-100 px-6 flex justify-between items-center z-50 shadow-[0_-5px_25px_rgba(0,0,0,0.03)] rounded-none">
    <button onClick={() => onTabChange('monitoring')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'monitoring' ? 'text-purple-600 scale-105' : 'text-gray-400 hover:text-purple-400'}`}>
      <LayoutIcon size={seniorMode ? 40 : 24} />
      <span className={`${seniorMode ? 'text-lg' : 'text-[10px]'} font-bold`}>指标监测</span>
    </button>
    <button onClick={() => onTabChange('archive')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'archive' ? 'text-purple-600 scale-105' : 'text-gray-400 hover:text-purple-400'}`}>
      <History size={seniorMode ? 40 : 24} />
      <span className={`${seniorMode ? 'text-lg' : 'text-[10px]'} font-bold`}>档案管理</span>
    </button>

    <div className="relative -top-8">
      {/* 增强型呼吸灯光圈 */}
      <div className="absolute inset-[-12px] bg-purple-500 blur-2xl rounded-full opacity-30 animate-pulse" />
      <div className="absolute inset-[-4px] bg-indigo-400 blur-xl rounded-full opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
      
      <button 
        onClick={onOpenAI}
        className={`${seniorMode ? 'w-24 h-24' : 'w-20 h-20'} bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-600 rounded-full shadow-[0_10px_35px_rgba(124,58,237,0.5)] flex items-center justify-center border-[6px] border-white active:scale-90 transition-all z-10 relative overflow-hidden group ai-button-breathing`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Mic className="text-white" size={seniorMode ? 48 : 34} />
      </button>
      <style>{`
        @keyframes ai-breathe {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.4)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 25px rgba(124, 58, 237, 0.7)); }
        }
        .ai-button-breathing {
          animation: ai-breathe 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>

    <button onClick={() => onTabChange('tools')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'tools' ? 'text-purple-600 scale-105' : 'text-gray-400 hover:text-purple-400'}`}>
      <Wrench size={seniorMode ? 40 : 24} />
      <span className={`${seniorMode ? 'text-lg' : 'text-[10px]'} font-bold`}>常用工具</span>
    </button>
    <button onClick={() => onTabChange('settings')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'settings' ? 'text-purple-600 scale-105' : 'text-gray-400 hover:text-purple-400'}`}>
      <Settings size={seniorMode ? 40 : 24} />
      <span className={`${seniorMode ? 'text-lg' : 'text-[10px]'} font-bold`}>设置中心</span>
    </button>
  </nav>
);

export const FullscreenLoader: React.FC<{ label: string }> = ({ label }) => (
  <div className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
    <div className="relative mb-12">
      <div className="w-28 h-28 border-[8px] border-purple-50 border-t-purple-600 rounded-full animate-spin shadow-inner" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Heart className="text-purple-600 fill-purple-600 animate-pulse" size={32} />
      </div>
    </div>
    <div className="text-center space-y-3">
      <p className="text-3xl font-black text-purple-900 tracking-tight">{label}</p>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">正在深度分析数据并同步云端仓库</p>
    </div>
  </div>
);
