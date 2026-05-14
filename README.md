# 双碳管理系统 - 用户前端

基于 RuoYi-Vue3 框架改造的双碳采购网用户前端项目。

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

## 开发环境

- Node.js >= 16
- pnpm（包管理器）

## 快速开始

```bash
# 安装 pnpm（如未安装）
npm i pnpm -g

# 配置镜像源
pnpm config set registry https://registry.npmmirror.com/

# 安装依赖
pnpm i

# 启动开发服务器
pnpm run dev
```

开发服务器默认运行在 `http://localhost:8082`，API 请求代理到 `http://127.0.0.1:9090`。

## 构建部署

```bash
# 生产环境打包
pnpm run build:prod

# 预发布环境打包
pnpm run build:stage

# 预览打包结果
pnpm run preview
```

构建产物输出到 `dist2/` 目录。

## 项目结构

```
├── bin/                    # 构建/运行脚本
├── public/                 # 静态资源
├── src/
│   ├── api/                # API 请求（按业务模块分目录）
│   ├── assets/             # 样式、图标、图片
│   ├── components/         # 公共组件
│   ├── directive/          # 自定义指令（权限控制）
│   ├── layout/             # 布局组件
│   ├── plugins/            # 插件（缓存、认证、弹窗等）
│   ├── router/             # 路由配置
│   ├── store/              # Vuex 状态管理
│   ├── utils/              # 工具函数
│   ├── views/              # 页面组件
│   ├── main.js             # 应用入口
│   ├── permission.js       # 路由守卫
│   └── settings.js         # 全局配置
├── vite/                   # Vite 插件配置
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
├── .env.staging            # 预发布环境变量
└── vite.config.js          # Vite 配置
```

## 核心模块

- **bid** — 招标采购（公告列表、详情、文件管理）
- **enterprise** — 企业管理（企业信息、投标管理）
- **information** — 资讯中心
- **policylaw** — 政策法规
- **community** — 社区（帖子发布、详情）
- **complaint** — 投诉管理
- **member** — 会员（充值、权益对比）
- **chat** — 在线问答

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_APP_TITLE` | 页面标题 |
| `VITE_APP_ENV` | 当前环境标识 |
| `VITE_APP_BASE_API` | API 请求前缀 |
| `VITE_BUILD_COMPRESS` | 打包压缩方式（gzip） |

各环境 API 前缀：开发 `/dev-api`、预发布 `/stage-api`、生产 `/prod-api`。
