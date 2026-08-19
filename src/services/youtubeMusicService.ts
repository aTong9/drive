import data from "../../data/youtube-music-library.json" with { type: "json" };
import streambeatsLofiCatalog from "../../data/music-catalogs/streambeats-lofi-100.json" with { type: "json" };
import scottBuckleyCatalog from "../../data/music-catalogs/scott-buckley-100.json" with { type: "json" };
import incompetechCatalog from "../../data/music-catalogs/incompetech-calm-100.json" with { type: "json" };
import dovaLoopableCatalog from "../../data/music-catalogs/dova-loopable-warm-100.json" with { type: "json" };
import amachaGentleCatalog from "../../data/music-catalogs/amacha-gentle-100.json" with { type: "json" };
import bgmerCalmCatalog from "../../data/music-catalogs/bgmer-calm-100.json" with { type: "json" };
import purrpleCatCalmCatalog from "../../data/music-catalogs/purrple-cat-calm-100.json" with { type: "json" };
import pixabayCalmLofiCatalog from "../../data/music-catalogs/pixabay-calm-lofi-100.json" with { type: "json" };
import mixkitCalmCatalog from "../../data/music-catalogs/mixkit-calm-100.json" with { type: "json" };
import audionautixCalmCatalog from "../../data/music-catalogs/audionautix-calm-31.json" with { type: "json" };
import maouDamashiiCalmCatalog from "../../data/music-catalogs/maou-damashii-calm-100.json" with { type: "json" };
import musmusCalmCatalog from "../../data/music-catalogs/musmus-calm-100.json" with { type: "json" };
import otologicCalmCatalog from "../../data/music-catalogs/otologic-calm-100.json" with { type: "json" };
import hmixGalleryHealingCatalog from "../../data/music-catalogs/hmix-gallery-healing-100.json" with { type: "json" };
import perituneHealingCatalog from "../../data/music-catalogs/peritune-healing-100.json" with { type: "json" };
import freebgmJpPianoAmbientCatalog from "../../data/music-catalogs/freebgm-jp-piano-ambient-100.json" with { type: "json" };
import otoNoteCalmCatalog from "../../data/music-catalogs/oto-note-calm-50.json" with { type: "json" };
import zukisuzukiCalmCatalog from "../../data/music-catalogs/zukisuzuki-calm-100.json" with { type: "json" };
import roaMusicCalmCatalog from "../../data/music-catalogs/roa-music-calm-100.json" with { type: "json" };
import chillpeachLicensedCatalog from "../../data/music-catalogs/chillpeach-licensed-15.json" with { type: "json" };
import khaimCalmLofiCatalog from "../../data/music-catalogs/khaim-calm-lofi-21.json" with { type: "json" };
import redBearsCalmPianoCatalog from "../../data/music-catalogs/red-bears-calm-piano-3.json" with { type: "json" };
import bensoundFreeCalmCatalog from "../../data/music-catalogs/bensound-free-calm-55.json" with { type: "json" };
import youtubeAudioLibraryCalmAmbientCatalog from "../../data/music-catalogs/youtube-audio-library-calm-ambient-100.json" with { type: "json" };
import uppbeatFreeCalmCatalog from "../../data/music-catalogs/uppbeat-free-calm-100.json" with { type: "json" };
import teknoaxeCalmCatalog from "../../data/music-catalogs/teknoaxe-calm-100.json" with { type: "json" };

export type MusicFamily = "piano" | "lofi" | "chillhop" | "jazz";
export type MusicScene = "countryside" | "rain" | "sunrise" | "city-night" | "road-driving" | "blue-hour" | "urban";
export type MusicRisk = "low" | "medium" | "high";

export interface MusicCategory {
  id: string;
  family: MusicFamily;
  name: string;
  description: string;
  scenes: MusicScene[];
  searchTerms: string[];
  mixingNotes: string;
}

export interface MusicPlatform {
  id: string;
  name: string;
  kind: "youtube-native" | "subscription" | "freemium" | "per-track" | "creator-library";
  importMode: "download-import" | "platform-only";
  url: string;
  catalogFit: string;
  supportedCategoryIds: string[];
  license: {
    youtubeUse: "allowed-with-track-terms" | "allowed-with-active-license" | "allowed-with-license";
    cost: "free" | "free-or-paid" | "subscription" | "per-track-or-subscription";
    attribution: "track-dependent" | "not-generally-required" | "credit-or-safelist";
    contentId: "low" | "clearlist-required" | "code-or-clearlist" | "track-dependent";
    monetization: "allowed" | "allowed-with-track-terms" | "not-covered";
    audioEditing: "basic-edits" | "derivatives-allowed" | "sync-only" | "track-dependent";
    risk: MusicRisk;
    notes: string;
  };
  workflow: string[];
  evidence: Array<{ title: string; url: string; supports: Array<"youtube-use" | "attribution" | "content-id" | "pricing" | "territory"> }>;
}

export function buildPlatformAttributionTemplate(platform: MusicPlatform) {
  const editing = {
    "basic-edits": "The music may be trimmed, faded and looped when synchronized as background music, subject to the track terms.",
    "derivatives-allowed": "The music may be trimmed, faded, looped and adapted within the scope of the applicable license.",
    "sync-only": "The music is synchronized to this audiovisual work without remixing, sampling or redistribution.",
    "track-dependent": "Editing, fades and loops are used only where the individual track terms permit them."
  }[platform.license.audioEditing];
  const attribution = {
    "not-generally-required": "Attribution is not generally required, but is included in appreciation of the creator.",
    "track-dependent": "Individual track terms may require a specific credit; the exact credit from each track page is included below when required.",
    "credit-or-safelist": "The required track credit, license code or channel-clearance information is included below."
  }[platform.license.attribution];
  const monetization = platform.license.monetization === "allowed"
    ? "The applicable license permits use in monetized YouTube audiovisual works."
    : "YouTube monetization is used only where the individual track terms and account conditions permit it.";

  return [
    "🎵 MUSIC / BGM",
    "“[Track title]” — [Artist]",
    "[Add one line per track]",
    "",
    `Music provided by ${platform.name}.`,
    `Official website: ${platform.name} (${platform.url})`,
    monetization,
    editing,
    attribution,
    "Track-specific credit / license code: [Paste the exact text supplied with the download, if required]"
  ].join("\n");
}

