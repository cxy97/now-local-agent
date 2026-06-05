# NOW｜AI 本地生活 Agent — 浅色高保真原型

## 概述

这是一个独立的前端原型，用于参考 NOW 产品的浅色高保真视觉风格。

## 文件说明

- `App.jsx` — React 组件，完整的单页 Demo
- `style.css` — 样式文件，黑金风格改为浅色高保真风格

## 运行方式

由于这是独立原型文件（非 Vite 项目），有两种参考方式：

### 方式一：复制到 Vite 项目
将 `App.jsx` 内容替换到 `/Users/tanwumima1234/now-local-agent/src/App.jsx`
将 `style.css` 内容替换到 `/Users/tanwumima1234/now-local-agent/src/style.css`

### 方式二：单独预览
需要自行搭建简单的 HTTP 服务器或 React 环境来预览样式效果。

## 设计说明

### 视觉风格
- 背景：浅灰 #F5F6F8
- 卡片：纯白 #FFFFFF，带柔和阴影
- 边框：浅灰 #EAEAEA，大圆角 22px
- 强调色：美团黄 #FFD100

### 字体
- 主字体：-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif
- 品牌名使用超大字号（34px），突出产品名

### 布局
- 三栏固定比例：320px / 1fr / 1.28fr
- 每栏独立滚动
- 卡片式容器

### 交互设计
- 输入框 hover/focus 边框变黄色
- 按钮 hover 上浮 + 阴影增强
- 步骤卡片带 Tool Calling 感
- 时间线用黄点 + 竖线连接
