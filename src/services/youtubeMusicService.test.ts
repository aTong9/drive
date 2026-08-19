import assert from "node:assert/strict";
import test from "node:test";
import { buildPlatformAttributionTemplate, filterMusicAlbums, filterMusicPlatforms, filterMusicTracks, youtubeMusicLibrary } from "./youtubeMusicService.js";

test("music library references valid category ids", () => {
  const ids = new Set(youtubeMusicLibrary.categories.map((category) => category.id));
  assert.equal(ids.size, youtubeMusicLibrary.categories.length);
  for (const platform of youtubeMusicLibrary.platforms) for (const id of platform.supportedCategoryIds) assert.ok(ids.has(id), `${platform.id}: ${id}`);
});

test("all requested scene families are represented", () => {
  assert.deepEqual(new Set(youtubeMusicLibrary.categories.map((category) => category.family)), new Set(["piano", "lofi", "chillhop", "jazz"]));
  assert.deepEqual(new Set(youtubeMusicLibrary.categories.flatMap((category) => category.scenes)), new Set(["countryside", "rain", "sunrise", "city-night", "road-driving", "blue-hour", "urban"]));
});

test("chillhop is a first-class family with all requested directions", () => {
  const ids = new Set(youtubeMusicLibrary.categories.filter((category) => category.family === "chillhop").map((category) => category.id));
  assert.deepEqual(ids, new Set(["night-drive-chillhop", "jazzhop", "warm-sunset-chillhop", "rainy-day-chillhop", "japanese-chillhop"]));
  assert.ok(filterMusicPlatforms({ categoryId: "night-drive-chillhop", scene: "road-driving", risk: "low" }).length > 0);
});

test("platform filter combines category, scene and risk", () => {
  const results = filterMusicPlatforms({ categoryId: "warm-lofi", scene: "road-driving", risk: "low" });
  assert.ok(results.length > 0);
  assert.ok(results.every((platform) => platform.supportedCategoryIds.includes("warm-lofi") && platform.license.risk === "low"));
});

test("creator libraries expose free monetization and editing terms", () => {
  const requestedIds = new Set(["zukisuzuki-bgm", "streambeats", "dova-syndrome", "chillpeach", "scott-buckley", "purrple-cat", "roa-music", "peritune", "khaim", "ncs", "pixabay-music", "mixkit", "incompetech", "audionautix", "bensound-free", "freebgm-jp", "bgmer", "otologic", "maou-damashii", "musmus", "hmix-gallery", "amacha-music", "oto-note", "red-bears"]);
  const requested = youtubeMusicLibrary.platforms.filter((platform) => requestedIds.has(platform.id));
  assert.equal(requested.length, requestedIds.size);
  assert.ok(requested.every((platform) => platform.license.cost === "free"));
  assert.ok(requested.every((platform) => platform.importMode === "download-import"));
  assert.ok(requested.every((platform) => platform.license.monetization !== "not-covered"));
  assert.ok(requested.every((platform) => platform.license.audioEditing !== undefined));
});

test("library excludes paid-only subscription and per-track platforms", () => {
  assert.ok(youtubeMusicLibrary.platforms.every((platform) => platform.kind !== "subscription" && platform.kind !== "per-track"));
  assert.ok(youtubeMusicLibrary.platforms.every((platform) => platform.license.cost !== "subscription" && platform.license.cost !== "per-track-or-subscription"));
});

test("every platform is available through a free usage path", () => {
  assert.ok(youtubeMusicLibrary.platforms.length > 0);
  assert.ok(youtubeMusicLibrary.platforms.every((platform) => platform.license.cost === "free" || platform.license.cost === "free-or-paid"));
});

test("every free platform exposes a copy-ready attribution and license template", () => {
  for (const platform of youtubeMusicLibrary.platforms) {
    const template = buildPlatformAttributionTemplate(platform);
    assert.match(template, /🎵 MUSIC \/ BGM/);
    assert.ok(template.includes(platform.name));
    assert.ok(template.includes(platform.url));
    assert.match(template, /\[Track title\].*\[Artist\]/);
    assert.match(template, /trimmed|Editing|synchronized/);
    assert.match(template, /Attribution|credit/);
  }
});

