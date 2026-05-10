# 📸 截图文字提取 OCR PWA

一个手机端 PWA 网页应用，支持上传截图或拍照，使用 OCR 技术智能提取图片中的文字内容。

## ✨ 功能特性

- **📤 上传图片** - 支持拖拽或点击上传 JPG、PNG、WebP、HEIC 等格式
- **📷 拍照识别** - 调用设备摄像头实时拍照，即时提取文字
- **🤖 OCR 识别** - 基于 Tesseract.js，支持中英文混合识别
- **📋 一键复制** - 识别结果可快速复制到剪贴板
- **📱 PWA 应用** - 支持离线使用、添加到主屏幕、Service Worker 缓存
- **🎨 暗色科技风** - 深空黑背景 + 靛紫渐变，手机端优化的沉浸式体验

## 🛠 技术栈

- **前端框架**: React 19 + TypeScript
- **样式**: Tailwind CSS 4 + shadcn/ui
- **OCR 引擎**: Tesseract.js（支持 100+ 语言）
- **PWA**: Manifest + Service Worker
- **图标**: Lucide React
- **字体**: Space Grotesk + Noto Sans SC
- **构建工具**: Vite + pnpm

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

### 构建生产版本

```bash
pnpm build
pnpm preview
```

## 📦 项目结构

```
screenshot-ocr-pwa/
├── client/
│   ├── public/              # 静态文件 (manifest.json, sw.js, icons)
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   ├── components/     # 可复用组件
│   │   ├── contexts/       # React Context
│   │   ├── lib/            # 工具函数
│   │   ├── App.tsx         # 主应用组件
│   │   ├── main.tsx        # 入口文件
│   │   └── index.css       # 全局样式
│   └── index.html          # HTML 模板
├── vercel.json             # Vercel 部署配置
└── package.json            # 项目依赖
```

## 🎨 设计理念

采用 **暗色科技感** 设计风格：
- **色调**: 深空黑 (#0F0F13) + 靛紫渐变 (#6366F1 → #8B5CF6)
- **排版**: Space Grotesk（标题）+ Noto Sans SC（正文）
- **交互**: 触控优先，大按钮，脉冲动画处理状态
- **布局**: 手机端全屏竖向流，上传/拍照 Tab 切换

## 📱 PWA 特性

- **离线支持**: Service Worker 缓存核心资源
- **安装到主屏**: 支持 iOS 和 Android 添加到主屏幕
- **原生体验**: 全屏显示，隐藏浏览器 UI
- **快速加载**: 预缓存关键资源，快速启动

## 🔧 配置说明

### manifest.json
定义 PWA 的元数据、图标、启动 URL 等

### sw.js
Service Worker 脚本，处理缓存策略和离线支持

### vercel.json
Vercel 部署配置，包括构建命令、输出目录、路由重写等

## 📖 使用指南

### 上传图片识别

1. 点击 **"上传图片"** 标签页
2. 点击上传区域或拖拽图片
3. 等待 OCR 识别完成
4. 点击 **"复制"** 按钮保存文字

### 拍照识别

1. 点击 **"拍照识别"** 标签页
2. 允许浏览器访问摄像头
3. 点击中央快门按钮拍照
4. 点击 **"开始识别文字"** 按钮
5. 等待识别完成，复制结果

## 🌐 部署

### Vercel 部署

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 选择 GitHub 仓库 `screenshot-ocr-pwa`
4. 点击 **"Deploy"**
5. 等待部署完成，获得生产 URL

### 自定义域名

在 Vercel 项目设置中，添加自定义域名指向你的部署

## 🐛 已知问题

- 某些旧设备可能不支持 Service Worker
- 大型图片识别可能需要较长时间
- 离线模式下无法识别新图片（OCR 需要网络）

## 🚀 未来计划

- [ ] 添加历史记录功能
- [ ] 支持多语言识别选择
- [ ] 文本编辑和格式化
- [ ] 导出为 PDF/TXT
- [ ] 云同步历史记录
- [ ] 批量识别功能

## 📄 许可证

MIT

## 👨‍💻 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请在 GitHub Issues 中反馈。

---

**Made with ❤️ by Screenshot OCR PWA**
