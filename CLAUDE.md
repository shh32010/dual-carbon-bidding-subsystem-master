# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

双碳管理系统（双碳采购网）用户前端，基于 RuoYi-Vue3 框架改造，使用 Vue 3 + Vite + Element Plus + Vuex 构建。

## 常用命令

```bash
pnpm i                 # 安装依赖
pnpm run dev           # 启动开发服务器 (localhost:8082)
pnpm run build:prod    # 生产环境打包
pnpm run build:stage   # 预发布环境打包
pnpm run preview       # 预览打包结果
```

后端代理目标：`http://127.0.0.1:9090`，通过 `/dev-api` 前缀转发。

## 架构概览

### 目录结构

- `src/api/` — 各模块 API 请求，按业务领域分目录（bid/、chat/、community/、member/、monitor/、system/ 等），每个文件导出 request 方法
- `src/views/` — 页面组件，按业务模块分目录（bid/、community/、complaint/、enterprise/、information/、member/、policylaw/）
- `src/store/modules/` — Vuex 模块：app、user、permission、settings、tagsView
- `src/router/index.js` — 路由定义，分为 constantRoutes（公共）和 dynamicRoutes（权限动态加载）
- `src/layout/` — 布局组件：AppMain、EnterpriseMain、平台布局等
- `src/components/` — 公共组件（Pagination、FileUpload、ImagePreview、Editor、Chat 等）
- `src/plugins/` — 插件：auth、cache、download、modal、tab
- `src/utils/` — 工具函数：request（axios 封装）、auth、ruoyi、permission、jsencrypt 等
- `src/directive/permission/` — 权限指令
- `vite/plugins/` — Vite 插件配置
- `bin/` — 构建/运行脚本（build.bat、run-web.bat）

### 请求层

`src/utils/request.js` 基于 axios 封装：
- baseURL 从环境变量 `VITE_APP_BASE_API` 读取
- 请求拦截器自动携带 Bearer token，GET 参数序列化，POST/PUT 防重复提交
- 响应拦截器处理 code 401（自动弹出重新登录）、500、601 等状态码
- 导出 `download()` 方法用于文件下载

API 文件直接调用 `service.get/post/put/del`，返回 Promise。

### 权限与路由

`src/permission.js` 实现路由守卫：
- 已登录用户访问 `/login` 重定向到 `/index`
- 未登录时，白名单路由可直接访问（login、index、bid/list、info/list 等公开页面）
- 已登录但未拉取用户信息时，调用 `GetInfo` → `GenerateRoutes` 动态添加路由

### 环境变量

三个环境文件控制 `VITE_APP_BASE_API`：
- `.env.development` → `/dev-api`（开发）
- `.env.staging` → `/stage-api`（预发布）
- `.env.production` → `/prod-api`（生产）

构建产物输出到 `dist2/` 目录。

### 全局方法

`src/main.js` 通过 `app.config.globalProperties` 挂载全局方法，可在组件中通过 `this` 访问：
- `getDicts`、`getConfigKey` — 字典/配置获取
- `parseTime`、`resetForm`、`addDateRange` — 工具方法
- `selectDictLabel`、`download`、`handleTree` — 业务工具
- `msgSuccess`、`msgError`、`msgInfo` — 消息提示

全局组件：`Pagination`、`FileUpload`、`ImagePreview`、`RightToolbar`、`DictTag`、`svg-icon`。

### 样式

使用 SCSS，入口为 `src/assets/styles/index.scss`，通过 Vite 自动注入。Element Plus 使用中文 locale。
