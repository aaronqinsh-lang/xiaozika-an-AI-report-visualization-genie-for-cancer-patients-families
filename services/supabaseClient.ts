import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client initialization.
 * 
 * We prioritize environment variables but provide the project-specific 
 * credentials as defaults to ensure the app works out-of-the-box in the 
 * preview environment.
 */
const env = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. ' +
      'Set them in Netlify (Site settings → Build & deploy → Environment → Environment variables).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