test("albums reference known platforms and categories", () => {
  const platformIds = new Set(youtubeMusicLibrary.platforms.map((platform) => platform.id));
  const categoryIds = new Set(youtubeMusicLibrary.categories.map((category) => category.id));
  assert.ok(youtubeMusicLibrary.albums.length >= 9);
  for (const album of youtubeMusicLibrary.albums) {
    assert.ok(platformIds.has(album.platformId), album.id);
    assert.ok(album.categoryIds.every((id) => categoryIds.has(id)), album.id);
    assert.match(album.downloadUrl, /^https:\/\//);
  }
});

test("album filter combines platform and the three active families", () => {
  const lofi = filterMusicAlbums({ platformId: "streambeats", family: "lofi", scene: "road-driving" });
  assert.ok(lofi.length >= 10);
  assert.ok(lofi.every((album) => album.platformId === "streambeats"));
  assert.ok(filterMusicAlbums({ family: "piano" }).some((album) => album.id === "pixabay-healing-piano"));
  assert.ok(filterMusicAlbums({ family: "jazz" }).some((album) => album.id === "pixabay-night-jazz"));
});

test("tracks reference known platforms and categories", () => {
  const platformIds = new Set(youtubeMusicLibrary.platforms.map((platform) => platform.id));
  const categoryIds = new Set(youtubeMusicLibrary.categories.map((category) => category.id));
  assert.ok(youtubeMusicLibrary.tracks.length >= 9);
  for (const track of youtubeMusicLibrary.tracks) {
    assert.ok(platformIds.has(track.platformId), track.id);
    assert.ok(track.categoryIds.every((id) => categoryIds.has(id)), track.id);
    assert.ok(track.durationSeconds === null || track.durationSeconds > 0, track.id);
    assert.match(track.downloadUrl, /^https:\/\//);
  }
});

test("track filter combines platform, family, scene and search", () => {
  const nightLofi = filterMusicTracks({ platformId: "streambeats", family: "lofi", scene: "road-driving" });
  assert.ok(nightLofi.length >= 2);
  assert.ok(nightLofi.every((track) => track.platformId === "streambeats"));
  assert.deepEqual(filterMusicTracks({ query: "George Street Shuffle" }).map((track) => track.id), ["incompetech-george-street-shuffle"]);
  assert.ok(filterMusicTracks({ family: "piano", scene: "rain" }).length >= 4);
  const longTracks = filterMusicTracks({ minDurationSeconds: 600 });
  assert.ok(longTracks.length > 0);
  assert.ok(longTracks.every((track) => track.durationSeconds !== null && track.durationSeconds >= 600));
  assert.ok(filterMusicTracks({ platformId: "incompetech", minDurationSeconds: 600 }).every((track) => track.platformId === "incompetech"));
});

test("StreamBeats official catalog contributes a verified 100-track batch", () => {
  const streambeatsTracks = youtubeMusicLibrary.tracks.filter((track) => track.platformId === "streambeats");
  const importedTracks = streambeatsTracks.filter((track) => /^streambeats-(prime|quest|neon|secluded)-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.every((track) => track.downloadUrl.startsWith("https://streambeats.bandcamp.com/album/")));
});

test("Scott Buckley official catalog contributes 100 typed track pages", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^scott-buckley-(piano|ambient|jazz)-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.downloadUrl.startsWith("https://www.scottbuckley.com.au/library/")));
  assert.ok(importedTracks.every((track) => /CC-BY 4\.0/.test(track.credit)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("Incompetech official metadata contributes 100 calm, typed track pages", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^incompetech-(piano|ambient|jazz)-.+-usuan\d{7}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /incompetech\.com\/music\/royalty-free\/index\.html\?Search=Search&isrc=USUAN\d{7}$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /(Calm|Calming|Relaxed)/.test(track.description)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("DOVA official advanced search contributes 100 native-loop warm tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^dova-syndrome-loopable-\d+$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => /^https:\/\/dova-s\.jp\/bgm\/detail\/\d+$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /温かい/.test(track.description) && /穏やか/.test(track.description) && /優しい/.test(track.description)));
  assert.ok(importedTracks.every((track) => /Loopable|原生标记为 Loopable/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("Amacha official gentle image catalogs contribute 100 timed download pages", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^amacha-music-(piano|ambient|jazz)-music-[a-z0-9-]+-html$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/amachamusic\.chagasi\.com\/music_[a-z0-9_]+\.html$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/amachamusic\.chagasi\.com\/mp3\/[a-z0-9_]+\.mp3$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /(癒し|ほのぼの|しみじみ|幻想的)/.test(track.description)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("BGMer official calm catalog contributes 100 directly downloadable tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^bgmer-(piano|ambient|lofi|jazz|acoustic)-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/bgmer\.net\/wp-content\/uploads\/.+\.mp3$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/bgmer\.net\/music\/.+/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /のんびり/.test(track.description)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("Purrple Cat contributes 100 strictly matched per-track CC releases", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^purrple-cat-cc-lofi-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/www\.free-stock-music\.com\/music\/purrple-cat\/mp3\/.+\.mp3$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /CC BY-SA 3\.0/.test(track.credit)));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("soft-lofi") && track.categoryIds.includes("warm-lofi")));
});

test("Pixabay official calm-lofi search contributes a verified 100-track batch", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^pixabay-music-calm-lofi-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds >= 60));
  assert.ok(importedTracks.every((track) => /^https:\/\/pixabay\.com\/music\/[a-z0-9-]+-\d+\/$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("soft-lofi") && track.categoryIds.includes("warm-lofi")));
  assert.ok(importedTracks.every((track) => /License Certificate/.test(track.licenseNote)));
});

test("Mixkit official calm categories contribute 100 timed tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^mixkit-calm-\d+$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds >= 60));
  assert.ok(importedTracks.every((track) => /^https:\/\/mixkit\.co\/free-stock-music\/download\/\d+\/$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/assets\.mixkit\.co\/music\/(\d+)\/\1\.mp3$/.test(track.listenUrl)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("Audionautix contributes its complete current strict calm subset without padding", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^audionautix-strict-calm-/.test(track.id));
  assert.equal(importedTracks.length, 31);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 31);
  assert.ok(importedTracks.every((track) => track.durationSeconds === null || track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/audionautix\.com\/Music\/[A-Za-z0-9]+\.mp3$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /(Calming|Relaxing|Soothing|Meditation|Meditative|Smooth|Chill)/i.test(track.description) && /(Slow|Medium)/.test(track.description)));
  assert.ok(importedTracks.every((track) => /Creative Commons Attribution 4\.0/.test(track.credit)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("relaxed-jazz-nocturne")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
});

test("Maou Damashii contributes 100 metadata-screened calm and adjacent tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^maou-damashii-calm-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds === null));
  assert.ok(importedTracks.every((track) => /^https:\/\/maou\.audio\/bgm_(?:piano|healing|acoustic)[a-z0-9_]+\/$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => track.listenUrl === track.downloadUrl));
  assert.ok(importedTracks.every((track) => /匹配层级：(core|adjacent)/.test(track.description)));
  assert.ok(importedTracks.every((track) => track.credit === "音乐：魔王魂"));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
});

test("MusMus contributes 100 layered calm matches with official anchored download pages", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^musmus-calm-bgm-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/musmus\.main\.jp\/bgm(?:_\d{2})?\.html#BGM-\d{3}$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]+$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /BGM：MusMus/.test(track.credit)));
  assert.ok(importedTracks.every((track) => /匹配层级：(core|adjacent)/.test(track.description)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("healing-piano")));
});

test("OtoLogic contributes 100 screened CC BY audio variants with official downloads", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^otologic-calm-(piano|ambient|jazz)-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds === null));
  assert.ok(importedTracks.every((track) => /^https:\/\/otologic\.jp\/sounds\/bgm\/pre\/.+\.mp3$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/otologic\.jp\/sounds\/bgm\/mp3-zip\/.+-mp3\.zip$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /CC BY 4\.0/.test(track.credit) && /Content ID/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("healing-piano")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
});

test("H/MIX GALLERY contributes 100 duration-verified official Healing tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^hmix-gallery-healing-(piano|ambient|acoustic)-/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => track.downloadUrl === "https://www.hmix.net/genre/healing.html"));
  assert.ok(importedTracks.every((track) => /YouTube/.test(track.licenseNote) && /Content ID/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("healing-piano")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
});

test("PeriTune contributes a 100-entry evidence-backed Healing batch", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^peritune-healing-(piano|ambient|acoustic)-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => /^https:\/\/peritune\.com\/blog\/.+\/$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /YouTube/.test(track.licenseNote) && /Content ID/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("healing-piano")));
  assert.ok(importedTracks.some((track) => /原生循环文件：有/.test(track.description)));
});

test("FreeBGM.jp contributes 100 free Piano Ambient entries with use-boundary warnings", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^freebgm-jp-piano-ambient-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.downloadUrl === "https://www.freebgm.jp/store/album.php?id=piano-ambient-deep-healing-loneliness"));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("healing-piano") && track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.every((track) => /盈利 YouTube/.test(track.licenseNote) && /长时间 BGM/.test(track.licenseNote)));
});