export interface YoutubeMusicLibrary {
  schemaVersion: "1.3.0";
  accessedAt: string;
  methodology: string;
  categories: MusicCategory[];
  platforms: MusicPlatform[];
  albums: MusicAlbum[];
  tracks: MusicTrack[];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  platformId: string;
  categoryIds: string[];
  scenes: MusicScene[];
  durationSeconds: number | null;
  description: string;
  listenUrl: string;
  downloadUrl: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist: string;
  platformId: string;
  kind: "official-album" | "curated-collection";
  categoryIds: string[];
  scenes: MusicScene[];
  description: string;
  trackHighlights: string[];
  listenUrl: string;
  downloadUrl: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
}

interface CompactAlbumCatalog {
  platformId: string;
  artist: string;
  categoryIds: string[];
  scenes: MusicScene[];
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  albums: Array<{ id: string; url: string; tracks: Array<[string, number]> }>;
}

interface CompactTaggedCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, "piano" | "ambient" | "jazz"]>;
}

interface CompactMetadataCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, number, "piano" | "ambient" | "jazz", string, string, number]>;
}

interface CompactDovaCatalog {
  platformId: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, number, string, "piano" | "ambient" | "lofi" | "jazz", string, string]>;
}

interface CompactAmachaCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, string, number, string, string, "piano" | "ambient" | "jazz"]>;
}

interface CompactBgmerCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, string, number, "piano" | "ambient" | "lofi" | "jazz" | "acoustic", string, string]>;
}

interface CompactPurrpleCatCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, string, number, number, string]>;
}

interface CompactPixabayCatalog {
  platformId: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, string, number, string, string]>;
}

interface CompactMixkitCatalog {
  platformId: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, number, string, number, string, string]>;
}

interface CompactMaouDamashiiCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, "piano" | "ambient" | "jazz" | "acoustic", "core" | "adjacent", string, string]>;
}

interface CompactMusMusCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, string, number, "piano" | "ambient" | "lofi" | "jazz" | "acoustic", string, string, string, string, string, ("core" | "adjacent")?]>;
}

interface CompactOtoLogicCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, string, string, "piano" | "ambient" | "jazz", "core" | "adjacent", string, string, string, string, string]>;
}

interface CompactHmixGalleryCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, number, "piano" | "ambient" | "acoustic", "core" | "adjacent"]>;
}

interface CompactPerituneCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, number, "piano" | "ambient" | "acoustic", boolean, string]>;
}

interface CompactFreebgmJpCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  collectionUrl: string;
  items: Array<[string, number]>;
}

interface CompactOtoNoteCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[number, string, "piano" | "ambient" | "lofi" | "jazz" | "acoustic", "core" | "adjacent", string, string, string]>;
}

interface CompactZukisuzukiCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, string]>;
}

interface CompactRoaMusicCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, number, "piano" | "ambient" | "lofi" | "acoustic", "core" | "adjacent", string, string]>;
}

interface CompactChillpeachCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, number, string]>;
}

interface CompactKhaimCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  downloadUrl: string;
  items: Array<[string, string, number, "lofi" | "jazz" | "ambient" | "acoustic", string]>;
}

interface CompactRedBearsCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  pageUrl: string;
  items: Array<[string, number, string]>;
}

interface CompactAudionautixCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[string, string, number | null, string, string, string]>;
}

interface CompactBensoundCatalog {
  platformId: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<[number, string, string, number, "piano" | "ambient" | "lofi" | "jazz" | "acoustic", "core" | "adjacent", string, string, string]>;
}

interface YoutubeAudioLibraryRow {
  title: string;
  genre: string;
  mood: string;
  artist: string;
  artistUrl: string;
  duration: string;
  license: string;
  added: string;
}

interface UppbeatFreeCalmRow {
  trackId: string;
  title: string;
  artist: string;
  artistSlug: string;
  trackSlug: string;
  duration: number;
  tempo: number;
  energy: "Calm" | "Very Calm";
  kind: "piano" | "ambient" | "lofi" | "jazz" | "acoustic";
  genres: string[];
  moods: string[];
  featuredTags: Array<{ name: string; slug: string }>;
  previewUrl: string;
}

interface CompactTeknoaxeCatalog {
  platformId: string;
  artist: string;
  description: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
  items: Array<{
    id: string;
    genre: "Piano" | "Soft";
    title: string;
    videoId: string;
    file: string;
    kind: "piano" | "soft";
    tier: "core" | "adjacent";
  }>;
}

