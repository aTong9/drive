# RoadLens Planner

面向个人自驾摄影创作者的地图化路线规划与拍摄资料系统。

当前仓库完成的是第一个可执行纵向切片：一个版本化数据契约、少量来源核验路线、跨实体一致性校验，以及从筛选条件到路线拍摄方案的服务层演示。

首版 Web UI 已接入同一数据链路，包含路线筛选、响应式路线列表、地图化途经点、路线详情、设备参数和拍摄计划交互。

拍摄计划使用浏览器本地存储保存在当前设备，支持日期、创作目标、计划/已拍摄状态、删除和返回路线；它不会修改只读的 Catalog 数据。

地点库按“全国 → 省 → 城市”组织，并支持按类型检索，展示坐标、到达方式、拍摄条件、来源证据与关联路线。当前录入范围是广东省深圳市与惠州市。实地核验记录保存在当前设备，可回填停车、光线、声音和综合备注，不会把个人观察直接写回来源数据。

地点同时包含版本化声音环境信息，区分主要声景、噪声风险、人流风险、天气敏感性和收音建议。核验 JSON 支持导入与导出，导入时会检查格式、Catalog 版本和地点引用。

相机参数库按设备与场景检索 Catalog 预设，集中展示分辨率、帧率、快门、光圈、ISO、白平衡、色彩配置和现场调整逻辑，并可跳回适用路线。地点库可将全部实地核验记录导出为版本化 JSON，文件同时携带 Catalog 契约版本、导出时间和地点快照，方便备份与后续导入校验。

后期流程库按照 DaVinci Resolve 的媒体、照片、快编、剪辑、Fusion、调色、Fairlight 和交付工作区整理。既可按类目查看输入、关键动作与完成标准，也可把 24 项整套流程导入为当前设备上的可勾选清单。导入时可关联已有拍摄计划，并自动生成包含路线、主拍法、素材地点和相机参数的后期交接摘要；完成进度使用浏览器本地存储保存。

个人资产 Dashboard 汇总路线、核验覆盖、拍摄/发布状态和后期进度，并提供只引用已验证路线的可解释推荐。地图支持导入标准 GPX：源坐标按 WGS84 读取，在地图边界转换为 GCJ-02 后绘制，不替代高德实时道路规划。

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

`.ENV_AMAP` 已被 Git 忽略。地图采用高德 JS API 2.0，Catalog 坐标必须保持 GCJ-02；驾车与步行采风路线切换会通过 `AMap.Driving` 使用起点、终点及最多 16 个途经点重新规划真实道路，并显示高德返回的驾车距离、预计时间、收费和限行结果。林间定点路线只展示入口与景区导航锚点，不生成景区内部驾车路线。

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
- `schemas/davinci-workflow.schema.json`：达芬奇后期流程的数据契约。
- `schemas/field-check-export.schema.json`：实地核验交换文件的数据契约。
- `schema.md`：契约设计、可信度和版本演进说明。
- `data/catalog.json`：11 条路线、29 个地点、4 个设备预设和 1 个拍摄计划；广东 21 个地级市均进入城市导航，已有 12 个城市具备来源核验地点。
- `data/davinci-workflow.json`：8 个达芬奇工作区、24 项后期任务和每阶段完成标准。
- `scripts/validate-data.mjs`：结构与跨实体校验。
- `src/services/routeService.ts`：与 UI 无关的路线推荐服务。
- `src/services/fieldCheckExport.ts`：版本化实地核验 JSON 导出。
- `src/services/gpxImport.ts`：GPX 解析与 WGS84→GCJ-02 转换边界。
- `src/services/dashboardService.ts`、`recommendationService.ts`：资产聚合与可解释路线推荐。
- `src/components`：地图、路线与通用展示组件。
- `src/app/store.ts`：模式、搜索和选中路线等跨组件交互状态。

## 数据可信度

样例地点已完成来源和坐标检查，路线组合仍是待实地确认的编辑建议。应用必须显示 `source-checked` 与 `field-checked` 的差异，不能把样例当作实时导航、开放或停车承诺。

坐标统一为 GCJ-02。实际出发前应使用地图服务获取最新道路、管制和停车信息。

“符合条件”在当前数据集中特指：位于深圳或惠州、拥有公开可访问的来源页面、坐标证据、明确拍摄价值，并能说明到达与安全边界的地点。它不是两市全部景点名录；未满足证据要求的 POI 不进入 Catalog。

## 文档

- 产品阶段：`roadmap.md`
- 架构边界：`architecture.md`
- 数据契约：`schema.md`
- 录入审核：`data-generation-guide.md`
- Agent 规则：`agent-rules.md`
