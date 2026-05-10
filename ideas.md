# 截图文字提取 PWA - 设计方案

<response>
<text>
## 方案 A：极简工具主义（Minimal Toolist）

**Design Movement**: 瑞士国际主义风格 + 现代工具美学
**Core Principles**:
1. 功能即美学——每一个元素都有其存在的理由
2. 强对比度黑白基调，辅以单一高亮色
3. 大字体数字/标签作为视觉锚点
4. 严格的网格对齐，无装饰元素

**Color Philosophy**: 纯白底 (#FFFFFF) + 深炭黑 (#1A1A1A) + 电光蓝 (#0066FF) 作为唯一强调色。冷静、专业、无情绪干扰。

**Layout Paradigm**: 全屏单列布局，顶部固定标题栏，中央超大上传区域，底部结果区。无侧边栏，无多余导航。

**Signature Elements**:
- 虚线边框的拖拽上传区（Dashed Drop Zone）
- 等宽字体展示提取文字结果
- 极细分割线

**Interaction Philosophy**: 即时反馈，无多余动画，操作即结果。

**Animation**: 仅有进度条和淡入效果，0.15s 极短过渡。

**Typography System**: Geist Mono（结果展示）+ Inter（UI 标签）
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## 方案 B：暗色科技感（Dark Tech Craft）✅ 选定方案

**Design Movement**: 暗色系精密仪器美学 + 移动端原生感
**Core Principles**:
1. 深色背景营造沉浸感，减少手机屏幕眩光
2. 渐变高亮色（靛蓝→紫罗兰）作为品牌色
3. 毛玻璃卡片（backdrop-blur）增加层次感
4. 圆角柔和，触控友好的大按钮

**Color Philosophy**: 深空黑 (#0F0F13) 背景 + 靛紫渐变 (#6366F1 → #8B5CF6) 主色 + 浅灰文字 (#E2E8F0)。营造专注、高效的夜间工作氛围。

**Layout Paradigm**: 手机端全屏竖向流，顶部品牌标识，中部功能区（上传/拍照切换 Tab），底部滑动展示结果。

**Signature Elements**:
- 渐变边框光晕的上传区域
- 毛玻璃结果卡片
- 脉冲动画的处理状态指示器

**Interaction Philosophy**: 触控优先，大点击区域，触觉反馈感的按压效果（scale 动画）。

**Animation**: 上传区悬停时渐变光晕扩散；处理中脉冲波纹；结果卡片从底部滑入（0.3s ease-out）。

**Typography System**: Space Grotesk（标题，现代感强）+ Noto Sans SC（中文内容）
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## 方案 C：柔和纸质感（Warm Paper Craft）

**Design Movement**: 日式简约 + 纸质纹理美学
**Core Principles**:
1. 米白暖色调，模拟纸张质感
2. 手写风格装饰元素
3. 柔和阴影替代硬边框
4. 自然、无压力的视觉体验

**Color Philosophy**: 暖米白 (#FAF8F3) 底 + 深棕 (#3D2B1F) 文字 + 橘赭 (#E07B39) 强调色。温暖、人文、有手工感。

**Layout Paradigm**: 居中卡片式布局，模拟便签纸叠放效果，结果区域像一张展开的便签。

**Signature Elements**:
- 纸张纹理背景（CSS noise）
- 手写体标题
- 便签式结果卡片（带折角效果）

**Interaction Philosophy**: 慢节奏、有质感，像翻阅纸张一样自然。

**Animation**: 卡片翻转进入，纸张展开效果（0.4s cubic-bezier）。

**Typography System**: Caveat（手写标题）+ Noto Serif SC（正文）
</text>
<probability>0.06</probability>
</response>

---

## 选定方案：方案 B — 暗色科技感（Dark Tech Craft）

选择理由：
- 手机端夜间使用体验更佳，减少眼部疲劳
- 渐变色与毛玻璃效果在移动端视觉冲击力强
- 暗色主题是现代工具类 App 的主流选择
- 与 OCR 工具的"科技感"定位高度契合