function catalogTrackId(platformId: string, albumId: string, title: string) {
  const slug = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${platformId}-${albumId}-${slug}`;
}

function expandAlbumCatalog(catalog: CompactAlbumCatalog): MusicTrack[] {
  return catalog.albums.flatMap((album) => album.tracks.map(([title, durationSeconds]) => ({
    id: catalogTrackId(catalog.platformId, album.id, title), title, artist: catalog.artist, platformId: catalog.platformId,
    categoryIds: catalog.categoryIds, scenes: catalog.scenes, durationSeconds,
    description: `${catalog.description}（${album.id[0]!.toUpperCase()}${album.id.slice(1)}）`,
    listenUrl: album.url, downloadUrl: album.url, downloadLabel: catalog.downloadLabel,
    credit: catalog.credit, licenseNote: catalog.licenseNote
  })));
}

function expandTaggedCatalog(catalog: CompactTaggedCatalog): MusicTrack[] {
  const categoryMap = {
    piano: ["healing-piano", "calm-piano", "gentle-piano"],
    ambient: ["ambient-healing"],
    jazz: ["relaxed-jazz-nocturne", "gentle-piano-jazz"]
  } as const;
  const sceneMap = {
    piano: ["countryside", "rain", "sunrise", "blue-hour"],
    ambient: ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
    jazz: ["city-night", "blue-hour", "urban"]
  } as const;
  return catalog.items.map(([title, url, kind]) => ({
    id: catalogTrackId(catalog.platformId, kind, title), title, artist: catalog.artist, platformId: catalog.platformId,
    categoryIds: [...categoryMap[kind]], scenes: [...sceneMap[kind]], durationSeconds: null,
    description: `${catalog.description}（官方标签：${kind === "piano" ? "Piano" : kind === "ambient" ? "Ambient" : "Jazz"}）`,
    listenUrl: url, downloadUrl: url, downloadLabel: catalog.downloadLabel,
    credit: catalog.credit.replace("曲名", title), licenseNote: catalog.licenseNote
  }));
}

function expandMetadataCatalog(catalog: CompactMetadataCatalog): MusicTrack[] {
  const categoryMap = {
    piano: ["healing-piano", "calm-piano", "gentle-piano"],
    ambient: ["ambient-healing"],
    jazz: ["relaxed-jazz-nocturne", "gentle-piano-jazz"]
  } as const;
  const sceneMap = {
    piano: ["countryside", "rain", "sunrise", "blue-hour"],
    ambient: ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
    jazz: ["city-night", "blue-hour", "urban"]
  } as const;
  return catalog.items.map(([title, isrc, durationSeconds, kind, feel, instruments, bpm]) => {
    const pageUrl = `https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=${encodeURIComponent(isrc)}`;
    return {
      id: catalogTrackId(catalog.platformId, kind, `${title}-${isrc}`), title, artist: catalog.artist,
      platformId: catalog.platformId, categoryIds: [...categoryMap[kind]], scenes: [...sceneMap[kind]], durationSeconds,
      description: `${catalog.description}｜Feel：${feel}｜乐器：${instruments}｜BPM：${bpm || "自由速度"}｜ISRC：${isrc}`,
      listenUrl: pageUrl, downloadUrl: pageUrl, downloadLabel: catalog.downloadLabel,
      credit: catalog.credit.replace("曲名", title), licenseNote: catalog.licenseNote
    };
  });
}

function expandDovaCatalog(catalog: CompactDovaCatalog): MusicTrack[] {
  const categoryMap = {
    piano: ["healing-piano", "calm-piano", "gentle-piano", "signature-healing-loop"],
    ambient: ["ambient-healing", "healing-piano", "calm-piano", "gentle-piano", "signature-healing-loop"],
    lofi: ["soft-lofi", "warm-lofi", "japanese-lofi", "rainy-day-chillhop"],
    jazz: ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop"]
  } as const;
  const sceneMap = {
    piano: ["countryside", "rain", "sunrise", "blue-hour"],
    ambient: ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
    lofi: ["rain", "city-night", "road-driving", "blue-hour", "urban"],
    jazz: ["city-night", "blue-hour", "urban"]
  } as const;
  return catalog.items.map(([title, detailId, artist, kind, tags, summary]) => {
    const pageUrl = `https://dova-s.jp/bgm/detail/${detailId}`;
    return {
      id: `${catalog.platformId}-loopable-${detailId}`, title, artist, platformId: catalog.platformId,
      categoryIds: [...categoryMap[kind]], scenes: [...sceneMap[kind]], durationSeconds: null,
      description: `${catalog.description}｜官方标签：${tags}｜${summary}`,
      listenUrl: pageUrl, downloadUrl: pageUrl, downloadLabel: catalog.downloadLabel,
      credit: catalog.credit, licenseNote: catalog.licenseNote
    };
  });
}

function expandAmachaCatalog(catalog: CompactAmachaCatalog): MusicTrack[] {
  const categoryMap = {
    piano: ["healing-piano", "calm-piano", "gentle-piano"],
    ambient: ["ambient-healing", "healing-piano", "calm-piano"],
    jazz: ["relaxed-jazz-nocturne", "gentle-piano-jazz"]
  } as const;
  const sceneMap = {
    piano: ["countryside", "rain", "sunrise", "blue-hour"],
    ambient: ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
    jazz: ["city-night", "blue-hour", "urban"]
  } as const;
  return catalog.items.map(([title, pagePath, mp3Path, durationSeconds, image, genre, kind]) => ({
    id: catalogTrackId(catalog.platformId, kind, pagePath), title, artist: catalog.artist, platformId: catalog.platformId,
    categoryIds: [...categoryMap[kind]], scenes: [...sceneMap[kind]], durationSeconds,
    description: `${catalog.description}｜官方画面分类：${image}｜官方曲风：${genre}`,
    listenUrl: `https://amachamusic.chagasi.com/${mp3Path}`,
    downloadUrl: `https://amachamusic.chagasi.com/${pagePath}`,
    downloadLabel: catalog.downloadLabel, credit: catalog.credit, licenseNote: catalog.licenseNote
  }));
}

function expandBgmerCatalog(catalog: CompactBgmerCatalog): MusicTrack[] {
  const categoryMap = {
    piano: ["healing-piano", "calm-piano", "gentle-piano"],
    ambient: ["ambient-healing", "healing-piano", "calm-piano"],
    lofi: ["soft-lofi", "warm-lofi", "japanese-lofi", "rainy-day-chillhop"],
    jazz: ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop"],
    acoustic: ["ambient-healing", "calm-piano", "gentle-piano"]
  } as const;
  const sceneMap = {
    piano: ["countryside", "rain", "sunrise", "blue-hour"],
    ambient: ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
    lofi: ["rain", "city-night", "road-driving", "blue-hour", "urban"],
    jazz: ["city-night", "blue-hour", "urban"],
    acoustic: ["countryside", "rain", "sunrise", "blue-hour"]
  } as const;
  return catalog.items.map(([title, pageUrl, mp3Url, durationSeconds, kind, genres, moods]) => ({
    id: catalogTrackId(catalog.platformId, kind, pageUrl), title, artist: catalog.artist, platformId: catalog.platformId,
    categoryIds: [...categoryMap[kind]], scenes: [...sceneMap[kind]], durationSeconds,
    description: `${catalog.description}｜官方曲风：${genres}｜官方情绪：${moods}`,
    listenUrl: pageUrl, downloadUrl: mp3Url, downloadLabel: catalog.downloadLabel,
    credit: catalog.credit, licenseNote: catalog.licenseNote
  }));
}

function expandPurrpleCatCatalog(catalog: CompactPurrpleCatCatalog): MusicTrack[] {
  return catalog.items.map(([title, pagePath, mp3Path, durationSeconds, bpm, tags]) => ({
    id: catalogTrackId(catalog.platformId, "cc-lofi", pagePath), title, artist: catalog.artist, platformId: catalog.platformId,
    categoryIds: ["soft-lofi", "warm-lofi", "rainy-day-chillhop", "night-drive-chillhop"],
    scenes: ["rain", "city-night", "road-driving", "blue-hour", "urban"], durationSeconds,
    description: `${catalog.description}｜标签：${tags}｜BPM：${bpm}`,
    listenUrl: `https://www.free-stock-music.com/${pagePath}`,
    downloadUrl: `https://www.free-stock-music.com${mp3Path}`,
    downloadLabel: catalog.downloadLabel, credit: catalog.credit.replace("曲名", title), licenseNote: catalog.licenseNote
  }));
}

