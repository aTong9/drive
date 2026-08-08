# RoadLens Planner 数据结构规范（schema.md）

## 1. 数据设计原则

所有路线、地点、设备数据均使用 JSON。

目标：

* 人可读
* AI可生成
* Git可管理
* 未来可迁移数据库

---

# 2. Route路线数据

文件：

```
data/routes/*.json
```

结构：

```json
{
"id":"gd-hz-001",

"name":"惠州大亚湾海岸线",

"province":"广东",

"city":"惠州",

"type":"coast",

"mode":[
"day",
"sunset"
],


"distance":80,

"duration":"3h",


"road":

{
"type":"coastal",
"difficulty":"easy"
},


"best":

{

"season":[
"spring",
"autumn"
],

"time":[
"sunrise",
"sunset"
],

"weather":[
"sunny"
]

},


"points":[

"location-id"

],


"cameraPreset":[

"a7c2-sunset"

],


"status":

"todo"

}
```

---

# 3. 拍摄地点 Location

文件：

```
data/locations
```

统一结构：

```json
{

"id":"gd-hz-001-point01",

"name":"黄金海岸",

"type":"coast",


"coordinate":

{

"lat":22.7,

"lng":114.5

},


"shoot":

{

"direction":"west",

"bestTime":"sunset",

"recommendedLens":

[
"24mm",
"35mm"
]

},


"parking":

{

"available":true,

"fee":"free"

},


"tags":

[
"sea",
"driving"
]


}
```

---

# 4. 城市夜景数据

文件：

```
night-city.json
```

结构：

```json
{

"id":"sz-night-001",

"name":"深圳CBD夜景路线",

"city":"深圳",


"type":"city-night",


"coordinate":

{
"lat":22,
"lng":113
},


"bestTime":

{

"weekday":

"19:30-22:30",


"weekend":

"not-recommend"

},


"reason":

[
"office-light",
"traffic"
],


"score":

{

"building":5,

"light":5,

"traffic":4,

"parking":3

},


"shoot":

{

"camera":
"gopro12",

"style":
"driving"

}

}
```

---

# 5. 瀑布溪流 ASMR 数据

文件：

```
waterfalls.json
```

结构：

```json
{

"id":"gd-qy-water-001",


"name":"清远瀑布",


"type":"waterfall",


"coordinate":

{

"lat":0,

"lng":0

},


"sound":

[

"water",

"bird",

"forest"

],


"best":

{

"weather":

"after-rain",

"season":

"summer"

},


"record":

{

"camera":

"gopro12",

"audio":

"environment"

},


"difficulty":

"medium"

}
```

---

# 6. 相机参数数据

文件：

```
cameras/*.json
```

结构：

```json
{

"id":"a7c2-sunset",


"camera":

"Sony A7C2",


"scene":

"sunset-coast",


"settings":

{

"mode":"manual",

"shutter":"1/50",

"aperture":"F4",

"iso":"100-800",

"wb":"5600K",

"profile":"S-Cinetone"

},


"notes":

"海边日落驾驶视频"

}
```

---

# 7. GoPro参数

```json
{

"id":"gopro12-night-driving",

"camera":

"GoPro Hero12",


"settings":

{

"resolution":"5.3K",

"fps":60,

"hdr":true,

"stabilization":"high"

}

}
```

---

# 8. 拍摄计划数据

文件：

```
shoot-plan.json
```

结构：

```json
{

"id":"plan-001",

"date":"2026-08-20",

"location":

"gd-hz-001",


"status":

"todo",


"equipment":

[
"a7c2",
"gopro12"
],


"youtube":

{

"title":"",

"url":""

}

}
```

---

# 9. 枚举定义

## Location Type

```ts
type LocationType =

"coast"

| "mountain"

| "city-night"

| "waterfall"

| "forest"

| "river"

| "lake"

```

---

## Shoot Mode

```ts
type ShootMode =

"day"

| "night"

| "sunrise"

| "sunset"

| "asmr"

```

---

## Status

```ts
type Status =

"todo"

| "planned"

| "shooted"

| "published"

```

---

# 10. 全国数据生成规则

AI生成路线时必须包含：

必填：

```
id

name

coordinate

type

bestTime

bestWeather

cameraPreset

shootAdvice
```

---

禁止：

* 虚构不存在地点
* 没有坐标
* 没有拍摄价值的普通地点

---

# 11. 数据扩展方向

未来增加：

## Weather

天气数据

## GPX

真实驾驶轨迹

## Video

视频资产

## AI Recommendation

智能路线推荐

最终形成：

全国自驾摄影知识图谱。

```
```
