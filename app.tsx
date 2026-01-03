
import React, { useState, useEffect, useRef } from 'react';
import { Header, Dock, FullscreenLoader } from './components/Layout';
import { DashboardView } from './components/Dashboard';
import { ArchiveView } from './components/Archive';
import { AssistantModal } from './components/AssistantModal';
import { CategoryCard } from './components/CategoryCard';
import { GeminiService, DBService, MemoryService } from './services';
import { INITIAL_RECORDS, CSV_TEMPLATE_HEADER, CSV_TEMPLATE_EXAMPLE } from './constants';
import { MedicalRecord, DashboardWidget, HealthArchive } from './types';
import { float32ToPcm, decodeAudioBuffer, decodeBase64 } from './utils';
import { BookOpen, Pill, Users, Calendar, ArrowRight, ShieldCheck, HeartPulse, LogOut, Info, Share2, Download, Upload, FileSpreadsheet, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [seniorMode, setSeniorMode] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isEditingArchive, setIsEditingArchive] = useState(false);
  
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    { id: 'w1', title: '核心指标趋势', type: 'line', metrics: ['CEA', 'CA19-9'], isPinned: true },
  ]);
  const [archive, setArchive] = useState<HealthArchive>({
    name: "张三",
    age: 65,
    gender: "男",
    diagnosis: "肺腺癌 II 期",
    medicalHistory: "2023年诊断为肺腺癌 II 期。已完成两周期顺铂+培美曲塞化疗，目前处于复查观察期。重点关注 CEA 指标动态变化。",
    doctors: [{ id: 'd1', name: '王教授', specialty: '肿瘤内科/首席专家', contact: '138-0000-0001' }],
    emergency: { name: '张小三', relation: '长子', phone: '139-0000-1234' }
  });

  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 适老关怀模式切换
  const toggleSeniorMode = () => setSeniorMode(!seniorMode);

  // 数据导出功能 (CSV)
  const exportData = () => {
    let csvContent = CSV_TEMPLATE_HEADER + "\n";
    records.forEach(rec => {
      const indicatorsStr = Object.entries(rec.indicators)
        .map(([k, v]) => `${k},${v}`)
        .join(",");
      csvContent += `${rec.date},${rec.type},${indicatorsStr}\n`;
    });
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `小紫卡_导出数据_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 下载 CSV 模版 (闭环第一步)
  const downloadTemplate = () => {
    const csvContent = CSV_TEMPLATE_HEADER + "\n" + CSV_TEMPLATE_EXAMPLE;
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "小紫卡_数据录入模版.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 数据导入功能 (闭环第二步)
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        const newRecords: MedicalRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const [date, type, ...indicators] = line.split(",");
          const indicatorData: any = {};
          for (let j = 0; j < indicators.length; j += 2) {
            if (indicators[j] && indicators[j+1]) {
              indicatorData[indicators[j]] = parseFloat(indicators[j+1]);
            }
          }
          newRecords.push({
            id: `imp-${Date.now()}-${i}`,
            date: date || new Date().toISOString().split('T')[0],
            type: type || 'Blood',
            indicators: indicatorData
          });
        }
        setRecords(prev => [...newRecords, ...prev]);
        alert(`成功载入 ${newRecords.length} 条化验数据`);
      } catch (err) {
        alert("模版解析错误，请确认是否修改了表头结构");
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsText(file);
  };

  // 重置数据 (闭环管理 - 清空或还原)
  const resetData = () => {
    if (confirm("确定要清空所有当前记录并还原为示例数据吗？")) {
      setRecords(INITIAL_RECORDS);
    }
  };

  const toggleLiveAI = async () => {
    if (isLiveActive) {
      sessionRef.current?.close();
      setIsLiveActive(false);
      return;
    }
    try {
      const memory = await MemoryService.searchContext("总结用户近期的化验趋势和重点病情");
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioCtxRef.current = outCtx;

      const callbacks = {
        onopen: async () => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const source = inCtx.createMediaStreamSource(stream);
          const processor = inCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const pcm = float32ToPcm(e.inputBuffer.getChannelData(0));
            sessionRef.current?.sendRealtimeInput({ media: { data: pcm, mimeType: 'audio/pcm;rate=16000' } });
          };
          source.connect(processor);
          processor.connect(inCtx.destination);
          setIsLiveActive(true);
        },
        onmessage: async (msg: any) => {
          const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            const buf = await decodeAudioBuffer(decodeBase64(audio), outCtx);
            const src = outCtx.createBufferSource();
            src.buffer = buf;
            src.connect(outCtx.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
            src.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buf.duration;
          }
        },
        onclose: () => setIsLiveActive(false)
      };

      const systemInstruction = `你是小紫卡AI助手。基于记忆：${memory}。请以专业且温和的态度分析健康状态。`;
      sessionRef.current = await GeminiService.connectLive(callbacks, systemInstruction, 'Kore');
    } catch (e) { 
      setIsLiveActive(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await GeminiService.parseReport(base64, file.type);
        const newRec: MedicalRecord = {
          id: Date.now().toString(),
          date: res.date || new Date().toISOString().split('T')[0],
          type: res.type || 'Blood',
          indicators: res.indicators || {}
        };
        await DBService.saveMedicalRecord(newRec);
        setRecords(prev => [newRec, ...prev]);
        setIsAiOpen(false);
        setActiveTab('monitoring');
      };
      reader.readAsDataURL(file);
    } catch (e) { 
      alert("AI 解析失败，请重试"); 
    } finally { 
      setIsParsing(false); 
    }
  };

  return (
    <div className={`min-h-screen bg-[#FDFCFE] flex flex-col transition-all duration-300 ${seniorMode ? 'text-2xl leading-relaxed' : 'text-base'}`} style={{ fontFamily: 'PingFang SC, -apple-system, sans-serif' }}>
      <Header seniorMode={seniorMode} />
      
      <main className={`flex-1 overflow-x-hidden pt-6 px-6 scroll-smooth ${seniorMode ? 'pb-40' : 'pb-24'}`}>
        {activeTab === 'monitoring' && (
          <DashboardView 
            widgets={widgets} 
            records={records} 
            seniorMode={seniorMode} 
            onDeleteWidget={(id) => setWidgets(widgets.filter(w => w.id !== id))}
            onAddWidget={() => setIsAiOpen(true)}
            onOpenAI={() => setIsAiOpen(true)}
          />
        )}
        {activeTab === 'archive' && (
          <ArchiveView 
            archive={archive} 
            isEditing={isEditingArchive}
            onToggleEdit={() => setIsEditingArchive(!isEditingArchive)}
            onUpdateArchive={setArchive}
          />
        )}
        {activeTab === 'tools' && (
          <div className="space-y-8 pb-40 animate-in fade-in duration-500">
             <div className="px-1">
                <h2 className={`${seniorMode ? 'text-5xl' : 'text-3xl'} font-extrabold text-gray-900 tracking-tight`}>常用工具</h2>
                <p className={`${seniorMode ? 'text-xl' : 'text-xs'} text-purple-600 font-bold mt-1 uppercase tracking-widest`}>HEALTH TOOLBOX</p>
             </div>
             <div className="grid grid-cols-1 gap-5">
                <CategoryCard icon={BookOpen} label="诊疗指南" desc="最新权威指南总结" color="bg-blue-50 text-blue-600" />
                <CategoryCard icon={Pill} label="用药管家" desc="副作用监测与提醒" color="bg-orange-50 text-orange-600" />
                <CategoryCard icon={Users} label="病友社区" desc="经验分享与互助" color="bg-green-50 text-green-600" />
             </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-8 pb-40 animate-in fade-in duration-500">
             <div className="px-1">
                <h2 className={`${seniorMode ? 'text-5xl' : 'text-3xl'} font-extrabold text-gray-900 tracking-tight`}>设置中心</h2>
                <p className={`${seniorMode ? 'text-xl' : 'text-xs'} text-purple-600 font-bold mt-1 uppercase tracking-widest`}>SYSTEM SETTINGS</p>
             </div>
             
             <div className="space-y-5">
               <div className="bg-white p-8 rounded-[2.5rem] border border-purple-50 shadow-sm space-y-8">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center ${seniorMode ? 'w-24 h-24' : 'w-14 h-14'}`}>
                        <HeartPulse size={seniorMode ? 48 : 28} />
                      </div>
                      <div className="flex-1">
                        <span className={`${seniorMode ? 'text-3xl' : 'text-lg'} font-black text-gray-800`}>适老关怀模式</span>
                        <p className={`${seniorMode ? 'text-lg' : 'text-[10px]'} text-gray-400 font-bold uppercase`}>Big Fonts · Simplified</p>
                      </div>
                   </div>
                   <button onClick={toggleSeniorMode} className={`rounded-full transition-all relative ${seniorMode ? 'bg-purple-600 w-28 h-14' : 'bg-gray-200 w-16 h-9'}`}>
                     <div className={`absolute top-1 bg-white rounded-full transition-all shadow-md ${seniorMode ? 'right-1 w-12 h-12' : 'left-1 w-7 h-7'}`} />
                   </button>
                 </div>

                 <div className="h-px bg-purple-50 w-full" />

                 <div className="grid grid-cols-1 gap-6">
                    <button onClick={downloadTemplate} className="flex items-center gap-5 group">
                      <div className={`bg-green-50 text-green-600 rounded-3xl flex items-center justify-center ${seniorMode ? 'w-24 h-24' : 'w-14 h-14'}`}>
                        <FileSpreadsheet size={seniorMode ? 48 : 28} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`${seniorMode ? 'text-3xl' : 'text-lg'} font-black text-gray-800`}>下载数据模版</span>
                        <p className={`${seniorMode ? 'text-lg' : 'text-[10px]'} text-gray-400 font-bold`}>CSV TEMPLATE</p>
                      </div>
                      <ArrowRight size={seniorMode ? 32 : 20} className="text-gray-300" />
                    </button>

                    <label className="flex items-center gap-5 cursor-pointer">
                      <div className={`bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center ${seniorMode ? 'w-24 h-24' : 'w-14 h-14'}`}>
                        <Upload size={seniorMode ? 48 : 28} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`${seniorMode ? 'text-3xl' : 'text-lg'} font-black text-gray-800`}>导入历史 CSV</span>
                        <p className={`${seniorMode ? 'text-lg' : 'text-[10px]'} text-gray-400 font-bold`}>BATCH IMPORT</p>
                      </div>
                      <input type="file" className="hidden" accept=".csv" onChange={importData} />
                      <ArrowRight size={seniorMode ? 32 : 20} className="text-gray-300" />
                    </label>

                    <button onClick={exportData} className="flex items-center gap-5 group">
                      <div className={`bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center ${seniorMode ? 'w-24 h-24' : 'w-14 h-14'}`}>
                        <Download size={seniorMode ? 48 : 28} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`${seniorMode ? 'text-3xl' : 'text-lg'} font-black text-gray-800`}>导出全部记录</span>
                        <p className={`${seniorMode ? 'text-lg' : 'text-[10px]'} text-gray-400 font-bold`}>DATA BACKUP</p>
                      </div>
                      <ArrowRight size={seniorMode ? 32 : 20} className="text-gray-300" />
                    </button>
                    
                    <button onClick={resetData} className="flex items-center gap-5 group opacity-60 hover:opacity-100 transition-opacity">
                      <div className={`bg-gray-100 text-gray-600 rounded-3xl flex items-center justify-center ${seniorMode ? 'w-24 h-24' : 'w-14 h-14'}`}>
                        <RotateCcw size={seniorMode ? 48 : 28} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`${seniorMode ? 'text-3xl' : 'text-lg'} font-black text-gray-800`}>重置/还原数据</span>
                        <p className={`${seniorMode ? 'text-lg' : 'text-[10px]'} text-gray-400 font-bold`}>RESET SYSTEM</p>
                      </div>
                      <ArrowRight size={seniorMode ? 32 : 20} className="text-gray-300" />
                    </button>
                 </div>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-purple-50 shadow-sm">
                 <button className={`w-full flex items-center justify-center gap-3 py-6 text-red-500 font-black hover:bg-red-50 rounded-[2rem] transition-all ${seniorMode ? 'text-3xl' : 'text-xl'}`}>
                   <LogOut size={seniorMode ? 40 : 24} /> 退出当前登录
                 </button>
               </div>
             </div>
          </div>
        )}
      </main>

      <Dock activeTab={activeTab} onTabChange={setActiveTab} onOpenAI={() => setIsAiOpen(true)} seniorMode={seniorMode} />
      <AssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} isLive={isLiveActive} onToggleLive={toggleLiveAI} onFileUpload={handleFileUpload} />
      {isParsing && <FullscreenLoader label="正在处理数据..." />}
    </div>
  );
}
