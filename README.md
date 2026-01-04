<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Giosn9GG2R1wih6iWS_g5iMDuIdJ-D5r

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 🚀 部署注意事项

如果您计划将本项目部署到静态托管平台，请务必在 `index.html` 中正确引用入口脚本：

```html
<body>
  <div id="root"></div>
  <script type="module" src="index.tsx"></script>
</body>
</html>
```

### 部署中使用supbase参数的注意事项:
1. 修改文件 service/supabaseClient
```ts
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
