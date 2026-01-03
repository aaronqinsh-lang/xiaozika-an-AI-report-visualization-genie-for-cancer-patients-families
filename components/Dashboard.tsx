
import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Trash2, Plus, TrendingUp, Wrench, ChevronRight, Activity, ShieldAlert, Thermometer, Droplet, Stethoscope } from 'lucide-react';
import { DashboardWidget, MedicalRecord, MonitoringScenario } from '../types';

const SCENARIOS: MonitoringScenario[] = [
  { id: 'tumor', label: '肿瘤标志物趋势', metrics: ['CEA', 'CA19-9'], description: '重点关注 CEA 和 CA19-9 的动态变化', icon: 'Activity' },
  { id: 'chemo', label: '化疗健康监测', metrics: ['WBC', 'NEUT'], description: '监控中性粒细胞和白细胞 (CTCAE 5.0 分级)', icon: 'ShieldAlert' },
  { id: 'cholestasis', label: '胆汁淤积预警', metrics: ['ALP', 'GGT'], description: '关注碱性磷酸酶与转肽酶趋势', icon: 'Droplet' },
  { id: 'infection', label: '感染指标预警', metrics: ['CRP', 'PCT'], description: '监控 C 反应蛋白与降钙素原', icon: 'Thermometer' },
  { id: 'thrombosis', label: '血栓风险预警', metrics: ['D-Dimer'], description: '监控 D-二聚体凝血指标', icon: 'Activity' },
];

interface DashboardProps {
  widgets: DashboardWidget[];
  records: MedicalRecord[];
  onDeleteWidget: (id: string) => void;
  onAddWidget: () => void;
  seniorMode: boolean;
  onOpenAI: () => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ 
  widgets, records, onDeleteWidget, onAddWidget, seniorMode, onOpenAI 
}) => {
  const [activeScenario, setActiveScenario] = useState<string>('tumor');

  const filteredWidgets = React.useMemo(() => {
    const scenario = SCENARIOS.find(s => s.id === activeScenario);
    if (!scenario) return widgets;
    return [{
      id: scenario.id,
      title: scenario.label,
      type: 'line' as const,
      metrics: scenario.metrics,
      isPinned: true
    }];
  }, [activeScenario, widgets]);

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className={`${seniorMode ? 'text-4xl' : 'text-3xl'} font-extrabold text-gray-900 tracking-tight`}>指标监测</h2>
          <p className="text-purple-600 font-medium text-xs mt-1 uppercase tracking-wider">AI 健康雷达实时运行中</p>
        </div>
        <button 
          onClick={onAddWidget}
          className="bg-purple-600 text-white w-14 h-14 rounded-2xl shadow-lg shadow-purple-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* 场景选择横向滚动 */}
      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">快速监测方案</h3>
          <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">共 {SCENARIOS.length} 个场景</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s.id)}
              className={`flex-shrink-0 px-6 py-4 rounded-[1.8rem] border transition-all duration-300 flex flex-col gap-2 min-w-[140px] ${
                activeScenario === s.id 
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-100' 
                : 'bg-white text-gray-600 border-gray-100 hover:border-purple-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeScenario === s.id ? 'bg-white/20' : 'bg-purple-50 text-purple-600'}`}>
                {s.id === 'tumor' && <Activity size={18} />}
                {s.id === 'chemo' && <ShieldAlert size={18} />}
                {s.id === 'cholestasis' && <Droplet size={18} />}
                {s.id === 'infection' && <Thermometer size={18} />}
                {s.id === 'thrombosis' && <Activity size={18} />}
              </div>
              <span className="text-sm font-bold whitespace-nowrap">{s.label}</span>
            </button>
          ))}
          <button className="flex-shrink-0 px-6 py-4 rounded-[1.8rem] border border-dashed border-gray-200 text-gray-400 flex flex-col items-center justify-center gap-1 min-w-[140px] hover:border-purple-300 hover:text-purple-600 transition-colors">
            <Plus size={18} />
            <span className="text-xs font-bold">自定义模版</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredWidgets.map(w => (
          <WidgetCard key={w.id} widget={w} records={records} onDelete={onDeleteWidget} seniorMode={seniorMode} />
        ))}
      </div>

      {/* AI 分析卡片 */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-8 rounded-[2.8rem] text-white shadow-2xl shadow-purple-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <TrendingUp size={120} />
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
            <Stethoscope size={20} className="text-white" />
          </div>
          <h3 className="font-bold text-xl">智能趋势研判</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-purple-50 relative z-10">
          <p className="bg-white/5 p-4 rounded-2xl border border-white/10 italic">
            “当前场景：<span className="font-bold underline text-white">{SCENARIOS.find(s => s.id === activeScenario)?.label}</span>。系统检测到最近一次指标处于正常参考范围内，相比上月波动率降低了 12.5%。”
          </p>
          <p>建议继续保持当前治疗方案。如需深入解读中性粒细胞分级，请点击下方开启 AI 讨论。</p>
        </div>
        <button onClick={onOpenAI} className="mt-6 w-full bg-white text-purple-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-[0.98] transition-all shadow-xl">
           开启 AI 语音讨论 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const WidgetCard: React.FC<{ 
  widget: DashboardWidget, 
  records: MedicalRecord[], 
  onDelete: (id: string) => void,
  seniorMode: boolean 
}> = ({ widget, records, onDelete, seniorMode }) => {
  const data = React.useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(r => ({ 
        name: r.date.slice(5), 
        date: r.date,
        ...r.indicators 
      }));
  }, [records]);

  const ChartComp = widget.type === 'line' ? LineChart : AreaChart;
  const colors = ['#7C3AED', '#EC4899', '#3B82F6', '#10B981'];

  return (
    <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-purple-50 group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
             <h3 className={`${seniorMode ? 'text-2xl' : 'text-lg'} font-black text-gray-800 tracking-tight`}>{widget.title}</h3>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">基于最近 {records.length} 次检查结果</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-colors">
             <Activity size={16} />
           </button>
           <button onClick={() => onDelete(widget.id)} className="opacity-0 group-hover:opacity-100 p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
             <Trash2 size={16} />
           </button>
        </div>
      </div>
      
      <div className={`${seniorMode ? 'h-[250px]' : 'h-[200px]'} w-full -ml-4 pr-4`}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComp data={data}>
            <CartesianGrid strokeDasharray="6 6" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
              tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
              axisLine={false} 
              tickLine={false} 
              hide={seniorMode}
            />
            <Tooltip 
              contentStyle={{
                borderRadius: '1.5rem', 
                border: 'none', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: 'bold'
              }} 
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold'}} />
            {widget.metrics.map((m, i) => (
              <Line 
                key={m} 
                name={m}
                type="monotone" 
                dataKey={m} 
                stroke={colors[i % colors.length]} 
                strokeWidth={4} 
                dot={{r: 6, fill: '#fff', strokeWidth: 3, stroke: colors[i % colors.length]}} 
                activeDot={{r: 8, strokeWidth: 0}}
              />
            ))}
          </ChartComp>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
