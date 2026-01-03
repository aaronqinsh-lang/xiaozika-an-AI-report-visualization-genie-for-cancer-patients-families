import { supabase } from './supabaseClient';
import { IndicatorDefinition, MedicalRecord, TreatmentPhase, UserProfile } from '../types';

export class DBService {
  /**
   * 保存或更新个人资料
   * 确保 JSONB 字段 (doctors, emergency) 被正确序列化
   */
  static async updateProfile(profile: Partial<UserProfile>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No active user found for profile update');
        return;
      }
      
      // 准备提交的数据，过滤掉不属于数据库字段的 UI 状态
      const payload = {
        id: user.id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        senior_mode: profile.senior_mode,
        diagnosis: profile.diagnosis,
        medical_history: profile.medical_history,
        doctors: profile.doctors || [],
        emergency: profile.emergency || { name: '未设置', relation: '-', phone: '-' },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' });
      
      if (error) throw error;
      console.log('Profile synchronized successfully');
    } catch (error: any) {
      console.error('Update Profile Error:', error.message);
    }
  }

  /**
   * 获取当前登录用户的全量个人资料
   */
  static async getProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Fetch Profile Error:', error.message);
      return null;
    }
    return data;
  }

  /**
   * 保存病历记录到 Supabase (保持不变)
   */
  static async saveMedicalRecord(record: any) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return { success: true, localOnly: true };
      
      const { data, error } = await supabase
        .from('medical_records')
        .insert({ 
          date: record.date,
          type: record.type,
          hospital: record.hospital || '',
          indicators: record.indicators,
          user_id: user.id
        });
        
      if (error) throw error;
      return { success: true };
    } catch (e) {
      console.error('DBService.saveMedicalRecord 异常:', e);
      return { success: false, error: e };
    }
  }

  /**
   * 获取所有历史记录 (保持不变)
   */
  static async getRecords(): Promise<MedicalRecord[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return [];

      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      return data || [];
    } catch (e) {
      console.error('DBService.getRecords 异常:', e);
      return [];
    }
  }

  static async getTreatmentPhases(): Promise<TreatmentPhase[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase.from('treatment_phases').select('*').eq('user_id', user.id);
      return data || [];
    } catch (e) { return []; }
  }

  static async getIndicatorDefinitions(): Promise<IndicatorDefinition[]> {
    try {
      const { data } = await supabase.from('indicator_definitions').select('*');
      return data || [];
    } catch (e) { return []; }
  }
}
