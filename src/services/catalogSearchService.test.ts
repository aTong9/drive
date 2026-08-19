import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedRoute } from "../types/domain.js";
import { routeMatchesQuery } from "./catalogSearchService.js";

const item = {
  route: {
    name: "G323 南岭段",
    province: "广东",
    cities: ["清远"],
    shootAdvice: "山水路线",
    verification: {
      status: "source-checked",
      note: "已核验",
      sources: [
        {
          platform: "xiaohongshu",
          title: "跑多少次都不会腻的广东G323",
          author: "毛疯子",
          url: "https://www.xiaohongshu.com/explore/example",
          accessedAt: "2026-08-20",
          evidence: ["南水水库"],
        },
      ],
    },
  },
  waypoints: [],
  cameraPresets: [],
} as unknown as ResolvedRoute;

test("matches Xiaohongshu platform, post, author and evidence", () => {
  for (const query of [
    "小红书",
    "来源小红书",
    "广东G323",
    "毛疯子",
    "南水水库",
  ]) {
    assert.equal(routeMatchesQuery(item, query), true, query);
  }
});
