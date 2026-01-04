import { createClient } from '@supabase/supabase-js';

/**
 * 安全获取环境变量的辅助函数
 */
const getEnv = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

// 如果环境变量未生效，使用默认提供的项目地址和 Anon Key
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://wpgsdyiwzfcsfyimmbje.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_p3ccwxyoDqO6wBqcemVK7A_RWVNQ3HR';

if (!getEnv('VITE_SUPABASE_URL')) {
  console.log('环境变量注入检查中，当前使用硬编码兜底配置。');
}

export const supabase = createClient(supabaseUrl, supabaseKey);