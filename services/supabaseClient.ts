import { createClient } from '@supabase/supabase-js';

// 优先读取 Vite/EdgeOne 环境变量
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://wpgsdyiwzfcsfyimmbje.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_p3ccwxyoDqO6wBqcemVK7A_RWVNQ3HR';

if (!env.VITE_SUPABASE_URL) {
  console.log('Supabase: 使用硬编码兜底配置运行。');
}

export const supabase = createClient(supabaseUrl, supabaseKey);