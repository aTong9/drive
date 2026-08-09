# RoadLens Planner

面向个人自驾摄影创作者的地图化路线规划与拍摄资料系统。

当前仓库完成的是第一个可执行纵向切片：一个版本化数据契约、少量来源核验路线、跨实体一致性校验，以及从筛选条件到路线拍摄方案的服务层演示。

首版 Web UI 已接入同一数据链路，包含路线筛选、响应式路线列表、地图化途经点、路线详情、设备参数和拍摄计划交互。

拍摄计划使用浏览器本地存储保存在当前设备，支持日期、创作目标、计划/已拍摄状态、删除和返回路线；它不会修改只读的 Catalog 数据。

## 快速开始

```bash
npm install
npm test
```

启动本地界面：

```bash
npm run dev
```

## 高德地图

本地开发从根目录 `.ENV_AMAP` 读取 Web 端（JS API）凭据：

```text
key="你的 Web JS API Key"
security="你的 securityJsCode"
```

`.ENV_AMAP` 已被 Git 忽略。地图采用高德 JS API 2.0，Catalog 坐标必须保持 GCJ-02；路线切换会通过 `AMap.Driving` 使用起点、终点及最多 16 个途经点重新规划真实道路，并显示高德返回的驾车距离、预计时间、收费和限行结果。

拍摄行程时长与驾车时间含义不同：Catalog 的 `estimatedDurationMinutes` 包含停车和拍摄，高德返回的时间只表示当次驾车规划估算。`park-and-walk` 地点仍须在合法停车区域下车步行，规划终点只代表其道路附近。

本地开发使用明文 `securityJsCode`。正式部署前应按高德官方建议改为服务端代理安全密钥，并在高德控制台配置实际访问域名白名单。

单独运行夜景路线规划：

```bash
npm run demo:plan -- night 180 深圳
```

参数依次是拍摄模式、最长分钟数和城市。可用模式由契约定义。

## 数据流

```text
data/catalog.json
→ JSON Schema 与引用校验
→ TypeScript 领域模型
→ routeService 筛选和解析
→ CLI 或 React UI 输出路线、拍摄点、设备与建议
```

关键文件：

- `schemas/roadlens-catalog.schema.json`：字段和枚举的唯一事实来源。
- `schema.md`：契约设计、可信度和版本演进说明。
- `data/catalog.json`：3 条路线、6 个地点、3 个设备预设和 1 个拍摄计划。
- `scripts/validate-data.mjs`：结构与跨实体校验。
- `src/services/routeService.ts`：与 UI 无关的路线推荐服务。
- `src/components`：地图、路线与通用展示组件。
- `src/app/store.ts`：模式、搜索和选中路线等跨组件交互状态。

## 数据可信度

样例地点已完成来源和坐标检查，路线组合仍是待实地确认的编辑建议。应用必须显示 `source-checked` 与 `field-checked` 的差异，不能把样例当作实时导航、开放或停车承诺。

坐标统一为 GCJ-02。实际出发前应使用地图服务获取最新道路、管制和停车信息。

## 文档

- 产品阶段：`roadmap.md`
- 架构边界：`architecture.md`
- 数据契约：`schema.md`
- 录入审核：`data-generation-guide.md`
- Agent 规则：`agent-rules.md`
