# 心语树·高校心理健康咨询与数字媒体交互平台 (微信小程序 + Java后端)

基于需求规范完整设计与研发的**高校心理咨询与数字媒体交互平台**，包含独立的**微信小程序前端工程（`frontend/`）**与 **Java Spring Boot 后端工程（`backend/`）**。

---

## 🏗️ 项目目录结构

```
campus-psychological-counseling/
├── frontend/                     # 微信小程序前端工程 (与 backend 同级)
│   ├── pages/                   # 全部 13 个业务功能页面
│   │   ├── auth/                # 独立登录与注册页面 (学生端/咨询师端)
│   │   ├── index/               # 首页 (心晴问候、快捷入口、咨询师推荐、科普精选)
│   │   ├── appointment/         # 在线预约 (咨询师列表、排班详情、预约申请、预约记录)
│   │   ├── assessment/          # 心理测评 (SDS/SAS标准量表作答、Canvas 2D雷达图报告)
│   │   ├── treehole/            # 匿名树洞 (倾诉广场、发帖、抱抱互动、回音评论)
│   │   ├── relax/               # 放松专区 (4-7-8呼吸训练动效、自然白噪音播放器)
│   │   ├── mine/                # 个人中心 (苹果iOS风格、身份认证、情绪日记、隐私设置、退出)
│   │   ├── counselor/           # 咨询师端 (工作台、排班管理、预约审批、危机预警、咨询记录)
│   │   └── admin/               # 管理员端 (控制台、账号审核、文章发布、树洞审核、数据大屏)
│   ├── utils/                   # 工具类 (api网络请求、本地持久化存储、Canvas 2D图表引擎)
│   ├── images/                  # 图标素材
│   ├── app.js / app.json / app.wxss  # 全局逻辑、路由配置与苹果iOS风格视觉体系
│   └── project.config.json      # 小程序独立工程配置
│
├── backend/                      # Java Spring Boot 后端服务工程
│   ├── src/main/java/           # 后端源码 (Controller, Service, Entity, Repository, DTO)
│   ├── src/main/resources/      # 配置文件 (application.yml)
│   ├── campus_psychology.sql    # 完整的 MySQL 数据库建表与种子数据脚本
│   ├── pom.xml                  # Maven 构建配置 (Spring Boot 2.7 + Spring Data JPA + MySQL)
│   └── start-server.bat         # 后端服务一键启动脚本
│
├── docs/                        # 需求文档与产品设计规范
├── project.config.json          # 根目录微信开发者工具配置 (自动指向 frontend/)
├── start-server.bat             # 根目录下的一键后端启动脚本
└── README.md                    # 项目说明文档
```

---

## 💻 整体技术架构

- **前端架构**：原生微信小程序（Native WeChat Mini Program）
  - 目录：`frontend/`
  - 采用 **Canvas 2D** 原生渲染高清心理量表多维雷达图、情绪趋势折线图与全校数据大屏环形图；
  - 遵循 **Apple iOS HIG（苹果人机交互指南）** 视觉标准：Inset Grouped Card、微胶囊指示器、微拟物设置图标、触觉回弹动画；
  - 首屏强制进入独立的登录/注册页面（`pages/auth/login`），登录后分流跳转；
  - 配备智能双模机制：Java 后端在线时直连接口，离线时无缝降级为本地持久化模拟存储。
- **后端架构**：**Java Spring Boot 2.7 + Spring Data JPA + MySQL + JWT**
  - 目录：`backend/`
  - 端口：`8088` (API 统一前缀：`/api`)
  - 数据库：纯正 MySQL 数据库，提供建表与初始数据脚本 `backend/campus_psychology.sql`
  - 安全与鉴权：基于 JWT (JSON Web Token) 的无状态签名授权。

---

## 🚀 启动与运行指南

### 1. 启动 Java 后端
1. 在您的 MySQL 服务器中执行建表脚本 `backend/campus_psychology.sql`；
2. 打开 `backend/src/main/resources/application.yml`，修改为您的 MySQL 服务器 IP、端口、账号和密码；
3. 双击根目录下的 **`start-server.bat`** 即可一键启动服务（运行在 `http://localhost:8088`）。

### 2. 启动微信小程序前端
1. 打开 **微信开发者工具**；
2. 点击 **“导入项目”**：
   - 方式一：直接选择本项目根目录（已配置 `miniprogramRoot: "frontend/"`）；
   - 方式二：或者直接选择 `frontend/` 文件夹导入；
3. AppID 可选择 **“测试号”**（Tourist AppID）；
4. 在开发设置中，勾选 **“不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书”**；
5. 点击编译即可直接使用！

---

### 🔑 预设测试账号

| 身份角色 | 登录账号 | 初始密码 | 身份说明 |
| :--- | :--- | :--- | :--- |
| **学生端** | `student` | `123456` | 林微光 (数字媒体艺术 大二) |
| **咨询师端** | `counselor` | `123456` | 陈清心 教授 (二级心理咨询师) |
| **管理员端** | `admin` | `123456` | 系统安全管理员 |
