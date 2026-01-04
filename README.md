# 小紫卡 - 智慧病情管理与可视化助手 💜

**小紫卡** 是一款专为肿瘤患者及其家属设计的病情数据管理工具。它通过 AI 技术将冰冷的化验单转化为直白的可视化趋势，并提供贴身的 AI 语音助手，帮助用户在复杂的治疗周期中看清病情走向。

![License](https://img.shields.io/badge/License-MIT-purple.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Gemini](https://img.shields.io/badge/Gemini-AI-orange.svg)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)

---

## ✨ 核心功能

- **📸 AI 报告解析**：支持拍照或上传化验单图片，利用 Google Gemini 3 Flash 模型自动识别并结构化提取肿瘤标志物、血常规、肝肾功能等数十项核心指标。
- **📊 趋势雷达可视化**：
  - **动态折线图**：多维度展示指标随时间的变化。
  - **治疗阶段联动**：在时间轴上标记手术、化疗周期，直观观察“治疗方案 -> 指标反应”的关联。
  - **场景化预设**：一键切换“肿瘤标志物”、“化疗安全”、“感染预警”等监测方案。
- **🎙️ 实时语音助手 (Live API)**：集成 Gemini 2.5 Live API，支持自然语言语音交谈。AI 会结合您的历史健康档案，为您深度解读指标趋势，并提供日常护理建议。
- **🗂️ 结构化档案管理**：分类存储检查记录、主治医生团队及紧急联系人（SOS）信息。
- **👵 适老关怀模式**：全局字体放大、简化交互路径、圆润高对比度设计，让高龄患者也能轻松阅读报告。

---

## 🛠️ 技术架构

- **前端框架**：React 19 (ES6 Modules)
- **样式方案**：Tailwind CSS (响应式设计 + 适老模式适配)
- **AI 引擎**：
  - **Google Gemini 3 Flash**：用于高性能文本解析与报告 OCR。
  - **Google Gemini 2.5 Live**：用于实时语音交谈与深度病情推演。
- **后端服务 (BaaS)**：
  - **Supabase Auth**：用户身份验证（支持一键登录）。
  - **Supabase Database (PostgreSQL)**：行级安全 (RLS) 保护下的病情数据存储。
  - **Supabase Storage**：报告原始图片存储。
- **图表库**：Recharts (高性能响应式图表)

---

## 🚀 部署注意事项

如果您计划将本项目部署到静态托管平台（如 Netlify, Vercel, 或 EdgeOne），请务必在 `index.html` 中正确引用入口脚本：

```html
<body>
  <div id="root"></div>
  <script type="module" src="index.tsx"></script>
</body>
</html>
```

### 部署中使用 Supabase 参数的注意事项

1. **配置环境变量**：
   在部署平台的设置界面（如 Netlify 的 Site settings → Environment variables）添加以下变量：
   - `VITE_SUPABASE_URL`: 您的 Supabase 项目地址。
   - `VITE_SUPABASE_ANON_KEY`: 您的 Supabase 匿名访问 Key。
   - `API_KEY`: 您的 Google Gemini API Key。

2. **修改文件 `services/supabaseClient.ts`**：
   确保您的客户端初始化代码符合以下规范（本项目已默认包含此逻辑）：
```ts
import { createClient } from '@supabase/supabase-js';

const env = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 📦 快速启动

1. **数据库初始化**：
   - 登录您的 Supabase 控制台。
   - 进入 SQL Editor，复制并运行项目根目录下的 `DATABASE_INIT.txt` 以创建所需的表结构与安全策略。
   - (可选) 运行 `seed_data.txt` 或 `dt.txt` 以注入演示用的模拟数据（如：张老伯的档案）。

2. **本地运行**：
   ```bash
   # 项目采用标准原生 ES 模块加载，通常配合简单的本地服务器即可运行
   # 确保环境变量 process.env.API_KEY 已配置（在支持的环境中）
   ```

---

## ⚠️ 免责声明

**小紫卡** 是一款病情数据管理与可视化工具，旨在辅助患者及其家属更好地理解健康数据。本应用输出的 AI 建议及指标分析仅供参考，**不构成任何医学诊断或治疗建议**。所有医疗决策必须咨询专业医生。在紧急情况下，请立即拨打急救电话或前往医院。

---

## 📄 开源协议
本项目遵循 [MIT License](LICENSE) 协议。