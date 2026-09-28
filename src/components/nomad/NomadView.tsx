import { useState } from "react";
import { Globe2, ArrowUpRight } from "lucide-react";
import { filterNomadDestinations, nomadDestinations, nomadKeywords, nomadExchangeRates, nomadUsdEquivalent } from "../../data/nomadDestinations.js";
import "./nomad.css";

export function NomadView() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("全部");
  const [housing, setHousing] = useState("0");
  const [keywordQuery, setKeywordQuery] = useState("");
  const places = filterNomadDestinations(query, region);
  const keywordGroups = nomadKeywords.map((group) => ({ ...group, words: group.words.filter((word) => `${group.title} ${word}`.toLocaleLowerCase().includes(keywordQuery.trim().toLocaleLowerCase())) })).filter((group) => group.words.length);
  const reset = () => { setQuery(""); setRegion("全部"); setHousing("0"); };
  return <main className="nomad-page">
    <header className="nomad-hero">
      <div><p className="nomad-eyebrow"><Globe2 size={18} aria-hidden="true" /> 住进世界的日常</p><h1>全球旅居</h1><p>从一座城市、一个社区开始，研究生活成本与数字游民的工作方式。</p></div>
      <a href="#nomad-keywords">探索关联关键词 ↓</a>
    </header>
    <section aria-labelledby="nomad-destinations-title">
      <div className="nomad-section-heading"><h2 id="nomad-destinations-title">居住区域与成本</h2><span>6 大洲 · {nomadDestinations.length} 个城市样本</span></div>
      <div className="nomad-filters">
        <label>搜索目的地<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="城市、社区或远程办公…" /></label>
        <label>居住地区<select value={region} onChange={(e) => setRegion(e.target.value)}>{["全部", ...new Set(nomadDestinations.map((p) => p.region))].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>租金参考口径<select value={housing} onChange={(e) => setHousing(e.target.value)}><option value="0">非市中心一居室</option><option value="1">市中心一居室</option></select></label>
        <button onClick={reset}>重置筛选</button>
      </div>
      <p className="nomad-method">2026-09-28 核查 · 当地币种 / 月 · Numbeo 用户贡献的城市均价，四舍五入。社区仅为考察候选，以下费用并非这些社区的房源报价；短租、带家具及旺季价格可能不同。</p>
      <p className="nomad-method">美元等值按 {nomadExchangeRates.date} 汇率快照估算（金额 ÷ 每美元对应当地币种），非实时兑换报价，不含手续费。<a href={nomadExchangeRates.source} target="_blank" rel="noreferrer">查看汇率数据</a> · <a href={nomadExchangeRates.provider} target="_blank" rel="noreferrer">ExchangeRate-API</a></p>
      <p role="status">找到 {places.length} 个目的地</p>
      <div className="nomad-grid">{places.map((place) => {
        const money = (value: number) => `${place.currency} ${value.toLocaleString("zh-CN")}`;
        const usd = (value: number) => `≈ USD ${nomadUsdEquivalent(value, place.currency).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return <article className="nomad-card" key={place.id}>
          <span className="nomad-eyebrow">{place.region} / {place.country}</span><h3>{place.city}</h3>
          <p className="nomad-price">{money(place.rent[housing === "1" ? 1 : 0])}<small> / 月租金参考</small></p>
          <p className="nomad-usd">{usd(place.rent[housing === "1" ? 1 : 0])} / 月</p>
          <p className="nomad-method">1 USD = {nomadExchangeRates.localPerUsd[place.currency].toLocaleString("zh-CN", { maximumFractionDigits: 6 })} {place.currency} · {nomadExchangeRates.date}</p>
          <h4>候选居住区域</h4><ul className="nomad-areas">{place.areas.map((area) => <li key={area}>{area}</li>)}</ul>
          <dl><div><dt>公共交通月票</dt><dd>{money(place.transit)}<small className="nomad-usd">{usd(place.transit)}</small></dd></div><div><dt>宽带月费</dt><dd>{money(place.internet)}<small className="nomad-usd">{usd(place.internet)}</small></dd></div></dl>
          <p className="nomad-method">尚未包含餐饮、水电、保险、联合办公、机票、签证及押金；这不是完整月度生活预算。</p>
          <p>{place.note}</p><div className="nomad-tags">{place.keywords.map((word) => <button key={word} onClick={() => setQuery(word)}>{word}</button>)}</div>
          <a href={`https://www.numbeo.com/cost-of-living/in/${place.id}`} target="_blank" rel="noreferrer">{place.city}费用来源 <ArrowUpRight size={14} aria-hidden="true" /></a>
        </article>;
      })}</div>
      {!places.length && <div className="nomad-empty"><h3>暂无匹配的目的地</h3><p>试试城市名、社区英文名，或切换到全部地区。</p><button onClick={reset}>显示全部目的地</button></div>}
    </section>
    <section id="nomad-keywords" aria-labelledby="nomad-keywords-title">
      <div className="nomad-section-heading"><div><h2 id="nomad-keywords-title">全球旅居 × 数字游民 · 关键词库</h2><p>从地点筛选到长期生活，用这些中英文关键词继续研究。</p></div><label>搜索关键词<input type="search" value={keywordQuery} onChange={(e) => setKeywordQuery(e.target.value)} placeholder="签证、租房、Coworking…" /></label></div>
      <div className="nomad-keyword-grid">{keywordGroups.map((group) => <article className="nomad-card" key={group.title}><h3>{group.title}</h3><ul className="nomad-tags">{group.words.map((word) => <li key={word}>{word}</li>)}</ul></article>)}</div>
      <p role="status">{keywordGroups.length ? `显示 ${keywordGroups.reduce((total, group) => total + group.words.length, 0)} 个关键词` : "没有匹配关键词，请换个词或清空搜索。"}</p>
    </section>
    <aside className="nomad-note"><h2>出发前，把这些信息补齐</h2><p>按护照、目的地和工作方式核查入境与工作权限；向官方核实停留期限及税务要求。向房东确认合同、押金、水电和实测网络，再补齐餐饮、医疗保险与应急储备预算。</p></aside>
  </main>;
}
