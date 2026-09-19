import assert from "node:assert/strict";
import test from "node:test";
import { buildPlatformAttributionTemplate, filterMusicAlbums, filterMusicPlatforms, filterMusicTracks, isAiGeneratedTrack, youtubeMusicLibrary, youtubePianoCreators, type MusicTrack } from "./youtubeMusicService.js";

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

test("AI-generated filter excludes explicitly disclosed AI music without guessing from names", () => {
  const base: MusicTrack = {
    id: "origin-check", title: "Calm Morning", artist: "Human Artist", platformId: "dova-syndrome",
    categoryIds: ["healing-piano"], scenes: ["sunrise"], durationSeconds: 180,
    description: "Gentle piano", listenUrl: "https://example.com/listen", downloadUrl: "https://example.com/download",
    downloadLabel: "Download", credit: "Music by Human Artist", licenseNote: "YouTube use allowed"
  };
  assert.equal(isAiGeneratedTrack(base), false);
  assert.equal(isAiGeneratedTrack({ ...base, creationOrigin: "ai-generated" }), true);
  assert.equal(isAiGeneratedTrack({ ...base, description: "AI-generated with Udio" }), true);
  assert.equal(isAiGeneratedTrack({ ...base, description: "AI modified or generated" }), true);
  assert.equal(isAiGeneratedTrack({ ...base, description: "AI 生成音乐" }), true);
  assert.equal(isAiGeneratedTrack({ ...base, creationOrigin: "human", listenUrl: "https://pixabay.com/music/lofi-lofi-vinyl-teapot-553356/" }), true);
  assert.ok(filterMusicTracks({}).every((track) => !isAiGeneratedTrack(track)));
});

test("independent YouTube pianist batch contributes 100 human-origin CC BY tracks", () => {
  const platformIds = new Set(["savfk-youtube", "alexander-nakarada-youtube"]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => platformIds.has(track.platformId) && track.title !== "Transcendence");
  assert.equal(tracks.length, 100);
  assert.equal(new Set(tracks.map((track) => track.listenUrl)).size, 100);
  assert.equal(tracks.filter((track) => (track.durationSeconds ?? 0) >= 600).length, 2);
  assert.ok(tracks.every((track) => track.creationOrigin === "human" && !isAiGeneratedTrack(track)));
  assert.ok(tracks.every((track) => /CC BY 4\.0/.test(track.credit) && /盈利/.test(track.licenseNote)));
  assert.ok(tracks.every((track) => track.categoryIds.some((id) => ["healing-piano", "calm-piano", "gentle-piano", "ambient-healing"].includes(id))));
});

test("piano creator directory counts creators rather than tracks", () => {
  assert.equal(youtubePianoCreators.length, 50);
  assert.equal(new Set(youtubePianoCreators.map((creator) => creator.id)).size, 50);
  assert.equal(new Set(youtubePianoCreators.map((creator) => creator.youtubeUrl)).size, 50);
  assert.ok(youtubePianoCreators.every((creator) => creator.creationOrigin === "human"));
  assert.ok(youtubePianoCreators.every((creator) => creator.youtubeUrl.startsWith("https://www.youtube.com/")));
  assert.ok(youtubePianoCreators.every((creator) => creator.channelType === "personal-channel"));
  assert.ok(youtubePianoCreators.every((creator) => creator.licenseBasis === "permission-required"));
});