function expandPixabayCatalog(catalog: CompactPixabayCatalog): MusicTrack[] {
  return catalog.items.map(([title, pagePath, artist, durationSeconds, genre, tags]) => {
    const pageUrl = `https://pixabay.com${pagePath}`;
    return {
      id: catalogTrackId(catalog.platformId, "calm-lofi", pagePath), title, artist, platformId: catalog.platformId,
      categoryIds: genre === "Ambient"
        ? ["ambient-healing", "soft-lofi", "warm-lofi"]
        : ["soft-lofi", "warm-lofi", "rainy-day-chillhop", "night-drive-chillhop"],
      scenes: ["rain", "city-night", "road-driving", "blue-hour", "urban"], durationSeconds,
      description: `${catalog.description}｜官方类型：${genre}｜官方标签：${tags}`,
      listenUrl: pageUrl, downloadUrl: pageUrl, downloadLabel: catalog.downloadLabel,
      credit: catalog.credit.replace("曲名", title).replace("作者", artist), licenseNote: catalog.licenseNote
    };
  });
}

function expandMixkitCatalog(catalog: CompactMixkitCatalog): MusicTrack[] {
  return catalog.items.map(([title, itemId, artist, durationSeconds, previewUrl, tags]) => {
    const isJazz = /Jazz|Blues|Cocktail Lounge/i.test(tags);
    const isPiano = /Piano|Classical/i.test(tags);
    const isAmbient = /Ambient|Atmospheric|Meditative|Meditation|Relaxation/i.test(tags);
    const categoryIds = isJazz
      ? ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop"]
      : isPiano ? ["healing-piano", "calm-piano", "gentle-piano"]
      : isAmbient ? ["ambient-healing", "calm-piano"]
      : ["soft-lofi", "warm-lofi"];
    return {
      id: `${catalog.platformId}-calm-${itemId}`, title, artist, platformId: catalog.platformId,
      categoryIds, scenes: isJazz ? ["city-night", "blue-hour", "urban"] : ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds, description: `${catalog.description}｜官方标签：${tags}`,
      listenUrl: previewUrl, downloadUrl: `https://mixkit.co/free-stock-music/download/${itemId}/`,
      downloadLabel: catalog.downloadLabel, credit: catalog.credit.replace("曲名", title).replace("作者", artist), licenseNote: catalog.licenseNote
    };
  });
}

function expandAudionautixCatalog(catalog: CompactAudionautixCatalog): MusicTrack[] {
  return catalog.items.map(([title, mp3Path, durationSeconds, genre, tempo, mood]) => {
    const isJazz = /Jazz/i.test(genre);
    const isAmbient = /Meditative|Soundtrack|Electronic|Other/i.test(genre);
    return {
      id: catalogTrackId(catalog.platformId, "strict-calm", mp3Path), title, artist: catalog.artist, platformId: catalog.platformId,
      categoryIds: isJazz ? ["relaxed-jazz-nocturne", "gentle-piano-jazz"] : isAmbient ? ["ambient-healing", "calm-piano"] : ["healing-piano", "calm-piano", "gentle-piano"],
      scenes: isJazz ? ["city-night", "blue-hour", "urban"] : ["countryside", "rain", "sunrise", "blue-hour"],
      durationSeconds, description: `${catalog.description}｜Genre：${genre}｜Tempo：${tempo}｜Mood：${mood}`,
      listenUrl: `https://audionautix.com${mp3Path}`, downloadUrl: `https://audionautix.com${mp3Path}`,
      downloadLabel: catalog.downloadLabel, credit: catalog.credit, licenseNote: catalog.licenseNote
    };
  });
}

function expandMaouDamashiiCatalog(catalog: CompactMaouDamashiiCatalog): MusicTrack[] {
  return catalog.items.map(([title, slug, kind, tier, tags, summary]) => {
    const isJazz = kind === "jazz";
    const isPiano = kind === "piano";
    const pageUrl = `https://maou.audio/${slug}/`;
    return {
      id: `${catalog.platformId}-calm-${slug.replace(/^bgm_/, "")}`, title, artist: catalog.artist, platformId: catalog.platformId,
      categoryIds: isJazz ? ["relaxed-jazz-nocturne", "gentle-piano-jazz"] : isPiano ? ["healing-piano", "calm-piano", "gentle-piano"] : ["ambient-healing", "calm-piano", "gentle-piano"],
      scenes: isJazz ? ["city-night", "blue-hour", "urban"] : ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds: null, description: `${catalog.description}｜匹配层级：${tier}｜官方标签：${tags || "未标注"}｜官方说明：${summary}`,
      listenUrl: pageUrl, downloadUrl: pageUrl, downloadLabel: catalog.downloadLabel,
      credit: catalog.credit, licenseNote: catalog.licenseNote
    };
  });
}

function expandMusMusCatalog(catalog: CompactMusMusCatalog): MusicTrack[] {
  return catalog.items.map(([title, musicId, pagePath, durationSeconds, kind, genre, instruments, tags, summary, youtubeUrl, tier = "core"]) => {
    const isJazz = kind === "jazz";
    const isLofi = kind === "lofi";
    const isPiano = kind === "piano";
    const pageUrl = `https://musmus.main.jp/${pagePath}#${musicId}`;
    return {
      id: `${catalog.platformId}-calm-${musicId.toLowerCase()}`, title, artist: catalog.artist, platformId: catalog.platformId,
      categoryIds: isJazz ? ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop"] : isLofi ? ["soft-lofi", "warm-lofi", "japanese-lofi"] : isPiano ? ["healing-piano", "calm-piano", "gentle-piano"] : ["ambient-healing", "calm-piano", "gentle-piano"],
      scenes: isJazz || isLofi ? ["rain", "city-night", "road-driving", "blue-hour", "urban"] : ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds, description: `${catalog.description}｜匹配层级：${tier}｜官方流派：${genre}｜乐器：${instruments}｜标签：${tags}｜说明：${summary}`,
      listenUrl: youtubeUrl || pageUrl, downloadUrl: pageUrl, downloadLabel: catalog.downloadLabel,
      credit: catalog.credit, licenseNote: catalog.licenseNote
    };
  });
}