test("Oto Note contributes 50 safely screened calm tracks with mandatory attribution", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^oto-note-calm-(piano|ambient|lofi|jazz|acoustic)-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 50);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 50);
  assert.ok(importedTracks.every((track) => /^https:\/\/oto-note\.net\/music-\d+\/$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /前田哲/.test(track.credit) && /必须按官方格式署名/.test(track.licenseNote)));
  assert.ok(importedTracks.every((track) => /Content ID/.test(track.licenseNote) && /匹配层级/.test(track.description)));
  assert.ok(importedTracks.every((track) => /^(https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]+|https:\/\/oto-note\.net\/wp\/wp-content\/uploads\/.+\.mp3)$/.test(track.listenUrl)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("healing-piano")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("warm-lofi")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("zukisuzuki contributes 100 permanently-free pre-May-2026 calm archive tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^zukisuzuki-bgm-calm-lofi-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => /^https:\/\/zukisuzukibgm\.com\/[a-z0-9-]+\/$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("soft-lofi") && track.categoryIds.includes("warm-lofi")));
  assert.ok(importedTracks.every((track) => /2026 年 4 月以前/.test(track.licenseNote) && /Content ID/.test(track.licenseNote)));
  assert.ok(importedTracks.every((track) => /チル・穏やか/.test(track.description)));
});

