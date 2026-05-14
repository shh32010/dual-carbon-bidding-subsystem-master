# 双碳管理系统 - 用户前端

双碳采购网用户前端，基于 RuoYi-Vue3 框架改造，提供招投标信息发布、企业服务、会员管理、社区交流等功能。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.2.45 | 渐进式 JavaScript 框架 |
| Vite | 3.2.3 | 前端构建工具 |
| Element Plus | 2.2.27 | UI 组件库 |
| Vuex | 4.1.0 | 状态管理 |
| Vue Router | 4.1.4 | 路由管理 |
| Axios | 0.27.2 | HTTP 请求 |
| ECharts | 5.4.0 | 数据可视化 |
| Sass | 1.56.1 | CSS 预处理器 |

## 开发环境要求

- Node.js >= 16
- pnpm

## 快速开始

```bash
# 安装依赖
pnpm i

# 启动开发服务器
pnpm run dev
```

开发服务器运行在 `http://localhost:8082`，API 请求通过 `/dev-api` 前缀代理到后端 `http://127.0.0.1:9090`。

## 构建

```bash
pnpm run build:prod    # 生产环境打包 → dist2/
pnpm run build:stage   # 预发布环境打包 → dist2/
pnpm run preview       # 预览打包结果
```

## 项目结构

```
src/
├── api/                        # API 请求模块
│   ├── bid/                    # 招投标（公告、资讯、政策法规、投诉）
│   ├── chat/                   # 智能问答
│   ├── community/              # 社区（帖子、评论）
│   ├── member/                 # 会员（商品、订单、支付）
│   ├── order/                  # 订单
│   ├── saleReport/             # 销售报表
│   └── system/                 # 系统（用户、字典、配置）
├── views/                      # 页面组件
│   ├── bid/                    # 招标公告列表 & 详情
│   ├── bidMessage/             # 招标消息
│   ├── information/            # 资讯中心
│   ├── policylaw/              # 政策法规
│   ├── community/              # 社区（帖子列表、详情、发布）
│   ├── complaint/              # 投诉管理
│   ├── enterprise/             # 企业管理
│   ├── member/                 # 会员（购买、权益对比）
│   └── error/                  # 错误页面
├── components/                 # 公共组件
│   ├── Chat/                   # 智能问答对话框
│   ├── Editor/                 # 富文本编辑器
│   ├── FileUpload/             # 文件上传
│   ├── ImageUpload/            # 图片上传
│   ├── ImagePreview/           # 图片预览
│   ├── Pagination/             # 分页
│   ├── Breadcrumb/             # 面包屑导航
│   ├── TopNav/                 # 顶部导航
│   ├── Platform/               # 首页卡片
│   ├── SliderCaptcha/          # 滑块验证码
│   └── SignBoard/              # 签名板
├── router/index.js             # 路由配置（公共路由 + 动态权限路由）
├── store/                      # Vuex 状态管理
│   └── modules/                # app / user / permission / settings / tagsView
├── layout/                     # 布局组件（侧边栏、顶栏、主内容区）
├── plugins/                    # 插件（auth 认证、cache 缓存、download 下载、modal 弹窗）
├── utils/                      # 工具函数
│   └── request.js              # Axios 封装（Token 注入、请求拦截、响应拦截）
├── directive/permission/       # 权限指令
├── assets/styles/              # 全局样式（SCSS 入口）
├── main.js                     # 应用入口（挂载全局方法和组件）
├── permission.js               # 路由守卫（登录校验、动态路由加载）
└── settings.js                 # 全局配置（标题、主题、导航模式）
```

## 核心功能模块

| 模块 | 路由 | 说明 |
|------|------|------|
| 招标公告 | `/bid/list`, `/bid/detail` | 招标公告列表、详情查看 |
| 资讯中心 | `/info/list`, `/info/detail` | 行业资讯浏览 |
| 政策法规 | `/policylaw/list`, `/policylaw/detail` | 政策法规查阅 |
| 社区 | `/community/list`, `/community/detail/:id`, `/community/add` | 帖子发布、浏览、点赞、收藏、评论 |
| 投诉 | `/complaint/list`, `/complaint/detail` | 投诉管理 |
| 企业 | `/enterprise/*` | 企业信息管理 |
| 会员 | `/member/list`, `/member/recharge`, `/member/product-equity-comparison` | 商品浏览、在线支付、权益对比 |
| 智能问答 | 聊天组件 | AI 问答接口 |

## 请求层

`src/utils/request.js` 对 Axios 进行了封装：

- 请求拦截器自动携带 `Bearer Token`，GET 请求序列化参数
- 响应拦截器统一处理 `code 401`（重新登录）、`500`（错误提示）、`601` 等状态码
- 导出 `download()` 方法用于文件下载

API 文件（`src/api/*/`）直接调用封装后的 `service.get/post/put/del`，返回 Promise。

## 权限与路由

`src/permission.js` 实现路由守卫逻辑：

- 已登录用户访问 `/login` 自动重定向到首页
- 未登录时，白名单路由（首页、招标列表、资讯等公开页面）可直接访问
- 已登录但未拉取用户信息时，自动获取用户信息并动态添加权限路由

## 环境变量

| 文件 | `VITE_APP_BASE_API` | 说明 |
|------|---------------------|------|
| `.env.development` | `/dev-api` | 开发环境 |
| `.env.staging` | `/stage-api` | 预发布环境 |
| `.env.production` | `/prod-api` | 生产环境 |

## 全局方法

通过 `app.config.globalProperties` 挂载，组件内可通过 `this` 访问：

- `getDicts` / `getConfigKey` — 字典和配置获取
- `parseTime` / `resetForm` / `addDateRange` — 通用工具
- `selectDictLabel` / `download` / `handleTree` — 业务工具
- `msgSuccess` / `msgError` / `msgInfo` — 消息提示

全局注册组件：`Pagination`、`FileUpload`、`ImagePreview`、`RightToolbar`、`DictTag`、`svg-icon`。