function expandOtoLogicCatalog(catalog: CompactOtoLogicCatalog): MusicTrack[] {
  return catalog.items.map(([title, pagePath, previewUrl, downloadUrl, kind, tier, keywords, instruments, genre, bpm, summary]) => {
    const isJazz = kind === "jazz";
    const isPiano = kind === "piano";
    const pageUrl = `https://otologic.jp/free/bgm/${pagePath}`;
    return {
      id: catalogTrackId(catalog.platformId, `calm-${kind}`, previewUrl), title, artist: catalog.artist, platformId: catalog.platformId,
      categoryIds: isJazz ? ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop"] : isPiano ? ["healing-piano", "calm-piano", "gentle-piano"] : ["ambient-healing", "calm-piano", "gentle-piano"],
      scenes: isJazz ? ["city-night", "road-driving", "blue-hour", "urban"] : ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds: null,
      description: `${catalog.description}｜匹配层级：${tier}｜关键词：${keywords}｜乐器：${instruments}｜流派：${genre || "未标注"}｜BPM：${bpm || "未标注"}｜说明：${summary}`,
      listenUrl: previewUrl, downloadUrl, downloadLabel: catalog.downloadLabel,
      credit: catalog.credit, licenseNote: `${catalog.licenseNote}｜官方分类页：${pageUrl}`
    };
  });
}

function expandHmixGalleryCatalog(catalog: CompactHmixGalleryCatalog): MusicTrack[] {
  const collectionUrl = "https://www.hmix.net/genre/healing.html";
  return catalog.items.map(([title, durationSeconds, kind, tier], index) => {
    const isPiano = kind === "piano";
    const isAcoustic = kind === "acoustic";
    return {
      id: `${catalog.platformId}-healing-${kind}-${String(index + 1).padStart(3, "0")}`,
      title,
      artist: catalog.artist,
      platformId: catalog.platformId,
      categoryIds: isPiano
        ? ["healing-piano", "calm-piano", "gentle-piano"]
        : isAcoustic
          ? ["ambient-healing", "calm-piano", "gentle-piano", "warm-sunset-chillhop"]
          : ["ambient-healing", "calm-piano", "gentle-piano"],
      scenes: isAcoustic
        ? ["countryside", "sunrise", "road-driving", "blue-hour"]
        : ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds,
      description: `${catalog.description}｜匹配层级：${tier}｜官方分类：Healing BGM`,
      listenUrl: collectionUrl,
      downloadUrl: collectionUrl,
      downloadLabel: catalog.downloadLabel,
      credit: catalog.credit.replace("[曲名]", title),
      licenseNote: catalog.licenseNote
    };
  });
}

function expandPerituneCatalog(catalog: CompactPerituneCatalog): MusicTrack[] {
  return catalog.items.map(([title, pageUrl, bpm, kind, nativeLoop, tags], index) => {
    const isPiano = kind === "piano";
    const isAcoustic = kind === "acoustic";
    return {
      id: `${catalog.platformId}-healing-${kind}-${String(index + 1).padStart(3, "0")}`,
      title,
      artist: catalog.artist,
      platformId: catalog.platformId,
      categoryIds: isPiano
        ? ["healing-piano", "calm-piano", "gentle-piano"]
        : isAcoustic
          ? ["ambient-healing", "calm-piano", "warm-sunset-chillhop"]
          : ["ambient-healing", "calm-piano", "gentle-piano"],
      scenes: isAcoustic
        ? ["countryside", "sunrise", "road-driving", "blue-hour"]
        : ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds: null,
      description: `${catalog.description}｜BPM：${bpm || "官方列表未显示"}｜标签：${tags}｜原生循环文件：${nativeLoop ? "有" : "曲目页未明确"}`,
      listenUrl: pageUrl,
      downloadUrl: pageUrl,
      downloadLabel: catalog.downloadLabel,
      credit: catalog.credit,
      licenseNote: catalog.licenseNote
    };
  });
}

function expandFreebgmJpCatalog(catalog: CompactFreebgmJpCatalog): MusicTrack[] {
  return catalog.items.map(([title, sourceOrder]) => ({
    id: `${catalog.platformId}-piano-ambient-${String(sourceOrder).padStart(3, "0")}`,
    title,
    artist: catalog.artist,
    platformId: catalog.platformId,
    categoryIds: ["healing-piano", "calm-piano", "gentle-piano", "ambient-healing"],
    scenes: ["countryside", "rain", "sunrise", "city-night", "road-driving", "blue-hour"],
    durationSeconds: null,
    description: `${catalog.description}｜官方专辑显示顺序：${sourceOrder}｜类型：Piano Ambient`,
    listenUrl: catalog.collectionUrl,
    downloadUrl: catalog.collectionUrl,
    downloadLabel: catalog.downloadLabel,
    credit: catalog.credit,
    licenseNote: catalog.licenseNote
  }));
}

function expandOtoNoteCatalog(catalog: CompactOtoNoteCatalog): MusicTrack[] {
  return catalog.items.map(([sourceNumber, title, kind, tier, fit, audioUrl, youtubeUrl]) => {
    const pageUrl = `https://oto-note.net/music-${sourceNumber}/`;
    const isPiano = kind === "piano";
    const isJazz = kind === "jazz";
    const isLofi = kind === "lofi";
    return {
      id: `${catalog.platformId}-calm-${kind}-${String(sourceNumber).padStart(3, "0")}`,
      title,
      artist: catalog.artist,
      platformId: catalog.platformId,
      categoryIds: isJazz
        ? ["gentle-piano-jazz", "relaxed-jazz-nocturne"]
        : isLofi
          ? ["warm-lofi", "soft-lofi"]
          : isPiano
            ? ["healing-piano", "calm-piano", "gentle-piano"]
            : ["ambient-healing", "calm-piano"],
      scenes: isJazz || isLofi
        ? ["city-night", "road-driving", "blue-hour", "urban"]
        : ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds: null,
      description: `${catalog.description}｜匹配层级：${tier === "core" ? "严格命中" : "相邻可用"}｜听感：${fit}`,
      listenUrl: youtubeUrl || audioUrl || pageUrl,
      downloadUrl: pageUrl,
      downloadLabel: catalog.downloadLabel,
      credit: catalog.credit,
      licenseNote: catalog.licenseNote
    };
  });
}

