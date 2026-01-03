
import React from 'react';
import { 
  User, Edit3, Save, FileText, Stethoscope, BriefcaseMedical, 
  PhoneCall, AlertCircle, Heart, PlusCircle 
} from 'lucide-react';
import { HealthArchive } from '../types';

interface ArchiveProps {
  archive: HealthArchive;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdateArchive: (newArchive: HealthArchive) => void;
}

export const ArchiveView: React.FC<ArchiveProps> = ({ 
  archive, isEditing, onToggleEdit, onUpdateArchive 
}) => {
  return (
    <div className="space-y-8 pb-32 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center px-1">
        <h1 className="text-3xl font-extrabold text-gray-900">健康档案</h1>
        <button 
          onClick={onToggleEdit}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${isEditing ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}
        >
          {isEditing ? <><Save size={14} /> 保存</> : <><Edit3 size={14} /> 编辑</>}
        </button>
      </div>

      {/* 病人画像 */}
      <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-purple-50 space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-100 to-purple-50 rounded-3xl flex items-center justify-center text-purple-600 font-bold text-2xl shadow-inner">张</div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">张三</h2>
            <p className="text-xs text-gray-400 font-mono">档案编号: ZK-2401-098</p>
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-0.5 rounded-lg font-bold">男 | 65岁</span>
              <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded-lg font-bold">肺癌 II 期</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
           <p className="text-xs font-bold text-gray-400 flex items-center gap-2"><FileText size={14} /> 既往病史</p>
           {isEditing ? (
             <textarea 
               className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 ring-purple-400 text-sm min-h-[100px]"
               value={archive.medicalHistory}
               onChange={(e) => onUpdateArchive({...archive, medicalHistory: e.target.value})}
             />
           ) : (
             <div className="bg-gray-50/50 p-5 rounded-2xl text-sm leading-relaxed text-gray-700">
               {archive.medicalHistory}
             </div>
           )}
        </div>
      </div>

      {/* 医生列表 */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 px-2 flex items-center gap-2"><Stethoscope size={18} /> 主治医师团队</h3>
        <div className="space-y-3">
          {archive.doctors.map(d => (
            <div key={d.id} className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center justify-between group transition-all hover:border-purple-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><BriefcaseMedical size={20} /></div>
                <div>
                  <p className="font-bold text-gray-800">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.specialty}</p>
                </div>
              </div>
              <a href={`tel:${d.contact}`} className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center transition shadow-sm hover:bg-purple-600 hover:text-white">
                <PhoneCall size={18} />
              </a>
            </div>
          ))}
          {isEditing && (
            <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 font-bold text-xs flex items-center justify-center gap-2">
              <PlusCircle size={16} /> 添加主治医生
            </button>
          )}
        </div>
      </div>

      {/* SOS 模块 */}
      <div className="bg-red-50 p-7 rounded-[2.5rem] border border-red-100/50 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition duration-1000"><Heart size={150} fill="red" /></div>
        <h3 className="font-bold text-red-600 mb-5 flex items-center gap-2">
           <AlertCircle size={18} className="animate-pulse" /> 紧急联系人 (SOS)
        </h3>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-sm font-bold text-gray-900">{archive.emergency.name} · <span className="text-red-600 opacity-60 font-medium">{archive.emergency.relation}</span></p>
            <p className="text-2xl font-mono font-bold text-red-600 tracking-wider mt-1">{archive.emergency.phone}</p>
          </div>
          <button className="bg-red-600 text-white w-16 h-16 rounded-full shadow-xl shadow-red-200 flex items-center justify-center active:scale-95 transition"><PhoneCall size={28} /></button>
        </div>
      </div>