test("Roa Music contributes 100 per-track licensed calm and adjacent tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^roa-music-calm-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/(?:hypeddit\.com|streamlink\.to)\/.+/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /YouTube/.test(track.licenseNote) && /署名/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
});

test("Chillpeach contributes every current per-track licensed Lo-Fi download", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^chillpeach-licensed-lofi-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 15);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 15);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view\?/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("soft-lofi") && track.categoryIds.includes("japanese-lofi")));
  assert.ok(importedTracks.every((track) => /盈利与裁切/.test(track.licenseNote) && /禁止/.test(track.licenseNote)));
});

test("Khaim contributes 30 strictly screened official calm Lo-Fi singles", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^khaim-calm-lofi-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 30);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 30);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => track.downloadUrl === "https://www.khaimmusic.com/download"));
  assert.ok(importedTracks.every((track) => /盈利/.test(track.licenseNote) && /裁切编辑/.test(track.licenseNote)));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("relaxed-jazz-nocturne")));
});

test("red bears contributes only its three low-stimulation piano matches", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^red-bears-calm-piano-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 3);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 3);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => track.downloadUrl === "https://www.nakano-sound.com/free/piano.html"));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("healing-piano")));
  assert.ok(importedTracks.every((track) => /LUFS/.test(track.description)));
  assert.ok(importedTracks.every((track) => /商用/.test(track.licenseNote) && /Content ID/.test(track.licenseNote)));
});

test("Bensound Free contributes only the strict low-stimulation subset", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^bensound-free-calm-\d+$/.test(track.id));
  assert.equal(importedTracks.length, 55);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 55);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/cdn2\.bensound\.com\/bensound-[a-z0-9-]+\.mp3$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/www\.bensound\.com\/royalty-free-music\/track\/[a-z0-9-]+$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /YouTube 盈利/.test(track.licenseNote) && /循环/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("relaxed-jazz-nocturne")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
});