function expandRoaMusicCatalog(catalog: CompactRoaMusicCatalog): MusicTrack[] {
  return catalog.items.map(([videoId, title, durationSeconds, kind, tier, summary, downloadUrl], index) => {
    const isPiano = kind === "piano";
    const isAmbient = kind === "ambient";
    const isLofi = kind === "lofi";
    return {
      id: `${catalog.platformId}-calm-${String(index + 1).padStart(3, "0")}`,
      title,
      artist: catalog.artist,
      platformId: catalog.platformId,
      categoryIds: isPiano
        ? ["healing-piano", "calm-piano", "gentle-piano"]
        : isAmbient
          ? ["ambient-healing", "calm-piano"]
          : isLofi
            ? ["soft-lofi", "warm-lofi", "night-drive-chillhop", "rainy-day-chillhop"]
            : ["warm-lofi", "soft-lofi", "warm-sunset-chillhop"],
      scenes: isPiano || isAmbient
        ? ["countryside", "rain", "sunrise", "city-night", "blue-hour"]
        : ["rain", "city-night", "road-driving", "blue-hour", "urban"],
      durationSeconds,
      description: `${catalog.description}｜匹配层级：${tier === "core" ? "严格命中" : "相邻可用"}｜官方说明：${summary}`,
      listenUrl: `https://www.youtube.com/watch?v=${videoId}`,
      downloadUrl,
      downloadLabel: catalog.downloadLabel,
      credit: catalog.credit,
      licenseNote: catalog.licenseNote
    };
  });
}

function expandChillpeachCatalog(catalog: CompactChillpeachCatalog): MusicTrack[] {
  return catalog.items.map(([videoId, title, durationSeconds, downloadUrl], index) => ({
    id: `${catalog.platformId}-licensed-lofi-${String(index + 1).padStart(3, "0")}`,
    title,
    artist: catalog.artist,
    platformId: catalog.platformId,
    categoryIds: ["soft-lofi", "japanese-lofi", "warm-lofi", "night-drive-chillhop", "rainy-day-chillhop", "japanese-chillhop"],
    scenes: ["rain", "city-night", "road-driving", "blue-hour", "urban"],
    durationSeconds,
    description: `${catalog.description}｜匹配层级：严格命中｜Cute / Dreamy / Soft Lo-Fi`,
    listenUrl: `https://www.youtube.com/watch?v=${videoId}`,
    downloadUrl,
    downloadLabel: catalog.downloadLabel,
    credit: catalog.credit.replace("曲名", title).replace("视频ID", videoId),
    licenseNote: catalog.licenseNote
  }));
}

function expandKhaimCatalog(catalog: CompactKhaimCatalog): MusicTrack[] {
  return catalog.items.map(([videoId, title, durationSeconds, kind, summary], index) => ({
    id: `${catalog.platformId}-calm-lofi-${String(index + 1).padStart(3, "0")}`,
    title,
    artist: catalog.artist,
    platformId: catalog.platformId,
    categoryIds: kind === "jazz"
      ? ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop", "soft-lofi"]
      : kind === "ambient"
        ? ["ambient-healing", "soft-lofi", "warm-lofi"]
        : kind === "acoustic"
          ? ["soft-lofi", "warm-lofi", "warm-sunset-chillhop"]
          : ["soft-lofi", "warm-lofi", "night-drive-chillhop", "rainy-day-chillhop"],
    scenes: kind === "ambient" || kind === "acoustic"
      ? ["rain", "sunrise", "blue-hour", "countryside"]
      : ["rain", "city-night", "road-driving", "blue-hour", "urban"],
    durationSeconds,
    description: `${catalog.description}｜匹配层级：严格命中｜${summary}`,
    listenUrl: `https://www.youtube.com/watch?v=${videoId}`,
    downloadUrl: catalog.downloadUrl,
    downloadLabel: catalog.downloadLabel,
    credit: catalog.credit,
    licenseNote: catalog.licenseNote
  }));
}

function expandRedBearsCatalog(catalog: CompactRedBearsCatalog): MusicTrack[] {
  return catalog.items.map(([title, durationSeconds, summary], index) => ({
    id: `${catalog.platformId}-calm-piano-${String(index + 1).padStart(3, "0")}`,
    title,
    artist: catalog.artist,
    platformId: catalog.platformId,
    categoryIds: ["healing-piano", "calm-piano", "gentle-piano"],
    scenes: ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
    durationSeconds,
    description: `${catalog.description}｜匹配层级：严格命中｜${summary}`,
    listenUrl: catalog.pageUrl,
    downloadUrl: catalog.pageUrl,
    downloadLabel: catalog.downloadLabel,
    credit: catalog.credit,
    licenseNote: catalog.licenseNote
  }));
}

function expandBensoundCatalog(catalog: CompactBensoundCatalog): MusicTrack[] {
  return catalog.items.map(([productId, title, artist, durationSeconds, kind, tier, summary, previewUrl, productUrl]) => {
    const categoryIds = kind === "piano"
      ? ["healing-piano", "calm-piano", "gentle-piano"]
      : kind === "ambient"
        ? ["ambient-healing", "calm-piano"]
        : kind === "jazz"
          ? ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop"]
          : kind === "acoustic"
            ? ["gentle-piano", "warm-lofi", "warm-sunset-chillhop"]
            : ["soft-lofi", "warm-lofi", "night-drive-chillhop", "rainy-day-chillhop"];
    return {
      id: `${catalog.platformId}-calm-${productId}`,
      title,
      artist,
      platformId: catalog.platformId,
      categoryIds,
      scenes: kind === "piano" || kind === "ambient" || kind === "acoustic"
        ? ["countryside", "rain", "sunrise", "blue-hour"]
        : ["rain", "city-night", "road-driving", "blue-hour", "urban"],
      durationSeconds,
      description: `${catalog.description}｜匹配层级：${tier === "core" ? "严格命中" : "相邻可用"}｜官方简介：${summary}`,
      listenUrl: previewUrl,
      downloadUrl: productUrl,
      downloadLabel: catalog.downloadLabel,
      credit: catalog.credit,
      licenseNote: catalog.licenseNote
    };
  });
}

