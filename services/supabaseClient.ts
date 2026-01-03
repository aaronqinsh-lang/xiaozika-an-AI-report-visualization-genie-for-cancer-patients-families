import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

/**
 * 安全获取环境变量的辅助函数
 */
const getEnv = (key: string): string | undefined => {
  // Removed import.meta.env check to resolve TypeScript errors in environments without import.meta.env types
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://wpgsdyiwzfcsfyimmbje.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_p3ccwxyoDqO6wBqcemVK7A_RWVNQ3HR';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase 配置缺失，应用将运行在本地模拟模式。');
}

// 导出客户端实例，增加防御性导出
export const supabase = createClient(supabaseUrl, supabaseKey);