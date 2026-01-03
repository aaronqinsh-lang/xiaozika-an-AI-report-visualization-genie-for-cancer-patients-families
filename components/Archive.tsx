import React from 'react';
import { 
  User, Edit3, Save, FileText, Stethoscope, BriefcaseMedical, 
  PhoneCall, AlertCircle, Heart, PlusCircle, Trash2, Calendar, Hospital, ChevronRight
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

  return (
    <div className="space-y-8 pb-32 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center px-1">
        <h1 className={`${seniorMode ? 'text-4xl' : 'text-3xl'} font-black text-gray-900`}>健康档案</h1>
        <button 
          onClick={onToggleEdit}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-sm ${
            isEditing 
            ? 'bg-green-500 text-white shadow-green-100 scale-105' 
            : 'bg-purple-100 text-purple-600'
          }`}
        >
          {isEditing ? <><Save size={16} /> 保存档案</> : <><Edit3 size={16} /> 编辑资料</>}
        </button>
      </div>

      {/* 病人画像核心信息 */}
      <div className="bg-white p-7 rounded-[2.8rem] shadow-sm border border-purple-50 space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-100 to-purple-50 rounded-[2rem] flex items-center justify-center text-purple-600 font-black text-3xl shadow-inner">
            {profile.name?.charAt(0) || '匿'}
          </div>
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <input 
                className="text-2xl font-black text-gray-800 bg-gray-50 px-3 py-1 rounded-xl w-full border-none focus:ring-2 ring-purple-400"
                value={profile.name}
                onChange={(e) => onUpdateProfile({...profile, name: e.target.value})}
              />
            ) : (
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">{profile.name}</h2>
            )}
            
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">档案编号: ZK-24-{profile.id?.slice(0,4)}</p>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <select 
                    className="bg-blue-50 text-blue-500 text-[10px] px-2 py-1 rounded-lg font-black border-none"
                    value={profile.gender}
                    onChange={(e) => onUpdateProfile({...profile, gender: e.target.value})}
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                  <input 
                    type="number"
                    className="bg-blue-50 text-blue-500 text-[10px] px-2 py-1 rounded-lg font-black border-none w-16"
                    value={profile.age}
                    onChange={(e) => onUpdateProfile({...profile, age: parseInt(e.target.value)})}
                  />
                </>
              ) : (
                <span className="bg-blue-50 text-blue-500 text-[10px] px-3 py-1 rounded-lg font-black">{profile.gender} | {profile.age}岁</span>
              )}

              {isEditing ? (
                <input 
                  className="bg-red-50 text-red-500 text-[10px] px-2 py-1 rounded-lg font-black border-none flex-1"
                  value={profile.diagnosis}
                  onChange={(e) => onUpdateProfile({...profile, diagnosis: e.target.value})}
                />
              ) : (
                <span className="bg-red-50 text-red-500 text-[10px] px-3 py-1 rounded-lg font-black">{profile.diagnosis}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-3 pt-4 border-t border-gray-50">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
             <FileText size={14} className="text-purple-400" /> 既往病史与备注
           </p>
           {isEditing ? (
             <textarea 
               className="w-full bg-gray-50 p-5 rounded-3xl border-none focus:ring-2 ring-purple-400 text-sm min-h-[120px] font-medium leading-relaxed"
               placeholder="描述您的病情历史、过敏史或近期特殊情况..."
               value={profile.medical_history}
               onChange={(e) => onUpdateProfile({...profile, medical_history: e.target.value})}
             />
           ) : (
             <div className="bg-gray-50/50 p-6 rounded-3xl text-sm leading-relaxed text-gray-600 font-medium">
               {profile.medical_history || '点击编辑录入您的既往病史，以便 AI 提供更精准的分析。'}
             </div>
           )}
        </div>
      </div>

      {/* 报告记录列表 - 解决用户提到的“报告怎么没了” */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
           <h3 className="font-black text-gray-800 flex items-center gap-2"><Calendar size={18} className="text-purple-500" /> 历史化验单记录</h3>
           <span className="text-[10px] text-gray-400 font-bold">共 {records.length} 份</span>
        </div>
        <div className="space-y-3">
          {records.length > 0 ? records.slice(0, 5).map(r => (
            <div key={r.id} className="bg-white p-5 rounded-[2rem] border border-gray-50 flex items-center gap-4 group hover:border-purple-200 transition-all active:scale-98">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                r.type === 'Blood' ? 'bg-red-50 text-red-500' : 
                r.type === 'Tumor' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-500'
              }`}>
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-800">{r.type === 'Complex' ? '综合生化报告' : r.type === 'Infection' ? '感染专项监测' : r.type}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Calendar size={10} /> {r.date}</span>
                  {r.hospital && <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Hospital size={10} /> {r.hospital}</span>}
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-200 group-hover:text-purple-400 transition-colors" />
            </div>
          )) : (
            <div className="bg-white/50 border-2 border-dashed border-gray-100 p-12 rounded-[2.5rem] text-center">
               <p className="text-sm text-gray-300 font-bold">暂无上传记录，点击 AI 助手上传首份报告</p>
            </div>
          )}
        </div>
      </div>

      {/* 主治医师团队 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-black text-gray-800 flex items-center gap-2"><Stethoscope size={18} className="text-blue-500" /> 主治医师团队</h3>
          {isEditing && (
            <button onClick={handleAddDoctor} className="text-blue-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
              <PlusCircle size={14} /> 添加医生
            </button>
          )}
        </div>
        <div className="space-y-3">
          {profile.doctors?.map(d => (
            <div key={d.id} className="bg-white p-5 rounded-[2.2rem] border border-gray-50 shadow-sm flex items-center justify-between group transition-all hover:border-purple-200">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><BriefcaseMedical size={20} /></div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-1 pr-4">
                      <input 
                        className="text-sm font-black text-gray-800 bg-gray-50 rounded-lg px-2 py-0.5 w-full border-none" 
                        value={d.name} 
                        onChange={(e) => handleDoctorChange(d.id, 'name', e.target.value)}
                      />
                      <input 
                        className="text-[10px] text-gray-400 bg-gray-50 rounded-lg px-2 py-0.5 w-full border-none" 
                        value={d.specialty} 
                        onChange={(e) => handleDoctorChange(d.id, 'specialty', e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-black text-gray-800">{d.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{d.specialty}</p>
                    </>
                  )}
                </div>
              </div>
              {isEditing ? (
                <button onClick={() => handleRemoveDoctor(d.id)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={18} /></button>
              ) : (
                <a href={`tel:${d.contact}`} className="w-11 h-11 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center transition shadow-sm hover:bg-purple-600 hover:text-white">
                  <PhoneCall size={20} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SOS 模块 */}
      <div className="bg-red-50 p-8 rounded-[2.8rem] border border-red-100/50 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition duration-1000"><Heart size={150} fill="red" /></div>
        <h3 className="font-black text-red-600 mb-6 flex items-center gap-2">
           <AlertCircle size={20} className="animate-pulse" /> 紧急联系人 (SOS)
        </h3>
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-2 flex-1">
            {isEditing ? (
              <div className="space-y-2 pr-6">
                <div className="flex gap-2">
                  <input 
                    className="text-sm font-black text-gray-900 bg-white/50 rounded-xl px-3 py-2 w-1/2 border-none" 
                    value={profile.emergency?.name} 
                    onChange={(e) => onUpdateProfile({...profile, emergency: {...profile.emergency!, name: e.target.value}})}
                  />
                  <input 
                    className="text-sm font-black text-red-600 bg-white/50 rounded-xl px-3 py-2 w-1/2 border-none" 
                    value={profile.emergency?.relation} 
                    onChange={(e) => onUpdateProfile({...profile, emergency: {...profile.emergency!, relation: e.target.value}})}
                  />
                </div>
                <input 
                  className="text-xl font-mono font-black text-red-600 bg-white/50 rounded-xl px-3 py-2 w-full border-none" 
                  value={profile.emergency?.phone} 
                  onChange={(e) => onUpdateProfile({...profile, emergency: {...profile.emergency!, phone: e.target.value}})}
                />
              </div>
            ) : (
              <>
                <p className="text-sm font-black text-gray-900">{profile.emergency?.name} · <span className="text-red-600 opacity-80 font-bold uppercase tracking-widest text-[10px]">{profile.emergency?.relation}</span></p>
                <p className="text-2xl font-mono font-black text-red-600 tracking-wider mt-1">{profile.emergency?.phone}</p>
              </>
            )}
          </div>
          <button className="bg-red-600 text-white w-16 h-16 rounded-full shadow-2xl shadow-red-200 flex items-center justify-center active:scale-90 transition"><PhoneCall size={28} /></button>
        </div>
      </div>
    </div>
  );
};