test("StreamBeats official catalog contributes a verified 144-track batch", () => {
  const streambeatsTracks = youtubeMusicLibrary.tracks.filter((track) => track.platformId === "streambeats");
  const importedTracks = streambeatsTracks.filter((track) => /^streambeats-(prime|quest|neon|secluded|rain|reflection)-/.test(track.id));
  assert.equal(importedTracks.length, 144);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 144);
  assert.ok(importedTracks.every((track) => track.categoryIds.includes("soft-lofi")));
  assert.ok(importedTracks.every((track) => track.downloadUrl.startsWith("https://streambeats.bandcamp.com/album/")));
  assert.ok(importedTracks.every((track) => !isAiGeneratedTrack(track)));
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
  const longTitles = new Set(["That Zen Moment", "Concentration", "Organic Meditations Two", "Tranquility Base", "Light Awash"]);
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^incompetech-(piano|ambient|jazz)-.+-usuan\d{7}$/.test(track.id) && !longTitles.has(track.title));
  assert.equal(importedTracks.length, 100);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 100);
  assert.ok(importedTracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(importedTracks.every((track) => /incompetech\.com\/music\/royalty-free\/index\.html\?Search=Search&isrc=USUAN\d{7}$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /(Calm|Calming|Relaxed)/.test(track.description)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("ambient-healing")));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("gentle-piano-jazz")));
});

test("human-authored long catalog adds six original tracks over ten minutes", () => {
  const titles = new Set(["That Zen Moment", "Concentration", "Organic Meditations Two", "Tranquility Base", "Light Awash", "Transcendence"]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => titles.has(track.title));
  assert.equal(tracks.length, 6);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds >= 600));
  assert.ok(tracks.every((track) => !isAiGeneratedTrack(track)));
  assert.equal(new Set(tracks.map((track) => track.listenUrl)).size, 6);
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

test("DOVA strict human healing batch contributes 17 real-duration tracks", () => {
  const detailIds = new Set([23250, 23370, 23687, 23335, 2690, 20678, 2620, 1208, 23154, 23352, 23213, 23345, 23753, 2119, 23115, 23291, 23266]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 17);
  assert.equal(new Set(tracks.map((track) => track.id)).size, 17);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0 && track.durationSeconds < 600));
  assert.ok(tracks.every((track) => !track.categoryIds.includes("signature-healing-loop")));
});

test("DOVA second strict human healing batch contributes 12 non-loop tracks", () => {
  const detailIds = new Set([23580, 14354, 19409, 16159, 14797, 19572, 14513, 5739, 3038, 8384, 20495, 18889]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 12);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0 && track.durationSeconds < 600));
  assert.ok(tracks.every((track) => !track.categoryIds.includes("signature-healing-loop")));
});

test("DOVA contributes 11 new gentle jazz and soft lofi tracks without Khaim duplicates", () => {
  const detailIds = new Set([22681, 21818, 14681, 22258, 13200, 2822, 3256, 5937, 17311, 23446, 19637]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 11);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("gentle-piano-jazz")).length, 9);
  assert.equal(tracks.filter((track) => track.categoryIds.includes("warm-lofi")).length, 2);
  assert.ok(tracks.every((track) => !["Sometimes", "Somewhere", "Somebody", "Somehow"].includes(track.title)));
});

test("DOVA contributes 12 human soft-acoustic-guitar tracks", () => {
  const detailIds = new Set([11054, 10566, 20839, 7602, 14579, 17696, 15738, 7326, 16200, 10753, 14942, 739]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 12);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(tracks.every((track) => /Guitar/i.test(track.description)));
  assert.equal(new Set(tracks.map((track) => track.listenUrl)).size, 12);
});

test("DOVA contributes 12 drum-free ambient and sparse-piano tracks with six native loops", () => {
  const detailIds = new Set([22768, 22767, 22424, 22119, 21949, 21441, 20610, 19760, 23034, 22605, 22430, 21004]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 12);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(tracks.every((track) => !/Drum|Percussion|EDM|Funk/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).length, 6);
});

test("DOVA contributes 14 human rain, snow and quiet-night tracks", () => {
  const detailIds = new Set([20304, 19730, 12369, 19746, 22210, 13958, 19814, 17381, 12058, 13672, 17766, 17482, 17734, 18602]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 14);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(tracks.every((track) => !/Drum|Percussion|EDM|Funk/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).length, 1);
});

test("DOVA contributes 12 human sunrise, coast and countryside tracks", () => {
  const detailIds = new Set([22079, 22140, 18308, 20733, 19507, 21404, 12362, 18027, 8414, 8260, 16603, 21667]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 12);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.durationSeconds !== null && track.durationSeconds > 0));
  assert.ok(tracks.every((track) => !/Drum|Percussion|EDM|Funk/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).length, 1);
});

