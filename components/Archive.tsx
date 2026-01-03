import React from 'react';
import { 
  User, Edit3, Save, FileText, Stethoscope, BriefcaseMedical, 
  PhoneCall, AlertCircle, Heart, PlusCircle, Trash2, Calendar, Hospital, ChevronRight, Activity
} from 'lucide-react';
import { UserProfile, MedicalRecord, Doctor } from '../types';

interface ArchiveProps {
  profile: UserProfile;
  records: MedicalRecord[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdateProfile: (newProfile: UserProfile) => void;
  seniorMode: boolean;
}

export const ArchiveView: React.FC<ArchiveProps> = ({ 
  profile, records, isEditing, onToggleEdit, onUpdateProfile, seniorMode 
}) => {
  
  // 医生团队管理逻辑
  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name: '新医生',
      specialty: '主治方向',
      contact: ''
    };
    onUpdateProfile({
      ...profile,
      doctors: [...(profile.doctors || []), newDoctor]
    });
  };

  const handleRemoveDoctor = (id: string) => {
    onUpdateProfile({
      ...profile,
      doctors: (profile.doctors || []).filter(d => d.id !== id)
    });
  };

  const handleDoctorChange = (id: string, field: keyof Doctor, value: string) => {
    onUpdateProfile({
      ...profile,
      doctors: (profile.doctors || []).map(d => d.id === id ? { ...d, [field]: value } : d)
    });
  };

  // 紧急联系人管理逻辑
  const handleEmergencyChange = (field: string, value: string) => {
    onUpdateProfile({
      ...profile,
      emergency: {
        ...(profile.emergency || { name: '', relation: '', phone: '' }),
        [field]: value
      }
    });
  };

  return (
    <div className={`space-y-8 ${seniorMode ? 'pb-48' : 'pb-32'} animate-in slide-in-from-right-10 duration-500`}>
      {/* 标题栏 */}
      <div className="flex justify-between items-center px-1">
        <h1 className={`${seniorMode ? 'text-4xl' : 'text-3xl'} font-black text-gray-900`}>健康档案</h1>
        <button 
          onClick={onToggleEdit}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 ${
            isEditing 
            ? 'bg-green-500 text-white shadow-green-100' 
            : 'bg-purple-600 text-white shadow-purple-100'
          }`}
        >
          {isEditing ? <><Save size={18} /> 保存更新</> : <><Edit3 size={18} /> 编辑档案</>}
        </button>
      </div>

      {/* 核心个人画像卡片 */}
      <div className={`bg-white ${seniorMode ? 'p-9' : 'p-7'} rounded-[3rem] shadow-sm border border-purple-50 space-y-6`}>
        <div className="flex items-center gap-6">
          <div className={`${seniorMode ? 'w-28 h-28 text-4xl' : 'w-24 h-24 text-3xl'} bg-gradient-to-tr from-purple-100 to-purple-50 rounded-[2.2rem] flex items-center justify-center text-purple-600 font-black shadow-inner`}>
            {profile.name?.charAt(0) || '匿'}
          </div>
          <div className="flex-1 space-y-3">
            {isEditing ? (
              <input 
                className="text-2xl font-black text-gray-800 bg-gray-50 px-4 py-2 rounded-xl w-full border-none focus:ring-2 ring-purple-400"
                value={profile.name}
                onChange={(e) => onUpdateProfile({...profile, name: e.target.value})}
              />
            ) : (
              <h2 className={`${seniorMode ? 'text-3xl' : 'text-2xl'} font-black text-gray-800 tracking-tight`}>{profile.name}</h2>
            )}
            
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <select 
                    className="bg-blue-50 text-blue-500 text-xs px-3 py-2 rounded-xl font-black border-none"
                    value={profile.gender}
                    onChange={(e) => onUpdateProfile({...profile, gender: e.target.value})}
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                  <input 
                    type="number"
                    className="bg-blue-50 text-blue-500 text-xs px-3 py-2 rounded-xl font-black border-none w-20"
                    value={profile.age}
                    onChange={(e) => onUpdateProfile({...profile, age: parseInt(e.target.value)})}
                  />
                  <input 
                    placeholder="诊断详情"
                    className="bg-red-50 text-red-500 text-xs px-3 py-2 rounded-xl font-black border-none flex-1"
                    value={profile.diagnosis}
                    onChange={(e) => onUpdateProfile({...profile, diagnosis: e.target.value})}
                  />
                </div>
              ) : (
                <>
                  <span className="bg-blue-50 text-blue-500 text-[11px] px-4 py-1.5 rounded-full font-black uppercase tracking-wider">{profile.gender} | {profile.age}岁</span>
                  <span className="bg-red-50 text-red-500 text-[11px] px-4 py-1.5 rounded-full font-black uppercase tracking-wider">{profile.diagnosis}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-50">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3">
             <FileText size={14} className="text-purple-400" /> 既往病史描述
           </p>
           {isEditing ? (
             <textarea 
               className="w-full bg-gray-50 p-6 rounded-[2rem] border-none focus:ring-2 ring-purple-400 text-sm min-h-[140px] font-medium leading-relaxed"
               placeholder="录入详细的病情历史、过敏史或近期治疗重点..."
               value={profile.medical_history}
               onChange={(e) => onUpdateProfile({...profile, medical_history: e.target.value})}
             />
           ) : (
             <div className={`${seniorMode ? 'text-lg' : 'text-sm'} bg-gray-50/50 p-7 rounded-[2.2rem] leading-relaxed text-gray-600 font-medium`}>
               {profile.medical_history || '点击“编辑档案”录入您的健康史，AI 将据此为您提供更精准的指标分析。'}
             </div>
           )}
        </div>
      </div>

      {/* 历史化验报告列表 - 解决用户提到的“肿瘤标志物报告没了” */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
           <h3 className={`${seniorMode ? 'text-2xl' : 'text-lg'} font-black text-gray-800 flex items-center gap-2`}><Activity size={20} className="text-purple-500" /> 历史检查记录</h3>
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">共 {records.length} 份报告</span>
        </div>
        <div className="space-y-3">
          {records.length > 0 ? records.slice(0, 5).map(r => {
            const hasTumor = r.indicators['CA199'] || r.indicators['CEA'] || r.indicators['AFP'];
            return (
              <div key={r.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-50 flex items-center gap-4 group hover:border-purple-200 transition-all active:scale-98 shadow-sm">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  hasTumor ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-blue-50 text-blue-500'
                }`}>
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`${seniorMode ? 'text-lg' : 'text-sm'} font-black text-gray-800`}>
                      {hasTumor ? '肿瘤标志物检查' : r.type === 'Infection' ? '感染指标专项' : '综合生化检查'}
                    </p>
                    {hasTumor && <span className="text-[8px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-black uppercase">核心指标</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Calendar size={12} /> {r.date}</span>
                    {r.hospital && <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Hospital size={12} /> {r.hospital}</span>}
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-200 group-hover:text-purple-400 transition-colors" />
              </div>
            );
          }) : (
            <div className="bg-white/50 border-2 border-dashed border-gray-100 p-16 rounded-[3rem] text-center">
               <p className="text-sm text-gray-300 font-bold">目前还没有检查记录。点击中间的“紫康 AI”上传第一份报告，我们将为您自动分类。</p>
            </div>
          )}
        </div>
      </div>

      {/* 主治医师团队 - 编辑闭环 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className={`${seniorMode ? 'text-2xl' : 'text-lg'} font-black text-gray-800 flex items-center gap-2`}><Stethoscope size={20} className="text-blue-500" /> 主治医师团队</h3>
          {isEditing && (
            <button onClick={handleAddDoctor} className="text-blue-500 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
              <PlusCircle size={14} /> 添加医生
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {profile.doctors?.length ? profile.doctors.map(d => (
            <div key={d.id} className="bg-white p-6 rounded-[2.8rem] border border-gray-50 shadow-sm flex items-center justify-between group transition-all hover:border-purple-200">
              <div className="flex items-center gap-5 flex-1">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner"><BriefcaseMedical size={24} /></div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2 pr-6">
                      <input 
                        className="text-sm font-black text-gray-800 bg-gray-50 rounded-xl px-4 py-2 w-full border-none focus:ring-1 ring-blue-300" 
                        value={d.name} 
                        onChange={(e) => handleDoctorChange(d.id, 'name', e.target.value)}
                        placeholder="医生姓名"
                      />
                      <input 
                        className="text-[10px] text-gray-400 bg-gray-50 rounded-xl px-4 py-2 w-full border-none focus:ring-1 ring-blue-300" 
                        value={d.specialty} 
                        onChange={(e) => handleDoctorChange(d.id, 'specialty', e.target.value)}
                        placeholder="科室/专长"
                      />
                    </div>
                  ) : (
                    <>
                      <p className={`${seniorMode ? 'text-xl' : 'text-base'} font-black text-gray-800`}>{d.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{d.specialty}</p>
                    </>
                  )}
                </div>
              </div>
              {isEditing ? (
                <button onClick={() => handleRemoveDoctor(d.id)} className="p-3 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={22} /></button>
              ) : (
                <a href={`tel:${d.contact}`} className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center transition shadow-sm hover:bg-purple-600 hover:text-white active:scale-90">
                  <PhoneCall size={22} />
                </a>
              )}
            </div>
          )) : !isEditing && (
             <div className="bg-gray-50/50 p-8 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
               <p className="text-xs text-gray-300 font-bold">点击编辑添加您的主治医师，方便快速联系。</p>
             </div>
          )}
        </div>
      </div>

      {/* SOS 紧急求助模块 - 编辑闭环 */}
      <div className="bg-red-50 p-9 rounded-[3rem] border border-red-100/50 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 opacity-[0.03] group-hover:scale-110 transition duration-1000 rotate-12"><Heart size={200} fill="red" /></div>
        <h3 className={`${seniorMode ? 'text-2xl' : 'text-lg'} font-black text-red-600 mb-8 flex items-center gap-2`}>
           <AlertCircle size={22} className="animate-pulse" /> 紧急联系人 (SOS)
        </h3>
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-4 flex-1">
            {isEditing ? (
              <div className="space-y-3 pr-8">
                <div className="flex gap-3">
                  <input 
                    placeholder="姓名"
                    className="text-sm font-black text-gray-900 bg-white/80 rounded-2xl px-4 py-3 w-1/2 border-none focus:ring-2 ring-red-400" 
                    value={profile.emergency?.name} 
                    onChange={(e) => handleEmergencyChange('name', e.target.value)}
                  />
                  <input 
                    placeholder="关系 (如: 女儿)"
                    className="text-sm font-black text-red-600 bg-white/80 rounded-2xl px-4 py-3 w-1/2 border-none focus:ring-2 ring-red-400" 
                    value={profile.emergency?.relation} 
                    onChange={(e) => handleEmergencyChange('relation', e.target.value)}
                  />
                </div>
                <input 
                  placeholder="联系电话"
                  className="text-xl font-mono font-black text-red-600 bg-white/80 rounded-2xl px-5 py-4 w-full border-none focus:ring-2 ring-red-400" 
                  value={profile.emergency?.phone} 
                  onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                />
              </div>
            ) : (
              <>
                <p className={`${seniorMode ? 'text-2xl' : 'text-lg'} font-black text-gray-900`}>
                  {profile.emergency?.name} · <span className="text-red-600 opacity-80 font-bold uppercase tracking-widest text-xs">{profile.emergency?.relation}</span>
                </p>
                <p className={`${seniorMode ? 'text-4xl' : 'text-3xl'} font-mono font-black text-red-600 tracking-wider mt-2`}>
                  {profile.emergency?.phone || '未设置'}
                </p>
              </>
            )}
          </div>
          {!isEditing && (
            <button className="bg-red-600 text-white w-20 h-20 rounded-full shadow-2xl shadow-red-200 flex items-center justify-center active:scale-90 transition-transform">
              <PhoneCall size={32} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
