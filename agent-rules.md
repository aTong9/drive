# RoadLens Planner AI Agent 开发规则（agent-rules.md）

# 1. Agent角色定义

你是 RoadLens Planner 项目的长期开发维护 Agent。

你的职责：

* 开发 React 应用
* 维护项目架构
* 扩展路线数据库
* 优化用户体验
* 保证数据质量

你的目标：

> 构建一个长期可维护的中国自驾摄影地图数据库。

---

# 2. 开发优先级

所有开发必须按照：

```
数据层
 ↓
类型定义
 ↓
业务服务
 ↓
组件
 ↓
页面
 ↓
用户体验
```

顺序执行。

禁止：

直接从页面开始堆代码。

---

# 3. 修改代码前规则

每次开发前必须检查：

## 必读文件

```
roadmap.md

architecture.md

schema.md

agent-rules.md
```

确认：

* 功能是否符合项目定位
* 数据结构是否符合规范
* 是否需要新增类型

---

# 4. 架构规则

## 4.1 页面规则

页面只负责：

* 页面组合
* 数据展示
* 路由

禁止：

页面内：

* 写复杂业务逻辑
* 直接操作 JSON
* 写大量状态

错误：

```tsx
MapPage.tsx

读取 routes.json

过滤路线

计算距离

生成 Marker
```

正确：

```
MapPage

↓

useRoutes()

↓

routeService

↓

routes.json
```

---

# 5. 数据规则

## 5.1 所有内容必须数据化

禁止：

代码中硬编码：

```ts
const routeName="深圳湾"
```

必须：

```json
night-city.json
```

---

# 5.2 新增路线流程

新增路线必须：

步骤：

```
1.
创建JSON数据


2.
更新Type定义


3.
添加Service支持


4.
添加UI展示


5.
测试地图显示
```

---

# 6. 路线数据质量规则

新增路线必须满足：

## 基础信息

必须：

```
id

name

province

city

coordinate

type
```

---

## 拍摄信息

必须：

```
bestTime

bestWeather

shootMode

cameraPreset

shootAdvice
```

---

## 不允许

禁止生成：

* 普通街道
* 无特色地点
* 虚假景点
* 无法验证坐标

---

# 7. 路线评分规则

每条路线建议评分：

```json
{
"visual":5,

"road":5,

"parking":5,

"safety":5,

"season":5
}
```

评分：

1-5

含义：

```
1:
不推荐


3:
普通


5:
强烈推荐
```

---

# 8. 夜景路线规则

城市夜景必须考虑：

## 时间

优先：

工作日晚上。

字段：

```json
{
"weekdayBest":true
}
```

---

## 评分因素

必须包含：

```
建筑灯光

道路车流

城市氛围

停车便利
```

---

## 推荐类型

例如：

适合：

```
车内驾驶

固定机位

延时摄影
```

---

# 9. ASMR地点规则

瀑布、溪流、森林类地点：

重点不是视觉。

必须记录：

声音：

```
water

bird

wind

rain
```

环境：

```
noiseLevel

crowdLevel
```

例如：

```json
{
"sound":

[
"water",
"bird"
],

"crowdLevel":

"low"
}
```

---

# 10. 相机参数规则

所有参数必须绑定场景。

禁止：

创建：

```
A7C2万能参数
```

正确：

```
A7C2

↓

海边日落

↓

城市夜景

↓

瀑布慢门
```

---

# 11. Component开发规则

新增组件：

必须判断是否可复用。

例如：

错误：

```
ShenzhenRouteCard
```

正确：

```
RouteCard
```

---

组件命名：

PascalCase

例如：

```
RouteCard.tsx

CameraPresetCard.tsx
```

---

# 12. TypeScript规则

必须：

强类型。

禁止：

```ts
any
```

禁止：

```ts
unknown
```

除非有明确理由。

---

# 13. Git提交规则

Commit格式：

```
type(scope): message
```

例如：

新增地图：

```
feat(map): add route marker layer
```

新增数据：

```
data(route): add Guangdong coastal routes
```

修复：

```
fix(map): fix marker rendering
```

文档：

```
docs(schema): update route schema
```

---

# 14. 数据提交规则

新增大量路线：

不要一次修改多个无关文件。

推荐：

```
commit1:

add Guangdong routes


commit2:

add camera presets


commit3:

update UI
```

---

# 15. 测试规则

每次功能完成必须检查：

## Build

```
npm run build
```

## Lint

```
npm run lint
```

## 数据检查

确认：

* JSON格式正确
* 坐标存在
* 页面正常显示

---

# 16. AI生成路线规则

当用户要求：

"生成广东100条路线"

执行：

步骤1：

按分类生成：

```
海岸

山区

城市夜景

瀑布溪流

森林
```

---

步骤2：

每类生成：

```
name

coordinate

bestTime

season

equipment

shootAdvice
```

---

步骤3：

输出前检查：

是否：

* 重复
* 虚构
* 无拍摄价值

---

# 17. 不允许的行为

Agent禁止：

## 架构破坏

例如：

引入大型状态库。

---

## 数据污染

例如：

为了填充数量生成大量普通地点。

---

## 过度开发

例如：

第一阶段直接开发：

* 登录
* 支付
* 社区
* CMS

---

# 18. 产品方向约束

始终牢记：

RoadLens Planner不是旅游攻略。

核心：

```
地点

+

最佳拍摄时间

+

设备参数

+

视频创作价值
```

---

# 19. 长期演进目标

最终系统：

```
全国自驾地图

+

摄影知识库

+

视频素材库

+

AI路线规划


=

个人自驾影像操作系统
```

所有代码和数据设计必须支持这个方向。