test("DOVA contributes eight strict human forest, stream, lake and mist tracks", () => {
  const detailIds = new Set([10255, 15847, 21846, 16659, 17957, 12910, 10157, 11662]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle/.test(track.description)));
  assert.ok(tracks.every((track) => !/Drum|Percussion|EDM|Funk/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).length, 3);
  assert.equal(Math.max(...tracks.map((track) => track.durationSeconds ?? 0)), 523);
});

test("DOVA contributes five strict drum-free city-night and warm-lofi tracks", () => {
  const detailIds = new Set([22951, 20090, 21565, 14034, 16751]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 5);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle/.test(track.description)));
  assert.ok(tracks.every((track) => !/Drum|Percussion|EDM|Funk/i.test(track.description)));
  assert.ok(tracks.every((track) => !track.categoryIds.includes("signature-healing-loop")));
});

test("DOVA contributes six strict drum-free gentle-piano jazz night tracks", () => {
  const detailIds = new Set([20989, 23500, 23736, 17309, 15556, 15512]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 6);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle/.test(track.description)));
  assert.ok(tracks.every((track) => !/Drum|Percussion|EDM|Funk/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).length, 3);
});

test("DOVA contributes three strict human healing tracks over five minutes", () => {
  const detailIds = new Set([5556, 10170, 11033]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 3);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => (track.durationSeconds ?? 0) >= 300));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle.*Healing/.test(track.description)));
  assert.ok(tracks.every((track) => !/Drum|Percussion|EDM|Funk|Forceful/i.test(track.description)));
  assert.equal(Math.max(...tracks.map((track) => track.durationSeconds ?? 0)), 564);
});

test("DOVA contributes two strict human minimal healing-piano tracks", () => {
  const detailIds = new Set([10159, 16897]);
  const tracks = youtubeMusicLibrary.tracks.filter((track) => detailIds.has(Number(track.id.replace("dova-syndrome-healing-", ""))));
  assert.equal(tracks.length, 2);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle.*Healing/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk/i.test(track.description)));
  assert.ok(tracks.every((track) => track.categoryIds.includes("gentle-piano")));
});

test("DOVA contributes one strict human warm nostalgic return-road piano track", () => {
  const track = youtubeMusicLibrary.tracks.find((item) => item.id === "dova-syndrome-healing-14899");
  assert.ok(track);
  assert.equal(track.creationOrigin, "human");
  assert.equal(track.durationSeconds, 180);
  assert.match(track.description, /Warm.*Calm.*Gentle.*Healing.*Weak.*Nostalgic/);
  assert.doesNotMatch(track.description, /Grand|Forceful|Drum|Percussion|EDM|Funk/i);
});

test("DOVA replaces a grand-tagged track with one recent strict human healing ambient track", () => {
  assert.equal(youtubeMusicLibrary.tracks.some((track) => track.id === "dova-syndrome-healing-23509"), false);
  const track = youtubeMusicLibrary.tracks.find((item) => item.id === "dova-syndrome-healing-21779");
  assert.ok(track);
  assert.equal(track.creationOrigin, "human");
  assert.match(track.description, /Warm.*Calm.*Gentle.*Healing.*Weak/);
  assert.doesNotMatch(track.description, /Grand|Forceful|Drum|Percussion|EDM|Funk/i);
});

test("DOVA contributes two strict human native-loop soft music-box tracks", () => {
  const ids = new Set([15973, 16090].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 2);
  assert.deepEqual(tracks.map((track) => track.durationSeconds).sort((a, b) => (a ?? 0) - (b ?? 0)), [113, 285]);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.categoryIds.includes("signature-healing-loop")));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle.*Healing.*Weak.*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk/i.test(track.description)));
});

