# RoadLens Planner Agent 开发规则

## 开发顺序

```text
数据契约 → 数据 → 类型 → 服务 → 组件 → 页面 → 体验
```

禁止从页面开始堆业务逻辑，禁止组件直接读取 JSON。

## 修改前必读

- `roadmap.md`：产品阶段与范围。
- `architecture.md`：代码边界。
- `schema.md`：契约设计和演进规则。
- `schemas/roadlens-catalog.schema.json`：字段与枚举的唯一事实来源。

其他文档不得重新定义字段、枚举或状态。

## 数据契约变更

允许数据结构按产品需要演进，但必须同时：

1. 按语义化版本更新 `schemaVersion`。
2. 修改 JSON Schema。
3. 修改 TypeScript 类型。
4. 提供迁移说明或迁移脚本。
5. 更新样例并通过 `npm test`。

禁止无版本、无迁移地改变字段含义。

## 新增路线

1. 先核验地点真实存在、坐标和到达方式。
2. 在 Location 中记录来源及其实际支持的事实。
3. Route 只引用有序 Location ID，不复制地点坐标。
4. 明确区分可驾车节点与停车后步行节点。
5. 标注路线组合、时间、评分与建议中的编辑判断。
6. 运行数据校验和服务层演示。
7. 有实地经验后才把状态升级为 `field-checked`。

禁止：

- 虚构道路或景点。
- 使用无法追溯的坐标。
- 把地图厂商的地点存在性当作停车可用性证据。
- 把静态编辑路线描述成实时导航。
- 为了数量录入普通或重复地点。

## 来源规则

优先使用政府、景区管理机构、地图厂商等一手来源。每个来源必须记录访问日期，并通过 `supports` 声明它支持存在、地址、坐标、通行或拍摄价值中的哪些事实。

地点至少有一个坐标来源。停车、开放时间、道路管制等易变信息应提示用户以现场或当日公告为准。

## TypeScript 与服务

- 领域对象必须有明确类型。
- 禁止使用 `any`。
- `unknown` 只允许出现在外部输入边界，并必须立即校验收窄。
- 页面和组件通过 services 获取数据。
- Zustand 只管理跨组件交互状态，不复制 Catalog。
- 可复用组件使用领域名称，例如 `RouteCard`，不用城市专属名称。

## 相机参数

预设必须绑定场景，并说明它只是现场调整的起点。可计算范围使用结构化数字，不把范围塞进字符串。

## 提交与质量

建议提交格式：

```text
feat(map): add route marker layer
data(route): add source-checked coastal route
fix(data): correct coordinate reference
docs(schema): explain contract migration
```

提交前运行：

```bash
npm test
```

当前检查覆盖数据结构、ID 唯一性、引用完整性、坐标证据、类型检查和一次路线规划闭环。

## 产品边界

RoadLens Planner 的核心是：

```text
真实地点 + 可执行路线 + 最佳条件 + 场景参数 + 创作价值 + 验证证据
```

MVP 阶段不开发登录、支付、社区、CMS 或其他无助于拍摄闭环的功能。
