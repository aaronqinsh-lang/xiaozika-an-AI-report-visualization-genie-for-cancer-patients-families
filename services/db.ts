import { supabase } from './supabaseClient';
import { IndicatorDefinition, MedicalRecord, TreatmentPhase, UserProfile } from '../types';

export class DBService {
  /**
   * 保存或更新个人资料
   * 包含对 JSONB 字段 (doctors, emergency) 的支持
   */
  static async updateProfile(profile: Partial<UserProfile>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('未发现登录用户，无法更新档案');
        return;
      }
      
      const payload = {
        id: user.id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        senior_mode: profile.senior_mode,
        diagnosis: profile.diagnosis,
        medical_history: profile.medical_history,
        doctors: profile.doctors || [], // 确认为数组
        emergency: profile.emergency || { name: '未设置', relation: '-', phone: '-' }, // 确认为对象
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' });
      
      if (error) throw error;
      console.log('云端档案同步成功');
    } catch (error: any) {
      console.error('档案同步失败:', error.message);
    }
  }

  /**
   * 获取当前用户的全量档案
   */
  static async getProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('档案获取失败:', error.message);
      return null;
    }
  }

  /**
   * 保存病历记录 (化验单)
   */
  static async saveMedicalRecord(record: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: true, localOnly: true };
      
      const { error } = await supabase
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
      console.error('记录保存异常:', e);
      return { success: false, error: e };
    }
  }

  /**
   * 获取所有历史病历记录
   */
  static async getRecords(): Promise<MedicalRecord[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      return data || [];
    } catch (e) {
      console.error('记录获取异常:', e);
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