test("DOVA contributes six strict human soft-guitar piano and pad tracks", () => {
  const detailIds = [8674, 3072, 21698, 19702, 11928, 3549];
  const ids = new Set(detailIds.map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 6);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle.*Healing.*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud/i.test(track.description)));
  assert.deepEqual(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).map((track) => track.id).sort(), ["dova-syndrome-healing-3072", "dova-syndrome-healing-8674"]);
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-21698")?.durationSeconds, 402);
});

test("DOVA contributes five strict human long-video tracks", () => {
  const ids = new Set([7223, 20584, 19244, 21662, 1214].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 5);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => (track.durationSeconds ?? 0) >= 300));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle.*Healing.*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud/i.test(track.description)));
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-21662")?.durationSeconds, 600);
  assert.deepEqual(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).map((track) => track.id), ["dova-syndrome-healing-1214"]);
});

test("DOVA contributes eight new strict human native-loop tracks", () => {
  const ids = new Set([11957, 11785, 11594, 11694, 9868, 10125, 14342, 5968].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.categoryIds.includes("signature-healing-loop")));
  assert.ok(tracks.every((track) => /Warm.*Calm.*Gentle.*Healing/.test(track.description) && /Weak|Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud/i.test(track.description)));
  assert.equal(tracks.filter((track) => /官方标签：[^｜]*Weak[^｜]*Slow/.test(track.description)).length, 5);
});

test("DOVA contributes eight new strict human sparse piano-only tracks", () => {
  const ids = new Set([17219, 19463, 1925, 3430, 1810, 5508, 6929, 13531].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => track.categoryIds.includes("healing-piano")));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Piano[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Weak[^｜]*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear/i.test(track.description)));
  assert.deepEqual(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).map((track) => track.id), ["dova-syndrome-healing-6929"]);
});

test("DOVA contributes one new strict human piano-free thin-pad ambient track", () => {
  const track = youtubeMusicLibrary.tracks.find((item) => item.id === "dova-syndrome-healing-8553");
  assert.ok(track);
  assert.equal(track.creationOrigin, "human");
  assert.equal(track.durationSeconds, 109);
  assert.ok(track.categoryIds.includes("ambient-healing"));
  assert.match(track.description, /官方标签：Synth Pad.*Ambient.*Warm.*Calm.*Gentle.*Healing.*Weak.*Slow/);
  assert.doesNotMatch(track.description, /Piano|Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair/);
  assert.equal(track.categoryIds.includes("signature-healing-loop"), false);
});

test("DOVA contributes eight new strict human soft-acoustic-guitar tracks", () => {
  const ids = new Set([15843, 12213, 23323, 672, 21967, 12191, 5345, 11231].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*A\.Guitar[^｜]*Acoustic[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair/i.test(track.description)));
  assert.ok(tracks.every((track) => !track.categoryIds.includes("signature-healing-loop")));
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-12191")?.durationSeconds, 95);
});

test("DOVA contributes eight new strict human drumless city-night ambient tracks", () => {
  const ids = new Set([10126, 17380, 12736, 2271, 18119, 2565, 13828, 12696].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing/.test(track.description) && /官方标签：[^｜]*(Weak|Slow)/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|Beat|Hiphop|EDM|Funk|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair/i.test(track.description)));
  assert.deepEqual(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).map((track) => track.id).sort(), ["dova-syndrome-healing-12696", "dova-syndrome-healing-13828", "dova-syndrome-healing-2565"]);
});

test("DOVA contributes eight new strict human rural rain and sunrise tracks", () => {
  const ids = new Set([13759, 12500, 429, 15218, 796, 17573, 10647, 10776].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing/.test(track.description) && /官方标签：[^｜]*(Weak|Slow)/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair|Void/i.test(track.description)));
  assert.equal(tracks.filter((track) => (track.durationSeconds ?? 0) >= 150).length, 5);
  assert.ok(tracks.every((track) => !track.categoryIds.includes("signature-healing-loop")));
});

test("DOVA contributes eight new strict human healing tracks with six native loops", () => {
  const ids = new Set([2025, 8983, 12001, 12298, 14505, 14006, 21062, 20081].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair|Void/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).length, 6);
  assert.equal(tracks.filter((track) => (track.durationSeconds ?? 0) >= 180).length, 2);
});