test("YouTube Audio Library contributes 100 official calm ambient tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^youtube-audio-library-calm-ambient-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => track.platformId === "youtube-audio-library"));
  assert.ok(importedTracks.every((track) => track.description.includes("流派：氛围音乐") && track.description.includes("曲调：平静")));
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.every((track) => /创收/.test(track.licenseNote) && /无需署名/.test(track.licenseNote)));
  assert.ok(importedTracks.every((track) => track.downloadUrl === "https://studio.youtube.com/channel/UC/music"));
});

test("Uppbeat contributes 100 strictly screened free Calm instrumentals", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^uppbeat-free-calm-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /^https:\/\/cdn\.uppbeat\.io\/audio-files\/.+\.mp3$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/uppbeat\.io\/music\/tracks\/[a-z0-9-]+\/[a-z0-9-]+$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /Calm/.test(track.description)));
  assert.ok(importedTracks.every((track) => /每月 3 次/.test(track.licenseNote) && /25%/.test(track.licenseNote)));
  assert.ok(importedTracks.every((track) => /YouTube 盈利/.test(track.licenseNote) && /裁切、淡入淡出及循环/.test(track.licenseNote)));
  assert.ok(importedTracks.every((track) => /唯一 Uppbeat Credit/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("relaxed-jazz-nocturne")));
});

test("TeknoAXE contributes 100 free CC BY 4.0 Piano and Soft tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^teknoaxe-calm-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.equal(importedTracks.filter((track) => track.categoryIds.includes("healing-piano")).length, 57);
  assert.equal(importedTracks.filter((track) => track.categoryIds.includes("ambient-healing")).length, 43);
  assert.ok(importedTracks.every((track) => /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(track.listenUrl)));
  assert.ok(importedTracks.every((track) => /^https:\/\/teknoaxe\.com\/direct_download\.php\?file=.+\.mp3$/i.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /CC BY 4\.0/.test(track.credit) && /已修改/.test(track.credit)));
  assert.ok(importedTracks.every((track) => /YouTube 商用与盈利/.test(track.licenseNote) && /裁切、Fade、Loop/.test(track.licenseNote)));
  assert.ok(importedTracks.every((track) => /原生 Loop：未标注/.test(track.description)));
});

test("paid and region-limited Creator Music is removed from the free platform menu", () => {
  assert.equal(youtubeMusicLibrary.platforms.some((platform) => platform.id === "youtube-creator-music"), false);
});

test("DOVA gentle piano recommendations include the reference track and close alternatives", () => {
  const dovaPiano = filterMusicTracks({ platformId: "dova-syndrome", family: "piano" });
  assert.ok(dovaPiano.length >= 16);
  assert.ok(dovaPiano.some((track) => track.id === "dova-pianissimo-of-the-gentleness"));
  assert.ok(dovaPiano.some((track) => track.id === "dova-healing-morning"));
  assert.ok(dovaPiano.some((track) => track.id === "dova-rain-garden"));
  assert.ok(dovaPiano.every((track) => track.categoryIds.includes("gentle-piano")));
});

test("long-term signature profile has a 30-track native-loop DOVA collection", () => {
  const profile = youtubeMusicLibrary.categories.find((category) => category.id === "signature-healing-loop");
  const collection = youtubeMusicLibrary.albums.find((album) => album.id === "dova-signature-loopable-30");
  assert.ok(profile);
  assert.ok(collection);
  assert.equal(collection.platformId, "dova-syndrome");
  assert.equal(collection.trackHighlights.length, 30);
  assert.match(collection.listenUrl, /loop=1/);
  assert.match(collection.listenUrl, /tags_m=m03/);
  assert.match(collection.listenUrl, /tags_m=m04/);
  assert.match(collection.listenUrl, /tags_m=m05/);
  assert.match(collection.listenUrl, /tags_r=r22/);
});

test("signature profile exposes individually verified native-loop tracks", () => {
  const tracks = youtubeMusicLibrary.tracks.filter((track) => track.categoryIds.includes("signature-healing-loop"));
  assert.ok(tracks.length >= 15);
  assert.ok(tracks.every((track) => track.platformId === "dova-syndrome"));
  assert.ok(tracks.every((track) => /loop|循环/i.test(`${track.description} ${track.downloadLabel} ${track.licenseNote}`)));
});
