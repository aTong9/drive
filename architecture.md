# RoadLens Planner 架构规范

## 核心原则

1. 数据驱动 UI。
2. 地图是核心入口。
3. 先完成小型纵向闭环，再扩展模块和数据量。
4. 事实、编辑建议和实时导航信息必须分开。
5. 数据必须先通过运行时校验，再进入强类型服务层。

## 分层

```text
JSON 数据
  ↓ JSON Schema + 业务一致性校验
TypeScript 领域类型
  ↓
services（查询、筛选、引用解析）
  ↓
hooks / Zustand（跨组件交互状态）
  ↓
components
  ↓
pages
```

页面不得直接读取或解释 JSON。组件不得自行解析地点引用或重新实现筛选逻辑。

当前可执行纵向样例：

```text
data/catalog.json
→ scripts/validate-data.mjs
→ src/types/domain.ts
→ src/services/routeService.ts
→ src/cli/plan.ts
```

CLI 是服务层的最小消费者，后续地图页面复用相同服务，而不是另写一套逻辑。

## 前端目标结构

```text
src/
├── app/
├── pages/
├── components/
│   ├── map/
│   ├── route/
│   ├── location/
│   ├── camera/
│   └── common/
├── hooks/
├── services/
├── types/
└── utils/
```

一个组件只负责一类展示或交互。禁止创建城市专属组件，例如 `ShenzhenRouteCard`；使用由数据驱动的 `RouteCard`。

## 状态管理

Zustand 仅保存跨页面交互状态，例如模式、筛选条件和选中实体。Catalog 数据由服务层读取，不在 Store 内复制一份。

## 地图与坐标

第一阶段使用高德地图 JS API 2.0 和 GCJ-02。地图加载封装在 `services/amapLoader.ts`，组件只负责地图实例和覆盖物生命周期。API Key 与 securityJsCode 从本地环境注入并限制允许域名，不提交到 Git；生产环境应使用服务端代理隐藏安全密钥。

地点存储可核验坐标；路线导航和实时路况由地图服务生成。以后增加 GPX 时，坐标转换位于数据导入边界。

## 数据与 API 演进

`Catalog` 是服务层稳定边界。静态 JSON 拆文件、迁移 SQLite 或改为远程 API 时，页面和组件不应改变。

数据结构允许演进，但必须遵守 `schema.md` 的版本规则、同步 JSON Schema 与 TypeScript 类型，并说明迁移方式。禁止无版本、无迁移地修改契约。

## 质量门槛

```bash
npm run validate:data
npm run build
npm run demo:plan
```

新增数据必须通过结构、唯一性、引用完整性和来源证据检查。新增服务逻辑应补单元测试；前端建立后再增加组件和端到端测试。