test("DOVA contributes eight new strict human low-presence piano tracks", () => {
  const ids = new Set([2692, 14752, 5439, 12642, 1055, 3444, 11293, 9970].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Piano[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|EDM|Funk|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair|Void/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).length, 2);
  assert.equal(tracks.filter((track) => track.description.includes("Sparse")).length, 4);
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-1055")?.durationSeconds, 202);
});

test("DOVA contributes five new strict human drumless piano-jazz and blue-hour tracks", () => {
  const ids = new Set([12951, 11960, 2454, 19778, 3397].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 5);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|Swing|Beat|Funk|EDM|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair|Void/i.test(track.description)));
  assert.equal(tracks.filter((track) => track.categoryIds.includes("gentle-piano-jazz")).length, 2);
  assert.ok(tracks.every((track) => !track.categoryIds.includes("signature-healing-loop")));
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-3397")?.durationSeconds, 206);
});

test("DOVA contributes eight new strict human warm city-night weak-beat Lo-Fi tracks", () => {
  const ids = new Set([19866, 14808, 18826, 15907, 17173, 17514, 18386, 14323].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Slow[^｜]*Weak Beat/.test(track.description)));
  assert.ok(tracks.every((track) => !/Forceful|Funk|EDM|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair|Void/i.test(track.description)));
  assert.ok(tracks.every((track) => track.categoryIds.includes("warm-lofi") && track.scenes.includes("road-driving")));
  assert.equal(tracks.filter((track) => (track.durationSeconds ?? 0) >= 180).length, 5);
  assert.deepEqual(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).map((track) => track.id), ["dova-syndrome-healing-14323"]);
});

test("DOVA contributes six new strict human rain forest and lake thin-ambient tracks", () => {
  const ids = new Set([21908, 18098, 18792, 15581, 8783, 5388].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 6);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|Funk|EDM|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair|Void/i.test(track.description)));
  assert.ok(tracks.every((track) => !track.categoryIds.includes("signature-healing-loop")));
  assert.ok(tracks.every((track) => (track.durationSeconds ?? 0) < 180));
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-21908")?.durationSeconds, 134);
});

