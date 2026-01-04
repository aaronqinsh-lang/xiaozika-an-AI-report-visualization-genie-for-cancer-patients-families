import React, { useState, useEffect, useRef } from 'react';
import { Mic, PhoneCall, X, Heart, MessageSquare, Camera, Sparkles, Send, ChevronLeft, Loader2 } from 'lucide-react';
import { getAssistantResponse } from '../services/geminiService';
import { UserProfile, ChatMessage } from '../types';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLive: boolean;
  onToggleLive: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userProfile: UserProfile;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({ 
  isOpen, onClose, isLive, onToggleLive, onFileUpload, userProfile 
}) => {
  const [viewMode, setViewMode] = useState<'hub' | 'chat'>('hub');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: `你好，${userProfile.name}。我是你的抗癌管家，今天有什么我可以帮你的吗？` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await getAssistantResponse(userMsg, '通用咨询', userProfile, messages);
      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: '由于信号不佳，消息发送失败了，请稍后再试。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A001A] text-white flex flex-col animate-in zoom-in-95 duration-500 overflow-hidden">
      {/* 顶部导航栏 */}
      <div className="flex justify-between items-center p-8 mt-4">
        <div className="flex items-center gap-4">
          {viewMode === 'chat' ? (
            <button 
              onClick={() => setViewMode('hub')}
              className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-white/10 relative">
              <Heart className="fill-white" size={24} />
              {isLive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A001A]" />}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {viewMode === 'chat' ? '咨询对话' : '小紫卡 AI'}
            </h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} /> {isLive ? '正在实时通话' : '智慧病情助手'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-white/10 active:scale-90 transition">
          <X size={24} />
        </button>
      </div>

      {viewMode === 'hub' ? (
        <>
          {/* 核心交互区 (HUB 模式) */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
            <div className="relative">
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

          {/* 底部功能按钮 */}
          <div className="grid grid-cols-2 gap-5 p-8 pb-12">
            <button 
              onClick={() => setViewMode('chat')}
              className="py-6 bg-white/5 rounded-[2.5rem] font-bold flex flex-col items-center justify-center gap-3 border border-white/5 hover:bg-white/10 transition active:scale-95 group"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={24} className="text-purple-400" />
              </div>
              <span className="text-xs uppercase tracking-widest font-black">文字交谈</span>
            </button>
            <label className="py-6 bg-white/5 rounded-[2.5rem] font-bold flex flex-col items-center justify-center gap-3 border border-white/5 hover:bg-white/10 transition cursor-pointer active:scale-95 group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera size={24} className="text-indigo-400" />
              </div>
              <span className="text-xs uppercase tracking-widest font-black">拍照识别</span>
              <input type="file" className="hidden" onChange={onFileUpload} accept="image/*" />
            </label>
          </div>
        </>
      ) : (
        <>
          {/* 对话列表区 (CHAT 模式) */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-8 py-4 space-y-8 no-scrollbar scroll-smooth pb-20"
          >
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`max-w-[90%] p-6 rounded-[2.2rem] text-[15px] leading-[1.6] whitespace-pre-wrap tracking-wide ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-tr-lg shadow-xl shadow-purple-900/20' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-lg font-medium'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-5 rounded-[2.2rem] rounded-tl-lg flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-purple-400" />
                  <span className="text-xs text-purple-400 font-black uppercase tracking-[0.2em]">正在分析化验趋势...</span>
                </div>
              </div>
            )}
          </div>

          {/* 输入框区 - 无边框设计 */}
          <div className="px-8 pb-12 pt-4 bg-[#0A001A]/90 backdrop-blur-3xl border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/[0.04] p-2 rounded-[2.5rem] transition-all hover:bg-white/[0.06] group focus-within:bg-white/[0.08]">
              <input 
                type="text"
                placeholder="在此输入您的疑问..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-base font-medium placeholder:text-gray-600 focus:outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all disabled:opacity-30 disabled:bg-gray-800"
              >
                <Send size={22} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};