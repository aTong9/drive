# RoadLens Planner 开发路线图（roadmap.md）

## 1. 项目定位

项目名称：

**RoadLens Planner**

定位：

> 一个面向个人自驾摄影创作者的地图化路线规划与拍摄资料管理系统。

核心目标：

* 管理全国自驾路线
* 根据时间（日间 / 夜间）规划拍摄
* 管理自然景观与城市夜景拍摄点
* 管理瀑布、溪流等 ASMR 环境声音地点
* 管理相机拍摄参数预设
* 管理未来 YouTube 视频选题

---

# 2. 核心使用场景

## 场景 A：规划一次自驾拍摄

用户：

> 明天从惠州出发，3小时，想拍海边日落

系统：

返回：

* 推荐路线
* 行驶距离
* 最佳拍摄时间
* 拍摄点
* 相机参数
* 视频方向

---

## 场景 B：晚上拍城市驾驶视频

用户选择：

夜景模式

系统展示：

* 城市 CBD
* 高楼灯光
* 工作日最佳时间
* 车流情况
* 停车位置

---

## 场景 C：寻找 ASMR 素材

用户选择：

自然声音模式

系统展示：

* 瀑布
* 溪流
* 森林
* 海浪
* 雨声

并提供：

* 最佳天气
* 最佳季节
* 收音建议

---

# 3. 技术架构

## Frontend

技术：

* React
* TypeScript
* Vite
* TailwindCSS
* shadcn/ui
* Zustand

## Map

第一阶段：

高德地图 JS API

未来：

Mapbox GL

支持：

* 3D地图
* 地形
* 动态路线

## 数据存储

第一阶段：

JSON 文件驱动。

原因：

* 单用户
* 易维护
* Git版本管理
* 方便AI Agent修改

未来：

升级：

* SQLite
* Supabase
* PostgreSQL

---

# 4. 项目目录结构

```
roadlens-planner

src

├── app
│   ├── router.tsx
│   └── store.ts
│

├── pages

│   ├── MapPage
│   ├── RouteDetail
│   ├── CameraPreset
│   ├── ShootPlan
│   └── Dashboard


├── components

│   ├── Map
│   │   ├── MapView.tsx
│   │   ├── Marker.tsx
│   │   └── LayerControl.tsx
│
│   ├── RouteCard
│   ├── CameraCard
│   ├── WeatherBadge
│   └── Timeline


├── data

│   ├── routes
│   │   ├── guangdong.json
│   │   └── national.json
│
│   ├── locations
│   │   ├── waterfalls.json
│   │   ├── night-city.json
│   │   └── coastline.json
│
│   └── cameras
│       ├── sony-a7c2.json
│       └── gopro12.json


└── utils

```

---

# 5. 核心功能 Roadmap

# Phase 0：项目初始化

目标：

创建基础工程。

任务：

* 初始化 React + TypeScript + Vite
* 配置 TailwindCSS
* 配置 ESLint
* 配置 Prettier
* 配置 Git

完成标准：

```
npm install

npm run dev

项目正常运行
```

---

# Phase 1：地图基础系统

目标：

实现全国地图浏览。

功能：

## 地图展示

支持：

* 中国地图
* 缩放
* 拖动

## Marker系统

支持：

不同类型图标：

```
🌊 海岸
🌃 夜景
💧 瀑布
🌲 森林
🚗 路线
```

## 图层控制

支持：

开启/关闭：

* 白天路线
* 夜景路线
* ASMR地点
* 已完成路线
* 未拍摄路线

完成标准：

用户打开页面即可通过地图查看所有地点。

---

# Phase 2：路线数据库系统

目标：

建立路线资产库。

数据文件：

```
data/routes/*.json
```

路线字段：

```json
{
"id":"",
"name":"",
"type":"",
"province":"",
"distance":"",
"duration":"",
"bestSeason":[],
"bestTime":"",
"mode":[],
"points":[],
"status":""
}
```

路线类型：

```
coast
mountain
city
forest
waterfall
```

页面：

路线详情。

展示：

* 路线地图
* 路程
* 时间
* 推荐设备
* 推荐参数

---

# Phase 3：白天 / 夜晚模式

## 白天模式

适合：

* 海岸
* 山路
* 森林
* 日出
* 日落

字段：

```
最佳时间
最佳天气
推荐镜头
推荐焦段
```

---

## 夜晚模式

重点：

城市摄影。

数据：

night-city.json

字段：

```json
{
"name":"",
"city":"",
"bestTime":{
"weekday":"",
"weekend":""
},

"score":{
"light":5,
"building":5,
"traffic":5
}
}
```

重点规则：

工作日优先。

原因：

* 写字楼亮灯
* 城市活跃
* 车流更多

---

# Phase 4：ASMR 自然声音地图

目标：

建立环境声音素材库。

类型：

```
waterfall
stream
forest
rain
wave
```

数据：

waterfalls.json

字段：

```json
{
"name":"",
"type":"",
"sound":[
"water",
"bird"
],

"bestWeather":"",
"bestSeason":"",
"recordingTips":""
}
```

展示：

* 地图位置
* 环境照片
* 声音类型
* 推荐设备

---

# Phase 5：摄影参数库

目标：

管理设备拍摄方案。

设备：

当前：

* Sony A7C2
* GoPro Hero 12

数据：

camera preset。

字段：

```json
{
"camera":"",
"scene":"",
"settings":{
"iso":"",
"shutter":"",
"aperture":"",
"wb":"",
"profile":""
}
}
```

场景：

```
海边日落

城市夜景

高速驾驶

瀑布

森林

雨天
```

---

# Phase 6：拍摄计划管理

目标：

管理未来视频。

功能：

新增计划：

```
地点
日期
设备
主题
状态
```

状态：

```
todo

shooting

completed

published
```

关联：

YouTube视频地址。

---

# Phase 7：数据可视化 Dashboard

展示：

个人拍摄资产。

指标：

```
路线数量

已完成路线

待拍路线

城市数量

ASMR地点数量

视频数量
```

---

# 6. 数据录入优先级

第一阶段：

广东省。

目标：

```
路线：
50条


城市夜景：
20条


瀑布溪流：
30条


摄影参数：
20套
```

后续：

扩展全国。

---

# 7. AI Agent 开发规则

开发时遵循：

## 原则1

数据优先。

不要硬编码路线。

所有内容必须来自：

```
src/data
```

---

## 原则2

组件化。

禁止：

大型单文件组件。

要求：

```
Map

Marker

Card

Filter

Panel
```

独立。

---

## 原则3

移动端优先。

因为：

户外驾驶时主要使用手机。

---

## 原则4

所有新增功能必须同步更新：

```
README.md

数据Schema

类型定义
```

---

# 8. 后续扩展方向

## GPS轨迹

支持：

* GPX导入
* 行驶轨迹展示

## 视频关联

路线绑定：

* YouTube视频
* 缩略图
* 拍摄日志

## AI路线规划

输入：

```
当前位置

时间

天气

设备

拍摄目标
```

输出：

```
推荐路线

拍摄时间

参数
```

---

# 9. MVP完成标准

第一版完成：

用户可以：

✅ 打开地图

✅ 查看全国拍摄点

✅ 按白天/夜晚筛选

✅ 查看路线详情

✅ 查看瀑布溪流ASMR地点

✅ 查看A7C2/Gopro参数

✅ 创建拍摄计划

达到以上，即完成第一版。

```
```
