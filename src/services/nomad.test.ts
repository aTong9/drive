import assert from "node:assert/strict";
import test from "node:test";
import { filterNomadDestinations, nomadDestinations, nomadKeywords, nomadExchangeRates, nomadUsdEquivalent } from "../data/nomadDestinations.js";
import { readWorkspaceUrl } from "./workspaceUrlService.js";
import { searchWorkspaceViews } from "../app/viewPresentation.js";

test("nomad discovery combines region and bilingual search, handles empty results, and opens by URL", () => {
  assert.equal(filterNomadDestinations("  ", "全部").length, 48);
  assert.equal(filterNomadDestinations("  kUaLa lumpur ", "亚洲")[0]?.city, "吉隆坡");
  assert.equal(filterNomadDestinations("Bangsar", "欧洲").length, 0);
  assert.equal(filterNomadDestinations("不存在", "全部").length, 0);
  assert.equal(filterNomadDestinations("远程办公", "亚洲").length, 16);
  assert.equal(readWorkspaceUrl("https://example.test/?view=nomad").view, "nomad");
  assert.deepEqual(searchWorkspaceViews("数字游民").flatMap((g) => g.views), ["nomad"]);
  assert.equal(new Set(nomadDestinations.map((p) => p.region)).size, 6);
  for (const place of nomadDestinations) {
    assert.ok(place.areas.length >= 3);
    assert.ok(place.rent.every((n) => n > 0) && place.transit > 0 && place.internet > 0);
    assert.doesNotThrow(() => new Intl.NumberFormat("zh-CN", { style: "currency", currency: place.currency }));
  }
  assert.ok(nomadKeywords.flatMap((g) => g.words).length >= 50);
});

test("all destination currencies have a dated USD rate and conversion divides rather than multiplies", () => {
  assert.equal(nomadDestinations.length, 48);
  assert.equal(new Set(nomadDestinations.map((place) => place.id)).size, 48);
  for (const city of ["清迈", "岘港", "曼谷", "波尔图", "瓦伦西亚", "布达佩斯"]) {
    assert.equal(filterNomadDestinations(city, "全部").length, 1);
  }
  assert.equal(nomadExchangeRates.date, "2026-09-28");
  for (const place of nomadDestinations) {
    const rate = nomadExchangeRates.localPerUsd[place.currency];
    assert.ok(Number.isFinite(rate) && rate > 0);
    assert.equal(nomadUsdEquivalent(rate, place.currency), 1);
    for (const cost of [...place.rent, place.transit, place.internet]) {
      assert.ok(Math.abs(nomadUsdEquivalent(cost, place.currency) * rate - cost) < 0.000001);
    }
  }
  assert.equal(nomadUsdEquivalent(100, "EUR").toFixed(2), "113.85");
  assert.equal(nomadUsdEquivalent(8849013, "VND").toFixed(2), "341.18");
  assert.equal(nomadUsdEquivalent(0, "MYR"), 0);
  assert.equal(nomadUsdEquivalent(383, "USD"), 383);
  for (const amount of [-1, NaN, Infinity]) assert.throws(() => nomadUsdEquivalent(amount, "MYR"), RangeError);
});

test("new city batch retains searchable neighborhoods, local costs and USD coverage", () => {
  const expected = {"Hanoi": "河内", "Lima": "利马", "Quito": "基多", "Malaga": "马拉加", "Barcelona": "巴塞罗那", "Vienna": "维也纳", "Ljubljana": "卢布尔雅那", "Zagreb": "萨格勒布", "Kathmandu": "加德满都", "Colombo": "科伦坡", "Singapore": "新加坡", "Perth": "珀斯", "Fukuoka": "福冈", "Tokyo": "东京", "Ho-Chi-Minh-City": "胡志明市", "Prague": "布拉格", "Sofia": "索非亚", "Bucharest": "布加勒斯特", "Tbilisi": "第比利斯", "Cuenca": "昆卡", "Vancouver": "温哥华", "Brisbane": "布里斯班", "Wellington": "惠灵顿", "Tunis": "突尼斯市", "Penang": "槟城", "Osaka": "大阪", "Taipei": "台北", "Seoul": "首尔", "Athens": "雅典", "Istanbul": "伊斯坦布尔", "Tallinn": "塔林", "Warsaw": "华沙", "Montreal": "蒙特利尔", "Santiago": "圣地亚哥", "Auckland": "奥克兰", "Marrakech": "马拉喀什"};
  for (const [id, city] of Object.entries(expected)) {
    const results = filterNomadDestinations(city, "全部");
    assert.equal(results.length, 1, city);
    const place = results[0]!;
    assert.equal(place.id, id);
    assert.ok(filterNomadDestinations(place.areas[0], place.region).some((item) => item.id === id));
    assert.ok(place.rent[0] > 0 && place.rent[1] >= place.rent[0]);
    assert.ok(nomadUsdEquivalent(place.rent[0], place.currency) > 0);
  }
  assert.ok(filterNomadDestinations("加拿大", "北美洲").some((place) => place.id === "Montreal"));
  assert.ok(filterNomadDestinations("摩洛哥", "非洲").some((place) => place.id === "Marrakech"));
});