function expandYoutubeAudioLibraryCatalog(catalog: YoutubeAudioLibraryRow[]): MusicTrack[] {
  const libraryUrl = "https://studio.youtube.com/channel/UC/music";
  return catalog.map((track, index) => {
    const [minutes = 0, seconds = 0] = track.duration.split(":").map(Number);
    return {
      id: `youtube-audio-library-calm-ambient-${String(index + 1).padStart(3, "0")}`,
      title: track.title,
      artist: track.artist,
      platformId: "youtube-audio-library",
      categoryIds: ["ambient-healing", "healing-piano", "calm-piano", "gentle-piano"],
      scenes: ["countryside", "rain", "sunrise", "city-night", "blue-hour"],
      durationSeconds: minutes * 60 + seconds,
      description: `YouTube 官方音频库｜流派：${track.genre}｜曲调：${track.mood}｜加入：${track.added}｜严格命中 Calm Ambient 低刺激筛选。`,
      listenUrl: libraryUrl,
      downloadUrl: libraryUrl,
      downloadLabel: `在官方音频库搜索“${track.title}”并下载`,
      credit: "YouTube 音频库许可；该批 100 首均由官方界面标明无需署名。",
      licenseNote: `${track.license} 允许作为视频背景音乐；可在视频编辑中裁切、淡入淡出和循环，不得把音乐文件单独分发。${track.artistUrl ? `作者频道：${track.artistUrl}` : "官方页面未提供独立作者频道链接。"}`
    };
  });
}

function expandUppbeatFreeCalmCatalog(catalog: UppbeatFreeCalmRow[]): MusicTrack[] {
  return catalog.map((track, index) => {
    const categoryIds = track.kind === "piano"
      ? ["healing-piano", "calm-piano", "gentle-piano"]
      : track.kind === "ambient"
        ? ["ambient-healing", "calm-piano"]
        : track.kind === "jazz"
          ? ["relaxed-jazz-nocturne", "gentle-piano-jazz", "jazzhop"]
          : track.kind === "acoustic"
            ? ["gentle-piano", "warm-lofi", "warm-sunset-chillhop"]
            : ["soft-lofi", "warm-lofi", "night-drive-chillhop", "rainy-day-chillhop"];
    const trackUrl = `https://uppbeat.io/music/tracks/${track.artistSlug}/${track.trackSlug}`;
    return {
      id: `uppbeat-free-calm-${String(index + 1).padStart(3, "0")}`,
      title: track.title,
      artist: track.artist,
      platformId: "uppbeat",
      categoryIds,
      scenes: track.kind === "piano" || track.kind === "ambient" || track.kind === "acoustic"
        ? ["countryside", "rain", "sunrise", "blue-hour"]
        : ["rain", "city-night", "road-driving", "blue-hour", "urban"],
      durationSeconds: track.duration,
      description: `Uppbeat 免费 Calm 严选｜${track.energy}｜${track.tempo || "未标 BPM"}｜${track.genres.join(" / ") || track.kind}｜官方标签：${track.featuredTags.map(({ name }) => name).join(" / ") || track.moods.join(" / ")}`,
      listenUrl: track.previewUrl,
      downloadUrl: trackUrl,
      downloadLabel: "打开官方曲目页，用免费额度下载并复制本次 Uppbeat Credit",
      credit: `Music: ${track.title} by ${track.artist} / Uppbeat；下载后以官方生成的唯一 Credit 替换此占位文本。`,
      licenseNote: "免费方案仅开放约 25% 曲库，每月 3 次免费下载；每次使用须放置下载时生成的唯一 Uppbeat Credit。允许 YouTube 盈利，并允许为视频裁切、淡入淡出及循环；免费用户须为个人或自由职业者且发布自己的内容，不覆盖付费广告，不得单独分发音乐、制作衍生音乐或登记 Content ID。"
    };
  });
}

function expandTeknoaxeCatalog(catalog: CompactTeknoaxeCatalog): MusicTrack[] {
  return catalog.items.map((track, index) => {
    const isPiano = track.kind === "piano";
    const pageUrl = `https://teknoaxe.com/Link_Code_3.php?q=${track.id}&genre=${track.genre}`;
    return {
      id: `${catalog.platformId}-calm-${String(index + 1).padStart(3, "0")}`,
      title: track.title,
      artist: catalog.artist,
      platformId: catalog.platformId,
      categoryIds: isPiano
        ? ["healing-piano", "calm-piano", "gentle-piano"]
        : ["ambient-healing", "warm-lofi", "warm-sunset-chillhop"],
      scenes: isPiano
        ? ["countryside", "rain", "sunrise", "blue-hour"]
        : ["countryside", "rain", "sunrise", "city-night", "road-driving", "blue-hour"],
      durationSeconds: null,
      description: `${catalog.description}｜官方分类：${track.genre}｜匹配层级：${track.tier === "core" ? "核心" : "相邻可用"}｜原生 Loop：未标注（仅按 CC BY 4.0 许可后期循环）`,
      listenUrl: `https://www.youtube.com/watch?v=${track.videoId}`,
      downloadUrl: `https://teknoaxe.com/direct_download.php?file=${encodeURIComponent(track.file)}`,
      downloadLabel: `${catalog.downloadLabel}（曲目页：${pageUrl}）`,
      credit: catalog.credit.replace("TITLE", track.title),
      licenseNote: catalog.licenseNote
    };
  });
}

function expandZukisuzukiCatalog(catalog: CompactZukisuzukiCatalog): MusicTrack[] {
  return catalog.items.map(([title, slug, mood], index) => {
    const pageUrl = `https://zukisuzukibgm.com/${slug}/`;
    return {
      id: `${catalog.platformId}-calm-lofi-${String(index + 1).padStart(3, "0")}`,
      title,
      artist: catalog.artist,
      platformId: catalog.platformId,
      categoryIds: ["soft-lofi", "warm-lofi", "night-drive-chillhop"],
      scenes: ["rain", "city-night", "road-driving", "blue-hour", "urban"],
      durationSeconds: null,
      description: `${catalog.description}｜官方标签：チル・穏やか、ローファイ、${mood}`,
      listenUrl: pageUrl,
      downloadUrl: pageUrl,
      downloadLabel: catalog.downloadLabel,
      credit: catalog.credit,
      licenseNote: catalog.licenseNote
    };
  });
}

