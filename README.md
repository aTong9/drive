# RoadLens Planner

面向个人自驾摄影创作者的地图化路线规划与拍摄资料系统。

当前仓库完成的是第一个可执行纵向切片：一个版本化数据契约、少量来源核验路线、跨实体一致性校验，以及从筛选条件到路线拍摄方案的服务层演示。

首版 Web UI 已接入同一数据链路，包含路线筛选、响应式路线列表、地图化途经点、路线详情、设备参数和拍摄计划交互。

探索路线首次打开时会请求浏览器定位，并通过高德逆地理编码识别当前城市，默认展示该城市的来源核验地点和路线；拒绝定位或识别失败时可以重新定位或切换回全国浏览。

拍摄计划使用浏览器本地存储保存在当前设备，支持日期、创作目标、计划/已拍摄状态、删除和返回路线；它不会修改只读的 Catalog 数据。

地点库按“全国 → 地理分区 → 省级行政区 → 城市/地级区域”组织，全国行政目录与已核验拍摄内容分层展示；目前 34 个省级单位均有来源核验地点和可探索路线。地点详情展示坐标、到达方式、拍摄条件、来源证据与关联路线。实地核验记录保存在当前设备，可回填停车、光线、声音和综合备注，不会把个人观察直接写回来源数据。

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

## GitHub Pages 自动发布

推送到 `master` 分支后，GitHub Actions 会先运行完整测试，再构建并发布到 GitHub Pages。首次使用时，请在仓库的 **Settings → Pages** 中将 Source 设为 **GitHub Actions**。

为了让线上地图正常工作，请在仓库的 **Settings → Secrets and variables → Actions** 中添加：

- `AMAP_KEY`：高德 Web 端 JS API Key。
- `AMAP_SECURITY_CODE`：对应的 `securityJsCode`。

同时需要在高德控制台把 `https://atong9.github.io/drive/` 对应域名加入安全域名白名单。工作流也支持在 Actions 页面手动触发发布。

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
- `schemas/regions.schema.json`：全国行政区导航的数据契约。
- `schemas/davinci-workflow.schema.json`：达芬奇后期流程的数据契约。
- `schemas/field-check-export.schema.json`：实地核验交换文件的数据契约。
- `schemas/youtube-creators.schema.json`：创作者研究、代表内容、证据链接与策略归纳的数据契约。
- `schema.md`：契约设计、可信度和版本演进说明。
- `data/catalog.json`：68 条路线、136 个地点、4 个设备预设和 1 个拍摄计划；这些内容必须有来源证据。全国 34 个省级单位均已有来源核验地点和可探索路线；尚无真实内容的城市仍会按实际情况显示“待核验”。
- `data/youtube-creators.json`：29 位全球创作者案例，覆盖风景驾车、城市步行、雨中步行、静态自然声景、电影化风景与户外路线，并记录代表内容、可复用模式和风险边界。
- `data/regions.json`：全国 34 个省级行政区及城市/地级区域目录；只负责导航覆盖，不伪装成已核验地点。
- `data/youtube-creators.json`：20 个全球代表频道，覆盖风景驾车、雨天步行、自然定点、城市步行、路线导览和电影风景；播放原因是基于公开素材的编辑推断，不是 YouTube 官方归因。

数据校验会固定核对 34 个省级单位，要求每个省级单位至少有一个来源核验地点和一条可探索路线，并验证地点、路线及途经点引用的省市关系。服务测试还会证明六大地理分区对全国目录恰好完成一次无重复划分。

大陆地点使用 GCJ-02；台湾、香港、澳门地点使用 WGS84。校验器会阻止坐标系与所属区域不匹配，并要求 34 个省级单位至少各有一条来源核验地点。
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