test("DOVA contributes eight new strict human countryside morning and sunrise piano tracks", () => {
  const ids = new Set([13979, 15374, 20083, 11709, 1922, 12689, 20696, 3150].map((id) => `dova-syndrome-healing-${id}`));
  const tracks = youtubeMusicLibrary.tracks.filter((track) => ids.has(track.id));
  assert.equal(tracks.length, 8);
  assert.ok(tracks.every((track) => track.creationOrigin === "human"));
  assert.ok(tracks.every((track) => /官方标签：[^｜]*Piano[^｜]*Warm[^｜]*Calm[^｜]*Gentle[^｜]*Healing[^｜]*Slow/.test(track.description)));
  assert.ok(tracks.every((track) => !/Grand|Forceful|Drum|Percussion|Funk|EDM|Energetic|Intense|Loud|Passion|Serious|Tension|Dark|Fear|Despair|Void/i.test(track.description)));
  assert.equal(tracks.filter((track) => (track.durationSeconds ?? 0) >= 180).length, 1);
  assert.deepEqual(tracks.filter((track) => track.categoryIds.includes("signature-healing-loop")).map((track) => track.id), ["dova-syndrome-healing-3150"]);
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-11709")?.title, "優しさのピアニシモ");
  assert.equal(tracks.find((track) => track.id === "dova-syndrome-healing-20083")?.title, "What comes into being");
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

test("Pixabay batch removes 22 explicitly AI-disclosed tracks", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^pixabay-music-calm-lofi-/.test(track.id));
  assert.equal(importedTracks.length, 78);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 78);
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

test("PeriTune contributes a 105-entry evidence-backed Healing batch", () => {
  const importedTracks = youtubeMusicLibrary.tracks.filter((track) => /^peritune-healing-(piano|ambient|acoustic)-\d{3}$/.test(track.id));
  assert.equal(importedTracks.length, 105);
  assert.equal(new Set(importedTracks.map((track) => track.id)).size, 105);
  assert.ok(importedTracks.every((track) => /^https:\/\/peritune\.com\/blog\/.+\/$/.test(track.downloadUrl)));
  assert.ok(importedTracks.every((track) => /YouTube/.test(track.licenseNote) && /Content ID/.test(track.licenseNote)));
  assert.ok(importedTracks.some((track) => track.categoryIds.includes("healing-piano")));
  assert.ok(importedTracks.some((track) => /原生循环文件：有/.test(track.description)));
  const memories2 = importedTracks.find((track) => track.title === "Memories2");
  assert.ok(memories2);
  assert.equal(memories2.durationSeconds, 146);
  assert.equal(memories2.creationOrigin, "human");
  assert.match(memories2.description, /healing, warm, calm, gentle, slow, piano, soft guitar/);
  const softDay = importedTracks.find((track) => track.title === "Soft_Day");
  assert.ok(softDay);
  assert.equal(softDay.durationSeconds, 223);
  assert.equal(softDay.creationOrigin, "human");
  assert.match(softDay.description, /healing, warm, calm, gentle.*acoustic guitar/);
  assert.match(softDay.description, /原生循环文件：有/);
  const shizima2 = importedTracks.find((track) => track.title === "Shizima2");
  assert.ok(shizima2);
  assert.equal(shizima2.durationSeconds, 99);
  assert.equal(shizima2.creationOrigin, "human");
  assert.match(shizima2.description, /healing, warm, calm, gentle, quiet/);
  assert.match(shizima2.description, /原生循环文件：有/);
});

test("AI collection and disclosed Pixabay tracks are absent from the library", () => {
  assert.equal(youtubeMusicLibrary.tracks.some((track) => track.platformId === "freebgm-jp"), false);
  assert.ok(youtubeMusicLibrary.tracks.every((track) => !isAiGeneratedTrack(track)));
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

test("discovery applies platform risk and platform-name search to tracks and albums", () => {
  for (const filter of [filterMusicTracks, filterMusicAlbums]) {
    for (const risk of ["low", "medium", "high"] as const) {
      const expected = filter({}).filter((item) => youtubeMusicLibrary.platforms.find((platform) => platform.id === item.platformId)?.license.risk === risk);
      assert.deepEqual(filter({ risk }), expected);
    }
    const source = youtubeMusicLibrary.platforms.find((platform) => platform.id === "streambeats")!;
    const expected = filter({ platformId: source.id });
    assert.ok(expected.length > 0);
    assert.deepEqual(filter({ platformId: source.id, query: `  ${source.name.toUpperCase()}  ` }), expected);
    assert.equal(filter({ platformId: source.id, risk: source.license.risk === "low" ? "high" : "low" }).length, 0);
  }
  const combined = filterMusicTracks({ family: "piano", scene: "rain", minDurationSeconds: 600, risk: "low" });
  assert.deepEqual(combined, filterMusicTracks({ family: "piano", scene: "rain", minDurationSeconds: 600 }).filter((track) => youtubeMusicLibrary.platforms.find((platform) => platform.id === track.platformId)?.license.risk === "low"));
});

test("September additions remain unique, searchable, and preserve loop evidence", () => {
  const additions = [
    ["Whisper", 249, true],
    ["Sakuya2", 206, true]
  ] as const;
  for (const [title, duration, nativeLoop] of additions) {
    const matches = youtubeMusicLibrary.tracks.filter((track) => track.title === title);
    assert.equal(matches.length, 1, title);
    const track = matches[0];
    assert.ok(track);
    assert.equal(track.durationSeconds, duration);
    assert.equal(track.creationOrigin, "human");
    assert.equal(isAiGeneratedTrack(track), false);
    assert.ok(filterMusicTracks({ query: title }).some((result) => result.id === track.id));
    assert.match(track.description, nativeLoop ? /原生循环文件：有/ : /原生 Loop：否/);
    assert.match(track.licenseNote, /YouTube/);
  }
});