export const youtubeMusicLibrary: YoutubeMusicLibrary = {
  ...(data as YoutubeMusicLibrary),
  tracks: [
    ...(data as YoutubeMusicLibrary).tracks,
    ...expandAlbumCatalog(streambeatsLofiCatalog as CompactAlbumCatalog),
    ...expandTaggedCatalog(scottBuckleyCatalog as CompactTaggedCatalog),
    ...expandMetadataCatalog(incompetechCatalog as CompactMetadataCatalog),
    ...expandDovaCatalog(dovaLoopableCatalog as CompactDovaCatalog),
    ...expandAmachaCatalog(amachaGentleCatalog as CompactAmachaCatalog),
    ...expandBgmerCatalog(bgmerCalmCatalog as CompactBgmerCatalog),
    ...expandPurrpleCatCatalog(purrpleCatCalmCatalog as CompactPurrpleCatCatalog),
    ...expandPixabayCatalog(pixabayCalmLofiCatalog as CompactPixabayCatalog),
    ...expandMixkitCatalog(mixkitCalmCatalog as CompactMixkitCatalog),
    ...expandAudionautixCatalog(audionautixCalmCatalog as CompactAudionautixCatalog),
    ...expandMaouDamashiiCatalog(maouDamashiiCalmCatalog as CompactMaouDamashiiCatalog),
    ...expandMusMusCatalog(musmusCalmCatalog as CompactMusMusCatalog),
    ...expandOtoLogicCatalog(otologicCalmCatalog as CompactOtoLogicCatalog),
    ...expandHmixGalleryCatalog(hmixGalleryHealingCatalog as CompactHmixGalleryCatalog),
    ...expandPerituneCatalog(perituneHealingCatalog as CompactPerituneCatalog),
    ...expandFreebgmJpCatalog(freebgmJpPianoAmbientCatalog as CompactFreebgmJpCatalog),
    ...expandOtoNoteCatalog(otoNoteCalmCatalog as CompactOtoNoteCatalog),
    ...expandZukisuzukiCatalog(zukisuzukiCalmCatalog as CompactZukisuzukiCatalog),
    ...expandRoaMusicCatalog(roaMusicCalmCatalog as CompactRoaMusicCatalog),
    ...expandChillpeachCatalog(chillpeachLicensedCatalog as CompactChillpeachCatalog),
    ...expandKhaimCatalog(khaimCalmLofiCatalog as CompactKhaimCatalog),
    ...expandRedBearsCatalog(redBearsCalmPianoCatalog as CompactRedBearsCatalog),
    ...expandBensoundCatalog(bensoundFreeCalmCatalog as CompactBensoundCatalog),
    ...expandYoutubeAudioLibraryCatalog(youtubeAudioLibraryCalmAmbientCatalog as YoutubeAudioLibraryRow[]),
    ...expandUppbeatFreeCalmCatalog(uppbeatFreeCalmCatalog as UppbeatFreeCalmRow[]),
    ...expandTeknoaxeCatalog(teknoaxeCalmCatalog as CompactTeknoaxeCatalog)
  ]
};

export function filterMusicPlatforms(input: { categoryId?: string; scene?: MusicScene; risk?: MusicRisk; query?: string }) {
  const categoryIdsForScene = input.scene
    ? new Set(youtubeMusicLibrary.categories.filter((category) => category.scenes.includes(input.scene!)).map((category) => category.id))
    : null;
  const needle = input.query?.trim().toLowerCase() ?? "";
  return youtubeMusicLibrary.platforms.filter((platform) => {
    const categoryMatch = !input.categoryId || platform.supportedCategoryIds.includes(input.categoryId);
    const sceneMatch = !categoryIdsForScene || platform.supportedCategoryIds.some((id) => categoryIdsForScene.has(id));
    const riskMatch = !input.risk || platform.license.risk === input.risk;
    const searchable = [platform.name, platform.catalogFit, platform.license.notes, ...platform.supportedCategoryIds].join(" ").toLowerCase();
    return categoryMatch && sceneMatch && riskMatch && (!needle || searchable.includes(needle));
  });
}

export function filterMusicAlbums(input: { platformId?: string; family?: MusicFamily; categoryId?: string; scene?: MusicScene; query?: string }) {
  const categoryIds = input.family
    ? new Set(youtubeMusicLibrary.categories.filter((category) => input.family === "lofi" ? category.family === "lofi" || category.family === "chillhop" : category.family === input.family).map((category) => category.id))
    : null;
  const needle = input.query?.trim().toLowerCase() ?? "";
  return youtubeMusicLibrary.albums.filter((album) => {
    const platformMatch = !input.platformId || album.platformId === input.platformId;
    const familyMatch = !categoryIds || album.categoryIds.some((id) => categoryIds.has(id));
    const categoryMatch = !input.categoryId || album.categoryIds.includes(input.categoryId);
    const sceneMatch = !input.scene || album.scenes.includes(input.scene);
    const searchable = [album.title, album.artist, album.description, ...album.trackHighlights].join(" ").toLowerCase();
    return platformMatch && familyMatch && categoryMatch && sceneMatch && (!needle || searchable.includes(needle));
  });
}

export function filterMusicTracks(input: { platformId?: string; family?: MusicFamily; categoryId?: string; scene?: MusicScene; query?: string; minDurationSeconds?: number }) {
  const categoryIds = input.family
    ? new Set(youtubeMusicLibrary.categories.filter((category) => input.family === "lofi" ? category.family === "lofi" || category.family === "chillhop" : category.family === input.family).map((category) => category.id))
    : null;
  const needle = input.query?.trim().toLowerCase() ?? "";
  return youtubeMusicLibrary.tracks.filter((track) => {
    const platformMatch = !input.platformId || track.platformId === input.platformId;
    const familyMatch = !categoryIds || track.categoryIds.some((id) => categoryIds.has(id));
    const categoryMatch = !input.categoryId || track.categoryIds.includes(input.categoryId);
    const sceneMatch = !input.scene || track.scenes.includes(input.scene);
    const durationMatch = input.minDurationSeconds === undefined || (track.durationSeconds !== null && track.durationSeconds >= input.minDurationSeconds);
    const searchable = [track.title, track.artist, track.description].join(" ").toLowerCase();
    return platformMatch && familyMatch && categoryMatch && sceneMatch && durationMatch && (!needle || searchable.includes(needle));
  });
}
