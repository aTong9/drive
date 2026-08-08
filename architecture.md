# RoadLens Planner 前端架构规范（architecture.md）

## 1. 项目架构目标

RoadLens Planner 是一个地图驱动型自驾摄影数据库系统。

核心原则：

1. 数据驱动 UI
2. 地图作为核心入口
3. 组件高度复用
4. 功能模块独立
5. 支持未来扩展 AI 路线规划

---

# 2. 技术栈规范

## Core

```
React
TypeScript
Vite
```

---

## UI

```
TailwindCSS

shadcn/ui
```

---

## State

使用：

```
Zustand
```

禁止：

```
Redux
MobX
```

除非项目规模扩大。

---

## Map

第一阶段：

```
高德地图 JS API
```

未来：

```
Mapbox GL
```

---

## Data

当前：

```
JSON
```

未来：

```
Database API
```

---

# 3. 目录规范

```
src

├── app
│
│   ├── router.tsx
│   ├── providers.tsx
│   └── store.ts
│


├── pages

│
│   ├── MapPage
│   │   ├── index.tsx
│   │   └── styles.css
│
│   ├── RouteDetail
│
│   ├── CameraPreset
│
│   ├── ShootPlan
│
│   └── Dashboard
│


├── components


│
│   ├── map
│   │
│   │   ├── MapView.tsx
│   │   ├── MarkerLayer.tsx
│   │   ├── RoutePolyline.tsx
│   │   └── MapControl.tsx
│
│
│   ├── route
│   │
│   │   ├── RouteCard.tsx
│   │   ├── RouteFilter.tsx
│   │   └── RouteTimeline.tsx
│
│
│   ├── location
│   │
│   │   ├── LocationCard.tsx
│   │   └── LocationBadge.tsx
│
│
│   ├── camera
│   │
│   │   ├── CameraCard.tsx
│   │   └── PresetPanel.tsx
│
│
│   └── common
│
│       ├── EmptyState.tsx
│       ├── Loading.tsx
│       └── Modal.tsx
│


├── data

├── hooks

├── services

├── types

├── utils

└── assets

```

---

# 4. 页面职责

# MapPage

核心页面。

负责：

* 地图展示
* 图层切换
* 搜索
* 筛选

禁止：

* 直接读取 JSON
* 包含业务逻辑

结构：

```
MapPage

|
├── MapView

├── LayerControl

├── FilterPanel

└── DetailDrawer
```

---

# RouteDetail

展示路线详情。

内容：

```
路线信息

地图轨迹

拍摄建议

设备参数

关联视频
```

---

# CameraPreset

展示设备参数。

例如：

Sony A7C2：

```
海边日落

城市夜景

瀑布

驾驶视频
```

---

# ShootPlan

个人拍摄任务管理。

类似：

Notion Calendar。

---

# Dashboard

统计：

```
路线数量

已拍数量

待拍数量

城市覆盖

视频数量
```

---

# 5. 组件设计规范

## 原则

一个组件只负责一种事情。

错误：

```tsx
MapPage.tsx

里面包含：

地图

路线计算

JSON读取

弹窗
```

正确：

```tsx
MapPage

↓

MapView

↓

MarkerLayer

↓

RouteDrawer
```

---

# 6. TypeScript规范

所有数据必须有类型。

例如：

```ts
interface Route {

id:string;

name:string;

type:RouteType;

distance:number;

}
```

禁止：

```ts
const data:any
```

---

# 7. 数据读取规范

禁止：

组件直接：

```ts
import routes from "../data/routes.json"
```

统一：

```
services
```

处理。

例如：

```
services/routeService.ts
```

提供：

```ts
getRoutes()

getRouteById()

filterRoutes()
```

---

# 8. Zustand Store设计

位置：

```
app/store.ts
```

管理：

```ts
interface AppState {

mode:

"day"
|
"night"
|
"asmr";


selectedLocation:string;


filters:Filter;


}
```

---

# 9. Hooks规范

公共逻辑必须抽离。

例如：

地图：

```
useMap()
```

路线：

```
useRoutes()
```

拍摄计划：

```
useShootPlan()
```

---

# 10. API预留

未来：

```
services/api
```

结构：

```
routeApi.ts

locationApi.ts

weatherApi.ts

aiPlannerApi.ts

```

---

# 11. Agent开发规则

AI Agent 必须遵守：

## 禁止

* 修改数据结构
* 创建重复组件
* 在页面写大量业务逻辑

## 必须

新增功能：

同时更新：

```
types

components

services

README
```

---

# 12. 代码质量要求

必须：

```
npm run lint

npm run build
```

通过。

---

# 13. 未来扩展

支持：

* 用户登录
* 云同步
* AI路线规划
* GPS轨迹
* 视频管理

架构必须提前保留扩展能力。

```
```
