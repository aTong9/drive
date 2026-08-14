import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(await readFile(new URL("../schemas/roadlens-catalog.schema.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const davinciSchema = JSON.parse(await readFile(new URL("../schemas/davinci-workflow.schema.json", import.meta.url), "utf8"));
const davinciWorkflow = JSON.parse(await readFile(new URL("../data/davinci-workflow.json", import.meta.url), "utf8"));
const fieldCheckExportSchema = JSON.parse(await readFile(new URL("../schemas/field-check-export.schema.json", import.meta.url), "utf8"));
const regionsSchema = JSON.parse(await readFile(new URL("../schemas/regions.schema.json", import.meta.url), "utf8"));
const regions = JSON.parse(await readFile(new URL("../data/regions.json", import.meta.url), "utf8"));
const youtubeCreatorsSchema = JSON.parse(await readFile(new URL("../schemas/youtube-creators.schema.json", import.meta.url), "utf8"));
const youtubeCreators = JSON.parse(await readFile(new URL("../data/youtube-creators.json", import.meta.url), "utf8"));
const youtubeMusicSchema = JSON.parse(await readFile(new URL("../schemas/youtube-music-library.schema.json", import.meta.url), "utf8"));
const youtubeMusic = JSON.parse(await readFile(new URL("../data/youtube-music-library.json", import.meta.url), "utf8"));
const streambeatsLofiCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/streambeats-lofi-100.json", import.meta.url), "utf8"));
const scottBuckleyCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/scott-buckley-100.json", import.meta.url), "utf8"));
const incompetechCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/incompetech-calm-100.json", import.meta.url), "utf8"));
const dovaLoopableCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/dova-loopable-warm-100.json", import.meta.url), "utf8"));
const amachaGentleCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/amacha-gentle-100.json", import.meta.url), "utf8"));
const bgmerCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/bgmer-calm-100.json", import.meta.url), "utf8"));
const purrpleCatCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/purrple-cat-calm-100.json", import.meta.url), "utf8"));
const pixabayCalmLofiCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/pixabay-calm-lofi-100.json", import.meta.url), "utf8"));
const mixkitCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/mixkit-calm-100.json", import.meta.url), "utf8"));
const audionautixCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/audionautix-calm-31.json", import.meta.url), "utf8"));
const maouDamashiiCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/maou-damashii-calm-100.json", import.meta.url), "utf8"));
const musmusCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/musmus-calm-100.json", import.meta.url), "utf8"));
const otologicCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/otologic-calm-100.json", import.meta.url), "utf8"));
const hmixGalleryHealingCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/hmix-gallery-healing-100.json", import.meta.url), "utf8"));
const perituneHealingCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/peritune-healing-100.json", import.meta.url), "utf8"));
const freebgmJpPianoAmbientCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/freebgm-jp-piano-ambient-100.json", import.meta.url), "utf8"));
const otoNoteCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/oto-note-calm-50.json", import.meta.url), "utf8"));
const zukisuzukiCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/zukisuzuki-calm-100.json", import.meta.url), "utf8"));
const roaMusicCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/roa-music-calm-100.json", import.meta.url), "utf8"));
const chillpeachLicensedCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/chillpeach-licensed-15.json", import.meta.url), "utf8"));
const khaimCalmLofiCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/khaim-calm-lofi-21.json", import.meta.url), "utf8"));
const redBearsCalmPianoCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/red-bears-calm-piano-3.json", import.meta.url), "utf8"));
const bensoundFreeCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/bensound-free-calm-55.json", import.meta.url), "utf8"));
const youtubeAudioLibraryCalmAmbientCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/youtube-audio-library-calm-ambient-100.json", import.meta.url), "utf8"));
const uppbeatFreeCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/uppbeat-free-calm-100.json", import.meta.url), "utf8"));
const teknoaxeCalmCatalog = JSON.parse(await readFile(new URL("../data/music-catalogs/teknoaxe-calm-100.json", import.meta.url), "utf8"));
const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
const errors = [];
const validateDavinci = new Ajv2020({ allErrors: true, strict: true }).compile(davinciSchema);
const validateRegions = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(regionsSchema);
const validateYoutubeCreators = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(youtubeCreatorsSchema);
const validateYoutubeMusic = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(youtubeMusicSchema);
new Ajv2020({ allErrors: true, strict: true, formats: { "date-time": true } }).compile(fieldCheckExportSchema);

if (!validate(catalog)) {
  errors.push(...(validate.errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`));
}
if (!validateDavinci(davinciWorkflow)) {
  errors.push(...(validateDavinci.errors ?? []).map((error) => `davinci${error.instancePath || "/"} ${error.message}`));
}
if (new Set(davinciWorkflow.gradePresets.map((preset) => preset.id)).size !== davinciWorkflow.gradePresets.length) errors.push("davinci: duplicate grade preset id");
if (new Set(davinciWorkflow.beginnerTutorial.map((tutorial) => tutorial.id)).size !== davinciWorkflow.beginnerTutorial.length) errors.push("davinci: duplicate tutorial id");
for (const presetId of ["daylight-natural", "sunset-warm", "night-hdr-base", "blue-hour-clean", "cinematic-road"]) {
  if (!davinciWorkflow.gradePresets.some((preset) => preset.id === presetId)) errors.push(`davinci: missing default grade preset ${presetId}`);
}
if (!validateRegions(regions)) {
  errors.push(...(validateRegions.errors ?? []).map((error) => `regions${error.instancePath || "/"} ${error.message}`));
}
if (!validateYoutubeCreators(youtubeCreators)) {
  errors.push(...(validateYoutubeCreators.errors ?? []).map((error) => `youtubeCreators${error.instancePath || "/"} ${error.message}`));
}
if (!validateYoutubeMusic(youtubeMusic)) {
  errors.push(...(validateYoutubeMusic.errors ?? []).map((error) => `youtubeMusic${error.instancePath || "/"} ${error.message}`));
}
if (new Set(davinciWorkflow.stages.map((stage) => stage.id)).size !== davinciWorkflow.stages.length) errors.push("davinci: duplicate stage id");
if (new Set(youtubeCreators.creators.map((creator) => creator.id)).size !== youtubeCreators.creators.length) errors.push("youtubeCreators: duplicate creator id");
const musicCategoryIds = new Set(youtubeMusic.categories.map((category) => category.id));
if (musicCategoryIds.size !== youtubeMusic.categories.length) errors.push("youtubeMusic: duplicate category id");
if (new Set(youtubeMusic.platforms.map((platform) => platform.id)).size !== youtubeMusic.platforms.length) errors.push("youtubeMusic: duplicate platform id");
for (const platform of youtubeMusic.platforms) {
  for (const id of platform.supportedCategoryIds) if (!musicCategoryIds.has(id)) errors.push(`youtubeMusic: ${platform.id} references unknown category ${id}`);
  const supportsYoutube = platform.evidence.some((source) => source.supports.includes("youtube-use"));
  const supportsContentId = platform.evidence.some((source) => source.supports.includes("content-id"));
  if (!supportsYoutube) errors.push(`youtubeMusic: ${platform.id} has no official YouTube-use evidence`);
  if (platform.license.contentId !== "track-dependent" && !supportsContentId) errors.push(`youtubeMusic: ${platform.id} has no Content ID evidence`);
}
const musicPlatformIds = new Set(youtubeMusic.platforms.map((platform) => platform.id));
if (new Set(youtubeMusic.albums.map((album) => album.id)).size !== youtubeMusic.albums.length) errors.push("youtubeMusic: duplicate album id");
for (const album of youtubeMusic.albums) {
  if (!musicPlatformIds.has(album.platformId)) errors.push(`youtubeMusic: ${album.id} references unknown platform ${album.platformId}`);
  for (const id of album.categoryIds) if (!musicCategoryIds.has(id)) errors.push(`youtubeMusic: ${album.id} references unknown category ${id}`);
}
if (new Set(youtubeMusic.tracks.map((track) => track.id)).size !== youtubeMusic.tracks.length) errors.push("youtubeMusic: duplicate track id");
for (const track of youtubeMusic.tracks) {
  if (!musicPlatformIds.has(track.platformId)) errors.push(`youtubeMusic: ${track.id} references unknown platform ${track.platformId}`);
  for (const id of track.categoryIds) if (!musicCategoryIds.has(id)) errors.push(`youtubeMusic: ${track.id} references unknown category ${id}`);
}
const compactCatalogTracks = streambeatsLofiCatalog.albums.flatMap((album) => album.tracks.map(([title, duration]) => ({ albumId: album.id, title, duration })));
if (streambeatsLofiCatalog.platformId !== "streambeats") errors.push("streambeatsCatalog: unexpected platform id");
if (compactCatalogTracks.length !== 100) errors.push(`streambeatsCatalog: expected 100 tracks, found ${compactCatalogTracks.length}`);
if (new Set(compactCatalogTracks.map((track) => `${track.albumId}:${track.title}`)).size !== compactCatalogTracks.length) errors.push("streambeatsCatalog: duplicate album track");
for (const track of compactCatalogTracks) {
  if (typeof track.title !== "string" || track.title.length < 2) errors.push(`streambeatsCatalog: invalid title in ${track.albumId}`);
  if (!Number.isInteger(track.duration) || track.duration <= 0) errors.push(`streambeatsCatalog: invalid duration for ${track.title}`);
}
for (const id of streambeatsLofiCatalog.categoryIds) if (!musicCategoryIds.has(id)) errors.push(`streambeatsCatalog: unknown category ${id}`);
if (scottBuckleyCatalog.platformId !== "scott-buckley") errors.push("scottBuckleyCatalog: unexpected platform id");
if (scottBuckleyCatalog.items.length !== 100) errors.push(`scottBuckleyCatalog: expected 100 tracks, found ${scottBuckleyCatalog.items.length}`);
if (new Set(scottBuckleyCatalog.items.map(([title]) => title)).size !== scottBuckleyCatalog.items.length) errors.push("scottBuckleyCatalog: duplicate track title");
for (const [title, url, kind] of scottBuckleyCatalog.items) {
  if (typeof title !== "string" || title.length < 2) errors.push("scottBuckleyCatalog: invalid title");
  if (!/^https:\/\/www\.scottbuckley\.com\.au\/library\/.+\/$/.test(url)) errors.push(`scottBuckleyCatalog: invalid official URL for ${title}`);
  if (!["piano", "ambient", "jazz"].includes(kind)) errors.push(`scottBuckleyCatalog: invalid type for ${title}`);
}
if (incompetechCatalog.platformId !== "incompetech") errors.push("incompetechCatalog: unexpected platform id");
if (incompetechCatalog.items.length !== 100) errors.push(`incompetechCatalog: expected 100 tracks, found ${incompetechCatalog.items.length}`);
if (new Set(incompetechCatalog.items.map(([, isrc]) => isrc)).size !== incompetechCatalog.items.length) errors.push("incompetechCatalog: duplicate ISRC");
for (const [title, isrc, duration, kind, feel, instruments, bpm] of incompetechCatalog.items) {
  if (typeof title !== "string" || title.length < 2) errors.push("incompetechCatalog: invalid title");
  if (!/^USUAN\d{7}$/.test(isrc)) errors.push(`incompetechCatalog: invalid ISRC for ${title}`);
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`incompetechCatalog: invalid duration for ${title}`);
  if (!["piano", "ambient", "jazz"].includes(kind)) errors.push(`incompetechCatalog: invalid type for ${title}`);
  if (!/(Calm|Calming|Relaxed)/.test(feel)) errors.push(`incompetechCatalog: missing target feel for ${title}`);
  if (/(Action|Aggressive|Driving|Epic|Intense|Dark|Eerie|Unnerving)/.test(feel)) errors.push(`incompetechCatalog: excluded feel for ${title}`);
  if (typeof instruments !== "string" || instruments.length < 2) errors.push(`incompetechCatalog: missing instruments for ${title}`);
  if (!Number.isInteger(bpm) || bpm < 0 || bpm > 100) errors.push(`incompetechCatalog: invalid BPM for ${title}`);
}
if (dovaLoopableCatalog.platformId !== "dova-syndrome") errors.push("dovaLoopableCatalog: unexpected platform id");
if (dovaLoopableCatalog.items.length !== 100) errors.push(`dovaLoopableCatalog: expected 100 tracks, found ${dovaLoopableCatalog.items.length}`);
if (new Set(dovaLoopableCatalog.items.map(([, detailId]) => detailId)).size !== dovaLoopableCatalog.items.length) errors.push("dovaLoopableCatalog: duplicate detail id");
for (const [title, detailId, artist, kind, tags, description] of dovaLoopableCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("dovaLoopableCatalog: invalid title");
  if (!Number.isInteger(detailId) || detailId <= 0) errors.push(`dovaLoopableCatalog: invalid detail id for ${title}`);
  if (typeof artist !== "string" || artist.length < 1) errors.push(`dovaLoopableCatalog: missing artist for ${title}`);
  if (!["piano", "ambient", "lofi", "jazz"].includes(kind)) errors.push(`dovaLoopableCatalog: invalid type for ${title}`);
  for (const requiredTag of ["温かい", "穏やか", "優しい"]) if (!tags.includes(requiredTag)) errors.push(`dovaLoopableCatalog: missing ${requiredTag} for ${title}`);
  if (/騒々しい|力強い|激しい|緊張感|恐怖|怒り|戦闘/.test(`${tags} ${description}`)) errors.push(`dovaLoopableCatalog: excluded intensity for ${title}`);
}
if (amachaGentleCatalog.platformId !== "amacha-music") errors.push("amachaGentleCatalog: unexpected platform id");
if (amachaGentleCatalog.items.length !== 100) errors.push(`amachaGentleCatalog: expected 100 tracks, found ${amachaGentleCatalog.items.length}`);
if (new Set(amachaGentleCatalog.items.map(([, pagePath]) => pagePath)).size !== amachaGentleCatalog.items.length) errors.push("amachaGentleCatalog: duplicate download page");
for (const [title, pagePath, mp3Path, duration, image, genre, kind] of amachaGentleCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("amachaGentleCatalog: invalid title");
  if (!/^music_[a-z0-9_]+\.html$/.test(pagePath)) errors.push(`amachaGentleCatalog: invalid official page for ${title}`);
  if (!/^mp3\/[a-z0-9_]+\.mp3$/.test(mp3Path)) errors.push(`amachaGentleCatalog: invalid official MP3 for ${title}`);
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`amachaGentleCatalog: invalid duration for ${title}`);
  if (!["癒し", "ほのぼの", "しみじみ", "幻想的"].includes(image)) errors.push(`amachaGentleCatalog: invalid image class for ${title}`);
  if (["テクノ・エレクトロ", "ポップ", "オーケストラ"].includes(genre)) errors.push(`amachaGentleCatalog: excluded genre for ${title}`);
  if (!["piano", "ambient", "jazz"].includes(kind)) errors.push(`amachaGentleCatalog: invalid type for ${title}`);
}
if (bgmerCalmCatalog.platformId !== "bgmer") errors.push("bgmerCalmCatalog: unexpected platform id");
if (bgmerCalmCatalog.items.length !== 100) errors.push(`bgmerCalmCatalog: expected 100 tracks, found ${bgmerCalmCatalog.items.length}`);
if (new Set(bgmerCalmCatalog.items.map(([, pageUrl]) => pageUrl)).size !== bgmerCalmCatalog.items.length) errors.push("bgmerCalmCatalog: duplicate detail page");
if (new Set(bgmerCalmCatalog.items.map(([, , mp3Url]) => mp3Url)).size !== bgmerCalmCatalog.items.length) errors.push("bgmerCalmCatalog: duplicate MP3");
for (const [title, pageUrl, mp3Url, duration, kind, genres, moods] of bgmerCalmCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("bgmerCalmCatalog: invalid title");
  if (!/^https:\/\/bgmer\.net\/music\/.+/.test(pageUrl)) errors.push(`bgmerCalmCatalog: invalid official page for ${title}`);
  if (!/^https:\/\/bgmer\.net\/wp-content\/uploads\/.+\.mp3$/.test(mp3Url)) errors.push(`bgmerCalmCatalog: invalid official MP3 for ${title}`);
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`bgmerCalmCatalog: invalid duration for ${title}`);
  if (!["piano", "ambient", "lofi", "jazz", "acoustic"].includes(kind)) errors.push(`bgmerCalmCatalog: invalid type for ${title}`);
  if (!moods.includes("のんびり")) errors.push(`bgmerCalmCatalog: missing calm mood for ${title}`);
  if (/EDM|ロック|メタル|バトル|ピンチ|怒り|怖い|激しい|疾走|スポーツ|ホラー|不安|緊張/.test(`${genres} ${moods}`)) errors.push(`bgmerCalmCatalog: excluded intensity for ${title}`);
}
if (purrpleCatCalmCatalog.platformId !== "purrple-cat") errors.push("purrpleCatCalmCatalog: unexpected platform id");
if (purrpleCatCalmCatalog.items.length !== 100) errors.push(`purrpleCatCalmCatalog: expected 100 strictly matched tracks, found ${purrpleCatCalmCatalog.items.length}`);
if (new Set(purrpleCatCalmCatalog.items.map(([, pagePath]) => pagePath)).size !== purrpleCatCalmCatalog.items.length) errors.push("purrpleCatCalmCatalog: duplicate detail page");
if (new Set(purrpleCatCalmCatalog.items.map(([, , mp3Path]) => mp3Path)).size !== purrpleCatCalmCatalog.items.length) errors.push("purrpleCatCalmCatalog: duplicate MP3");
for (const [title, pagePath, mp3Path, duration, bpm, tags] of purrpleCatCalmCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("purrpleCatCalmCatalog: invalid title");
  if (!/^purrple-cat-[a-z0-9-]+\.html$/.test(pagePath)) errors.push(`purrpleCatCalmCatalog: invalid detail page for ${title}`);
  if (!/^\/music\/purrple-cat\/mp3\/purrple-cat-[a-z0-9-]+\.mp3$/.test(mp3Path)) errors.push(`purrpleCatCalmCatalog: invalid MP3 for ${title}`);
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`purrpleCatCalmCatalog: invalid duration for ${title}`);
  if (!Number.isInteger(bpm) || bpm <= 0) errors.push(`purrpleCatCalmCatalog: invalid BPM for ${title}`);
  if (!/calm|gentle|relaxing|smooth|dreamy|chill|downtempo|ambient/i.test(tags)) errors.push(`purrpleCatCalmCatalog: missing target tag for ${title}`);
  if (/horror|scary|aggressive|energetic|upbeat|epic|powerful|action/i.test(tags)) errors.push(`purrpleCatCalmCatalog: excluded intensity for ${title}`);
}
if (pixabayCalmLofiCatalog.platformId !== "pixabay-music") errors.push("pixabayCalmLofiCatalog: unexpected platform id");
if (pixabayCalmLofiCatalog.items.length !== 100) errors.push(`pixabayCalmLofiCatalog: expected 100 tracks, found ${pixabayCalmLofiCatalog.items.length}`);
if (new Set(pixabayCalmLofiCatalog.items.map(([, pagePath]) => pagePath)).size !== pixabayCalmLofiCatalog.items.length) errors.push("pixabayCalmLofiCatalog: duplicate page");
for (const [title, pagePath, artist, duration, genre, tags] of pixabayCalmLofiCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("pixabayCalmLofiCatalog: invalid title");
  if (!/^\/music\/[a-z0-9-]+-\d+\/$/.test(pagePath)) errors.push(`pixabayCalmLofiCatalog: invalid official page for ${title}`);
  if (typeof artist !== "string" || artist.length < 1) errors.push(`pixabayCalmLofiCatalog: missing artist for ${title}`);
  if (!Number.isInteger(duration) || duration < 60) errors.push(`pixabayCalmLofiCatalog: invalid duration for ${title}`);
  if (!/Lofi|Beats|Ambient|Instrumental|Hip Hop/i.test(genre)) errors.push(`pixabayCalmLofiCatalog: invalid genre for ${title}`);
  if (/sad|horror|scary|aggressive|energetic|intense|loud|funk|edm|action|epic|powerful/i.test(`${title} ${genre} ${tags}`)) errors.push(`pixabayCalmLofiCatalog: excluded intensity for ${title}`);
}
if (mixkitCalmCatalog.platformId !== "mixkit") errors.push("mixkitCalmCatalog: unexpected platform id");
if (mixkitCalmCatalog.items.length !== 100) errors.push(`mixkitCalmCatalog: expected 100 tracks, found ${mixkitCalmCatalog.items.length}`);
if (new Set(mixkitCalmCatalog.items.map(([, itemId]) => itemId)).size !== mixkitCalmCatalog.items.length) errors.push("mixkitCalmCatalog: duplicate item id");
for (const [title, itemId, artist, duration, previewUrl, tags] of mixkitCalmCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("mixkitCalmCatalog: invalid title");
  if (!Number.isInteger(itemId) || itemId <= 0) errors.push(`mixkitCalmCatalog: invalid item id for ${title}`);
  if (typeof artist !== "string" || artist.length < 1) errors.push(`mixkitCalmCatalog: missing artist for ${title}`);
  if (!Number.isInteger(duration) || duration < 60) errors.push(`mixkitCalmCatalog: invalid duration for ${title}`);
  if (previewUrl !== `https://assets.mixkit.co/music/${itemId}/${itemId}.mp3`) errors.push(`mixkitCalmCatalog: invalid preview URL for ${title}`);
  if (/Aggressive|Eerie|Dramatic|Mysterious|Scary|Horror|Energetic|Upbeat|Triumphant|Powerful|Action|Workout|Combat|Fight|War|Funky|EDM|Techno|Rock|Disturbing|Lively|Driving|Propulsive|Trailer|Epic|Dance|House/i.test(`${title} ${tags}`)) errors.push(`mixkitCalmCatalog: excluded intensity for ${title}`);
}
if (audionautixCalmCatalog.platformId !== "audionautix") errors.push("audionautixCalmCatalog: unexpected platform id");
if (audionautixCalmCatalog.items.length !== 31) errors.push(`audionautixCalmCatalog: expected 31 strict tracks, found ${audionautixCalmCatalog.items.length}`);
if (new Set(audionautixCalmCatalog.items.map(([, mp3Path]) => mp3Path)).size !== audionautixCalmCatalog.items.length) errors.push("audionautixCalmCatalog: duplicate MP3");
for (const [title, mp3Path, duration, genre, tempo, mood] of audionautixCalmCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("audionautixCalmCatalog: invalid title");
  if (!/^\/Music\/[A-Za-z0-9]+\.mp3$/.test(mp3Path)) errors.push(`audionautixCalmCatalog: invalid official MP3 for ${title}`);
  if (duration !== null && (!Number.isInteger(duration) || duration <= 0)) errors.push(`audionautixCalmCatalog: invalid duration for ${title}`);
  if (typeof genre !== "string" || genre.length < 2) errors.push(`audionautixCalmCatalog: invalid genre for ${title}`);
  if (!/Slow|Medium/.test(tempo)) errors.push(`audionautixCalmCatalog: invalid tempo for ${title}`);
  if (!/Calming|Relaxing|Soothing|Meditation|Meditative|Smooth|Chill/i.test(mood)) errors.push(`audionautixCalmCatalog: missing target mood for ${title}`);
  if (/Epic|Driving|Dark|Mysterious|Bouncy|Energy|Intense|Aggressive|Action|Dance|Groov|Vocal/i.test(mood)) errors.push(`audionautixCalmCatalog: excluded mood for ${title}`);
  if (/Hard Rock|Rock|Funk|Dance|House|Techno|Punk/i.test(genre)) errors.push(`audionautixCalmCatalog: excluded genre for ${title}`);
}
if (maouDamashiiCalmCatalog.platformId !== "maou-damashii") errors.push("maouDamashiiCalmCatalog: unexpected platform id");
if (maouDamashiiCalmCatalog.items.length !== 100) errors.push(`maouDamashiiCalmCatalog: expected 100 screened tracks, found ${maouDamashiiCalmCatalog.items.length}`);
if (new Set(maouDamashiiCalmCatalog.items.map(([, slug]) => slug)).size !== maouDamashiiCalmCatalog.items.length) errors.push("maouDamashiiCalmCatalog: duplicate slug");
for (const [title, slug, kind, tier, tags, summary] of maouDamashiiCalmCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("maouDamashiiCalmCatalog: invalid title");
  if (!/^bgm_(?:piano|healing|acoustic)[a-z0-9_]+$/.test(slug)) errors.push(`maouDamashiiCalmCatalog: invalid official slug for ${title}`);
  if (!["piano", "ambient", "jazz", "acoustic"].includes(kind)) errors.push(`maouDamashiiCalmCatalog: invalid type for ${title}`);
  if (!["core", "adjacent"].includes(tier)) errors.push(`maouDamashiiCalmCatalog: invalid tier for ${title}`);
  if (typeof tags !== "string" || typeof summary !== "string" || summary.length < 1) errors.push(`maouDamashiiCalmCatalog: missing official metadata for ${title}`);
  if (/戦闘|バトル|ホラー|恐怖|不気味|激しい|パーティー|ファンキー|ロック|サイバー|EDM|ダンス|疾走|クライマックス|絶望|怒り|スポーツ|決戦|対決/.test(`${title} ${tags} ${summary}`)) errors.push(`maouDamashiiCalmCatalog: excluded intensity for ${title}`);
}
if (musmusCalmCatalog.platformId !== "musmus") errors.push("musmusCalmCatalog: unexpected platform id");
if (musmusCalmCatalog.items.length !== 100) errors.push(`musmusCalmCatalog: expected 100 layered tracks, found ${musmusCalmCatalog.items.length}`);
if (new Set(musmusCalmCatalog.items.map(([, musicId]) => musicId)).size !== musmusCalmCatalog.items.length) errors.push("musmusCalmCatalog: duplicate music id");
for (const [title, musicId, pagePath, duration, kind, genre, instruments, tags, summary, youtubeUrl, rawTier] of musmusCalmCatalog.items) {
  const tier = rawTier ?? "core";
  if (typeof title !== "string" || title.length < 1) errors.push("musmusCalmCatalog: invalid title");
  if (!/^BGM-\d{3}$/.test(musicId)) errors.push(`musmusCalmCatalog: invalid official id for ${title}`);
  if (!/^bgm(?:_\d{2})?\.html$/.test(pagePath)) errors.push(`musmusCalmCatalog: invalid official page for ${title}`);
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`musmusCalmCatalog: invalid duration for ${title}`);
  if (!["piano", "ambient", "lofi", "jazz", "acoustic"].includes(kind)) errors.push(`musmusCalmCatalog: invalid type for ${title}`);
  if (!["core", "adjacent"].includes(tier)) errors.push(`musmusCalmCatalog: invalid tier for ${title}`);
  if (typeof genre !== "string" || typeof instruments !== "string" || typeof tags !== "string" || typeof summary !== "string") errors.push(`musmusCalmCatalog: missing metadata for ${title}`);
  if (youtubeUrl && !/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]+$/.test(youtubeUrl)) errors.push(`musmusCalmCatalog: invalid YouTube URL for ${title}`);
  const metadata = `${title} ${genre} ${instruments} ${tags} ${summary}`;
  if (tier === "core" && /元気|アップテンポ|激しい|戦闘|バトル|ロック|メタル|EDM|テクノ|トランス|ダンス|ファンク|ファンキー|疾走|緊迫|恐怖|ホラー|不気味|ダーク|怒り|スポーツ|アクション|コミカル|賑やか|騒がしい|力強い|壮大|荘厳|ボーカル|ラップ|怪しい|企み|儀式|雄大|フェスティバル|パーティー/.test(metadata)) errors.push(`musmusCalmCatalog: excluded core intensity for ${title}`);
  if (/激しい|アップテンポ|戦闘|バトル|疾走|力強い|ロック|メタル|EDM|恐怖|ホラー|不気味|儀式|祭り|コミカル|ファンク|騒がしい|うるさい|ハイテンポ|ダンス|攻撃|昂揚|ボーカル/.test(metadata)) errors.push(`musmusCalmCatalog: excluded hard intensity for ${title}`);
}
if (otologicCalmCatalog.platformId !== "otologic") errors.push("otologicCalmCatalog: unexpected platform id");
if (otologicCalmCatalog.items.length !== 100) errors.push(`otologicCalmCatalog: expected 100 screened audio variants, found ${otologicCalmCatalog.items.length}`);
if (new Set(otologicCalmCatalog.items.map(([, , previewUrl]) => previewUrl)).size !== otologicCalmCatalog.items.length) errors.push("otologicCalmCatalog: duplicate preview MP3");
for (const [title, pagePath, previewUrl, downloadUrl, kind, tier, keywords, instruments, genre, bpm, summary] of otologicCalmCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("otologicCalmCatalog: invalid title");
  if (!/^[a-z0-9_-]+\.html$/.test(pagePath)) errors.push(`otologicCalmCatalog: invalid official page for ${title}`);
  if (!/^https:\/\/otologic\.jp\/sounds\/bgm\/pre\/.+\.mp3$/.test(previewUrl)) errors.push(`otologicCalmCatalog: invalid preview MP3 for ${title}`);
  if (!/^https:\/\/otologic\.jp\/sounds\/bgm\/mp3-zip\/.+-mp3\.zip$/.test(downloadUrl)) errors.push(`otologicCalmCatalog: invalid download ZIP for ${title}`);
  if (!["piano", "ambient", "jazz"].includes(kind)) errors.push(`otologicCalmCatalog: invalid type for ${title}`);
  if (!["core", "adjacent"].includes(tier)) errors.push(`otologicCalmCatalog: invalid tier for ${title}`);
  if (typeof keywords !== "string" || keywords.length < 1 || typeof instruments !== "string" || instruments.length < 1 || typeof genre !== "string" || typeof bpm !== "string" || typeof summary !== "string") errors.push(`otologicCalmCatalog: missing official metadata for ${title}`);
  if (!/優しい|穏やか|温かい|リラックス|まったり|しっとり|ゆったり|のんびり|切ない|感動|睡眠|夜|静か|淡々|気だるい|爽やか|癒し|バラード|ラウンジ|バー|スロー|哀愁|感傷的|ノスタルジック|クラシック|優雅|優美|シンプル/.test(`${title} ${keywords} ${genre} ${summary}`)) errors.push(`otologicCalmCatalog: missing target profile for ${title}`);
  if (/激しい|アップテンポ|ハイテンポ|コミカル|ひょうきん|壮大|不穏|緊張|恐怖|ホラー|ロック|EDM|テクノ|ダンス|ファンク|戦闘|バトル|疾走|力強い|パニック|派手|賑やか|元気|ラグタイム|行進|誕生日|クリスマス|お正月|ひな祭り|パーティー|運動会/.test(`${title} ${keywords} ${genre} ${summary}`)) errors.push(`otologicCalmCatalog: excluded intensity for ${title}`);
}
if (hmixGalleryHealingCatalog.platformId !== "hmix-gallery") errors.push("hmixGalleryHealingCatalog: unexpected platform id");
if (hmixGalleryHealingCatalog.items.length !== 100) errors.push(`hmixGalleryHealingCatalog: expected 100 screened tracks, found ${hmixGalleryHealingCatalog.items.length}`);
if (new Set(hmixGalleryHealingCatalog.items.map(([title]) => title)).size !== hmixGalleryHealingCatalog.items.length) errors.push("hmixGalleryHealingCatalog: duplicate title");
for (const [title, duration, kind, tier] of hmixGalleryHealingCatalog.items) {
  if (typeof title !== "string" || title.length < 1) errors.push("hmixGalleryHealingCatalog: invalid title");
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`hmixGalleryHealingCatalog: invalid duration for ${title}`);
  if (!["piano", "ambient", "acoustic"].includes(kind)) errors.push(`hmixGalleryHealingCatalog: invalid type for ${title}`);
  if (!["core", "adjacent"].includes(tier)) errors.push(`hmixGalleryHealingCatalog: invalid tier for ${title}`);
  if (/戦闘|バトル|死刑|祭り|カーニバル|行進曲|繁華街|奮闘|ボス猫|黒い影|Celebration|Frenzy|March|Festival|Carnival|Bazaar/.test(title)) errors.push(`hmixGalleryHealingCatalog: excluded intensity for ${title}`);
}
if (perituneHealingCatalog.platformId !== "peritune") errors.push("perituneHealingCatalog: unexpected platform id");
if (perituneHealingCatalog.items.length !== 100) errors.push(`perituneHealingCatalog: expected 100 verified entries, found ${perituneHealingCatalog.items.length}`);
if (new Set(perituneHealingCatalog.items.map(([title]) => title)).size !== perituneHealingCatalog.items.length) errors.push("perituneHealingCatalog: duplicate title/version");
for (const [title, pageUrl, bpm, kind, nativeLoop, tags] of perituneHealingCatalog.items) {
  if (!/^https:\/\/peritune\.com\/blog\/.+\/$/.test(pageUrl)) errors.push(`perituneHealingCatalog: invalid official page for ${title}`);
  if (!Number.isInteger(bpm) || bpm < 0 || bpm > 145) errors.push(`perituneHealingCatalog: invalid BPM for ${title}`);
  if (!["piano", "ambient", "acoustic"].includes(kind)) errors.push(`perituneHealingCatalog: invalid type for ${title}`);
  if (typeof nativeLoop !== "boolean" || typeof tags !== "string" || !/healing/i.test(tags)) errors.push(`perituneHealingCatalog: missing profile metadata for ${title}`);
  if (/battle|combat|energetic|intense|loud|funk|edm|horror|scary/i.test(`${title} ${tags}`)) errors.push(`perituneHealingCatalog: excluded intensity for ${title}`);
}
if (freebgmJpPianoAmbientCatalog.platformId !== "freebgm-jp") errors.push("freebgmJpPianoAmbientCatalog: unexpected platform id");
if (freebgmJpPianoAmbientCatalog.items.length !== 100) errors.push(`freebgmJpPianoAmbientCatalog: expected 100 free entries, found ${freebgmJpPianoAmbientCatalog.items.length}`);
if (freebgmJpPianoAmbientCatalog.collectionUrl !== "https://www.freebgm.jp/store/album.php?id=piano-ambient-deep-healing-loneliness") errors.push("freebgmJpPianoAmbientCatalog: unexpected collection URL");
if (new Set(freebgmJpPianoAmbientCatalog.items.map(([, sourceOrder]) => sourceOrder)).size !== 100) errors.push("freebgmJpPianoAmbientCatalog: duplicate source order");
for (const [title, sourceOrder] of freebgmJpPianoAmbientCatalog.items) {
  if (typeof title !== "string" || title.length < 2) errors.push("freebgmJpPianoAmbientCatalog: invalid title");
  if (!Number.isInteger(sourceOrder) || sourceOrder < 1 || sourceOrder > 100) errors.push(`freebgmJpPianoAmbientCatalog: invalid source order for ${title}`);
}
if (otoNoteCalmCatalog.platformId !== "oto-note") errors.push("otoNoteCalmCatalog: unexpected platform id");
if (otoNoteCalmCatalog.items.length !== 50) errors.push(`otoNoteCalmCatalog: expected 50 safely screened entries, found ${otoNoteCalmCatalog.items.length}`);
if (new Set(otoNoteCalmCatalog.items.map(([sourceNumber]) => sourceNumber)).size !== 50) errors.push("otoNoteCalmCatalog: duplicate source number");
for (const [sourceNumber, title, kind, tier, fit, audioUrl, youtubeUrl] of otoNoteCalmCatalog.items) {
  if (!Number.isInteger(sourceNumber) || sourceNumber < 1 || sourceNumber > 158) errors.push(`otoNoteCalmCatalog: invalid source number for ${title}`);
  if (typeof title !== "string" || title.length < 1) errors.push("otoNoteCalmCatalog: invalid title");
  if (!["piano", "ambient", "lofi", "jazz", "acoustic"].includes(kind)) errors.push(`otoNoteCalmCatalog: invalid type for ${title}`);
  if (!["core", "adjacent"].includes(tier)) errors.push(`otoNoteCalmCatalog: invalid tier for ${title}`);
  if (typeof fit !== "string" || fit.length < 4) errors.push(`otoNoteCalmCatalog: missing fit description for ${title}`);
  if (!/^https:\/\/oto-note\.net\/wp\/wp-content\/uploads\/.+\.mp3$/.test(audioUrl)) errors.push(`otoNoteCalmCatalog: invalid official MP3 for ${title}`);
  if (youtubeUrl && !/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]+$/.test(youtubeUrl)) errors.push(`otoNoteCalmCatalog: invalid YouTube URL for ${title}`);
}
if (zukisuzukiCalmCatalog.platformId !== "zukisuzuki-bgm") errors.push("zukisuzukiCalmCatalog: unexpected platform id");
if (zukisuzukiCalmCatalog.items.length !== 100) errors.push(`zukisuzukiCalmCatalog: expected 100 verified archive tracks, found ${zukisuzukiCalmCatalog.items.length}`);
if (new Set(zukisuzukiCalmCatalog.items.map(([, slug]) => slug)).size !== 100) errors.push("zukisuzukiCalmCatalog: duplicate official slug");
for (const [title, slug, mood] of zukisuzukiCalmCatalog.items) {
  if (typeof title !== "string" || title.length < 2) errors.push("zukisuzukiCalmCatalog: invalid title");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`zukisuzukiCalmCatalog: invalid official slug for ${title}`);
  if (typeof mood !== "string" || mood.length < 4) errors.push(`zukisuzukiCalmCatalog: missing mood for ${title}`);
  if (/戦闘|激しい|緊迫|アップテンポ|EDM|パーティー/.test(mood)) errors.push(`zukisuzukiCalmCatalog: excluded intensity for ${title}`);
}
if (roaMusicCalmCatalog.platformId !== "roa-music") errors.push("roaMusicCalmCatalog: unexpected platform id");
if (roaMusicCalmCatalog.items.length !== 100) errors.push(`roaMusicCalmCatalog: expected 100 verified tracks, found ${roaMusicCalmCatalog.items.length}`);
if (new Set(roaMusicCalmCatalog.items.map(([videoId]) => videoId)).size !== 100) errors.push("roaMusicCalmCatalog: duplicate official video id");
for (const [videoId, title, duration, kind, tier, summary, downloadUrl] of roaMusicCalmCatalog.items) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) errors.push(`roaMusicCalmCatalog: invalid YouTube id for ${title}`);
  if (typeof title !== "string" || title.length < 2) errors.push("roaMusicCalmCatalog: invalid title");
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`roaMusicCalmCatalog: invalid duration for ${title}`);
  if (!["piano", "ambient", "lofi", "acoustic"].includes(kind)) errors.push(`roaMusicCalmCatalog: invalid type for ${title}`);
  if (!["core", "adjacent"].includes(tier)) errors.push(`roaMusicCalmCatalog: invalid tier for ${title}`);
  if (typeof summary !== "string" || summary.length < 4) errors.push(`roaMusicCalmCatalog: missing official summary for ${title}`);
  if (!/^https:\/\/(?:hypeddit\.com|streamlink\.to)\/.+/.test(downloadUrl)) errors.push(`roaMusicCalmCatalog: invalid official download page for ${title}`);
  if (/\b(?:EDM|energetic|intense|loud|funk|strong drums)\b/i.test(summary)) errors.push(`roaMusicCalmCatalog: excluded intensity for ${title}`);
}
if (chillpeachLicensedCatalog.platformId !== "chillpeach") errors.push("chillpeachLicensedCatalog: unexpected platform id");
if (chillpeachLicensedCatalog.items.length !== 15) errors.push(`chillpeachLicensedCatalog: expected 15 explicitly licensed tracks, found ${chillpeachLicensedCatalog.items.length}`);
if (new Set(chillpeachLicensedCatalog.items.map(([videoId]) => videoId)).size !== 15) errors.push("chillpeachLicensedCatalog: duplicate official video id");
for (const [videoId, title, duration, downloadUrl] of chillpeachLicensedCatalog.items) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) errors.push(`chillpeachLicensedCatalog: invalid YouTube id for ${title}`);
  if (typeof title !== "string" || title.length < 2) errors.push("chillpeachLicensedCatalog: invalid title");
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`chillpeachLicensedCatalog: invalid duration for ${title}`);
  if (!/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view\?/.test(downloadUrl)) errors.push(`chillpeachLicensedCatalog: invalid official download link for ${title}`);
}

if (khaimCalmLofiCatalog.platformId !== "khaim") errors.push("khaimCalmLofiCatalog: unexpected platform id");
if (khaimCalmLofiCatalog.items.length !== 30) errors.push(`khaimCalmLofiCatalog: expected 30 strict tracks, found ${khaimCalmLofiCatalog.items.length}`);
if (new Set(khaimCalmLofiCatalog.items.map(([videoId]) => videoId)).size !== 30) errors.push("khaimCalmLofiCatalog: duplicate official video id");
for (const [videoId, title, duration, kind, summary] of khaimCalmLofiCatalog.items) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) errors.push(`khaimCalmLofiCatalog: invalid YouTube id for ${title}`);
  if (typeof title !== "string" || title.length < 2) errors.push("khaimCalmLofiCatalog: invalid title");
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`khaimCalmLofiCatalog: invalid duration for ${title}`);
  if (!["lofi", "jazz", "ambient", "acoustic"].includes(kind)) errors.push(`khaimCalmLofiCatalog: invalid kind for ${title}`);
  if (typeof summary !== "string" || summary.length < 8) errors.push(`khaimCalmLofiCatalog: missing summary for ${title}`);
}

if (redBearsCalmPianoCatalog.platformId !== "red-bears") errors.push("redBearsCalmPianoCatalog: unexpected platform id");
if (redBearsCalmPianoCatalog.items.length !== 3) errors.push(`redBearsCalmPianoCatalog: expected 3 strict tracks, found ${redBearsCalmPianoCatalog.items.length}`);
if (new Set(redBearsCalmPianoCatalog.items.map(([title]) => title)).size !== 3) errors.push("redBearsCalmPianoCatalog: duplicate title");
if (redBearsCalmPianoCatalog.pageUrl !== "https://www.nakano-sound.com/free/piano.html") errors.push("redBearsCalmPianoCatalog: must use official category page instead of prohibited direct links");
for (const [title, duration, summary] of redBearsCalmPianoCatalog.items) {
  if (typeof title !== "string" || title.length < 2) errors.push("redBearsCalmPianoCatalog: invalid title");
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`redBearsCalmPianoCatalog: invalid duration for ${title}`);
  if (!/LUFS/.test(summary)) errors.push(`redBearsCalmPianoCatalog: missing audio screening evidence for ${title}`);
}

if (bensoundFreeCalmCatalog.platformId !== "bensound-free") errors.push("bensoundFreeCalmCatalog: unexpected platform id");
if (bensoundFreeCalmCatalog.items.length !== 55) errors.push(`bensoundFreeCalmCatalog: expected 55 strict/adjacent tracks, found ${bensoundFreeCalmCatalog.items.length}`);
if (new Set(bensoundFreeCalmCatalog.items.map(([productId]) => productId)).size !== 55) errors.push("bensoundFreeCalmCatalog: duplicate official product id");
for (const [productId, title, artist, duration, kind, tier, summary, previewUrl, productUrl] of bensoundFreeCalmCatalog.items) {
  if (!Number.isInteger(productId) || productId <= 0) errors.push(`bensoundFreeCalmCatalog: invalid product id for ${title}`);
  if (typeof title !== "string" || title.length < 2 || typeof artist !== "string" || artist.length < 2) errors.push("bensoundFreeCalmCatalog: invalid title or artist");
  if (!Number.isInteger(duration) || duration <= 0) errors.push(`bensoundFreeCalmCatalog: invalid duration for ${title}`);
  if (!["piano", "ambient", "lofi", "jazz", "acoustic"].includes(kind)) errors.push(`bensoundFreeCalmCatalog: invalid kind for ${title}`);
  if (!["core", "adjacent"].includes(tier)) errors.push(`bensoundFreeCalmCatalog: invalid tier for ${title}`);
  if (typeof summary !== "string" || summary.length < 12) errors.push(`bensoundFreeCalmCatalog: missing official summary for ${title}`);
  if (!/^https:\/\/cdn2\.bensound\.com\/bensound-[a-z0-9-]+\.mp3$/.test(previewUrl)) errors.push(`bensoundFreeCalmCatalog: invalid official preview for ${title}`);
  if (!/^https:\/\/www\.bensound\.com\/royalty-free-music\/track\/[a-z0-9-]+$/.test(productUrl)) errors.push(`bensoundFreeCalmCatalog: invalid official track page for ${title}`);
}

if (youtubeAudioLibraryCalmAmbientCatalog.length !== 100) errors.push(`youtubeAudioLibraryCalmAmbientCatalog: expected 100 tracks, found ${youtubeAudioLibraryCalmAmbientCatalog.length}`);
if (new Set(youtubeAudioLibraryCalmAmbientCatalog.map(({ title, artist }) => `${title}\u0000${artist}`)).size !== 100) errors.push("youtubeAudioLibraryCalmAmbientCatalog: duplicate title/artist pair");
for (const track of youtubeAudioLibraryCalmAmbientCatalog) {
  if (typeof track.title !== "string" || track.title.length < 1 || typeof track.artist !== "string" || track.artist.length < 1) errors.push("youtubeAudioLibraryCalmAmbientCatalog: invalid title or artist");
  if (track.genre !== "氛围音乐" || track.mood !== "平静") errors.push(`youtubeAudioLibraryCalmAmbientCatalog: non-calm ambient track ${track.title}`);
  if (track.artistUrl !== "" && !/^https:\/\/www\.youtube\.com\/channel\/[A-Za-z0-9_-]+\/$/.test(track.artistUrl)) errors.push(`youtubeAudioLibraryCalmAmbientCatalog: invalid artist channel for ${track.title}`);
  if (!/^\d+:\d{2}$/.test(track.duration)) errors.push(`youtubeAudioLibraryCalmAmbientCatalog: invalid duration for ${track.title}`);
  if (!/创收/.test(track.license) || !/无需署名/.test(track.license)) errors.push(`youtubeAudioLibraryCalmAmbientCatalog: license not verified for ${track.title}`);
  if (!/^\d{4}年\d{1,2}月$/.test(track.added)) errors.push(`youtubeAudioLibraryCalmAmbientCatalog: invalid added date for ${track.title}`);
}
if (uppbeatFreeCalmCatalog.length !== 100) errors.push(`uppbeatFreeCalmCatalog: expected 100 tracks, found ${uppbeatFreeCalmCatalog.length}`);
if (new Set(uppbeatFreeCalmCatalog.map(({ trackId }) => trackId)).size !== 100) errors.push("uppbeatFreeCalmCatalog: duplicate official track id");
for (const track of uppbeatFreeCalmCatalog) {
  if (!/^\d+$/.test(track.trackId)) errors.push(`uppbeatFreeCalmCatalog: invalid track id for ${track.title}`);
  if (typeof track.title !== "string" || track.title.length < 2 || typeof track.artist !== "string" || track.artist.length < 2) errors.push("uppbeatFreeCalmCatalog: invalid title or artist");
  if (!Number.isInteger(track.duration) || track.duration <= 0) errors.push(`uppbeatFreeCalmCatalog: invalid duration for ${track.title}`);
  if (!Number.isInteger(track.tempo) || track.tempo < 0 || track.tempo > 110) errors.push(`uppbeatFreeCalmCatalog: invalid calm tempo for ${track.title}`);
  if (!["Calm", "Very Calm"].includes(track.energy)) errors.push(`uppbeatFreeCalmCatalog: invalid energy for ${track.title}`);
  if (!["piano", "ambient", "lofi", "jazz", "acoustic"].includes(track.kind)) errors.push(`uppbeatFreeCalmCatalog: invalid kind for ${track.title}`);
  if (!/^https:\/\/cdn\.uppbeat\.io\/audio-files\/.+\.mp3$/.test(track.previewUrl)) errors.push(`uppbeatFreeCalmCatalog: invalid official preview for ${track.title}`);
  if (!Array.isArray(track.featuredTags) || track.featuredTags.some((tag) => typeof tag?.name !== "string" || typeof tag?.slug !== "string")) errors.push(`uppbeatFreeCalmCatalog: invalid featured tags for ${track.title}`);
  const tags = [...track.genres, ...track.moods, ...track.featuredTags.map(({ name }) => name)].join(" ");
  if (/\b(?:EDM|funk|energetic|intense|loud|aggressive|metal|dubstep|drum and bass|horror|scary|suspense|action|epic|creepy|dramatic|dark|percussion)\b/i.test(tags)) errors.push(`uppbeatFreeCalmCatalog: excluded intensity for ${track.title}`);
}
if (teknoaxeCalmCatalog.platformId !== "teknoaxe") errors.push("teknoaxeCalmCatalog: unexpected platform id");
if (teknoaxeCalmCatalog.items.length !== 100) errors.push(`teknoaxeCalmCatalog: expected 100 tracks, found ${teknoaxeCalmCatalog.items.length}`);
if (new Set(teknoaxeCalmCatalog.items.map(({ id }) => id)).size !== 100) errors.push("teknoaxeCalmCatalog: duplicate official track id");
if (teknoaxeCalmCatalog.items.filter(({ kind }) => kind === "piano").length !== 57) errors.push("teknoaxeCalmCatalog: expected 57 Piano core tracks");
if (teknoaxeCalmCatalog.items.filter(({ kind }) => kind === "soft").length !== 43) errors.push("teknoaxeCalmCatalog: expected 43 Soft adjacent tracks");
for (const track of teknoaxeCalmCatalog.items) {
  if (!/^\d+$/.test(track.id)) errors.push(`teknoaxeCalmCatalog: invalid official id for ${track.title}`);
  if (typeof track.title !== "string" || track.title.trim().length < 2) errors.push("teknoaxeCalmCatalog: invalid title");
  if (!/^[A-Za-z0-9_-]{11}$/.test(track.videoId)) errors.push(`teknoaxeCalmCatalog: invalid YouTube id for ${track.title}`);
  if (!/^[^/?#]+\.mp3$/i.test(track.file)) errors.push(`teknoaxeCalmCatalog: invalid official MP3 filename for ${track.title}`);
  if ((track.genre === "Piano") !== (track.kind === "piano") || (track.genre === "Soft") !== (track.kind === "soft")) errors.push(`teknoaxeCalmCatalog: genre/kind mismatch for ${track.title}`);
  if ((track.kind === "piano" ? track.tier !== "core" : track.tier !== "adjacent")) errors.push(`teknoaxeCalmCatalog: invalid tier for ${track.title}`);
  if (/\b(?:wacky|sneaky|clown|darkness|funkland|festivities|happy go lucky|unicycle|playground|interlude of the fallen)\b/i.test(track.title)) errors.push(`teknoaxeCalmCatalog: excluded high-distraction title ${track.title}`);
}
for (const family of ["piano", "lofi", "jazz"]) if (!youtubeMusic.categories.some((category) => category.family === family)) errors.push(`youtubeMusic: missing ${family} category`);
for (const scene of ["countryside", "rain", "sunrise", "city-night", "road-driving", "blue-hour", "urban"]) if (!youtubeMusic.categories.some((category) => category.scenes.includes(scene))) errors.push(`youtubeMusic: missing scene ${scene}`);

const provinceNames = new Set(regions.provinces.map((province) => province.name));
if (provinceNames.size !== regions.provinces.length) errors.push("regions: duplicate province name");
const expectedProvinceNames = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "台湾", "香港", "澳门"];
const missingProvinces = expectedProvinceNames.filter((name) => !provinceNames.has(name));
const unexpectedProvinces = [...provinceNames].filter((name) => !expectedProvinceNames.includes(name));
if (missingProvinces.length) errors.push(`regions: missing province-level units ${missingProvinces.join(", ")}`);
if (unexpectedProvinces.length) errors.push(`regions: unexpected province-level units ${unexpectedProvinces.join(", ")}`);
for (const province of regions.provinces) {
  const divisionNames = new Set(province.divisions.map((division) => division.name));
  if (divisionNames.size !== province.divisions.length) errors.push(`regions: ${province.name} has duplicate division name`);
}

function assertUnique(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) errors.push(`${label}: duplicate id ${item.id}`);
    seen.add(item.id);
  }
  return seen;
}

const locationIds = assertUnique(catalog.locations, "locations");
const presetIds = assertUnique(catalog.cameraPresets, "cameraPresets");
const routeIds = assertUnique(catalog.routes, "routes");
assertUnique(catalog.shootPlans, "shootPlans");

for (const location of catalog.locations) {
  const province = regions.provinces.find((item) => item.name === location.province);
  if (!province) errors.push(`${location.id}: unknown province ${location.province}`);
  else if (!province.divisions.some((division) => division.name === location.city)) errors.push(`${location.id}: unknown division ${location.province}/${location.city}`);
  const expectedCrs = ["台湾", "香港", "澳门"].includes(location.province) ? "WGS84" : "GCJ-02";
  if (location.coordinate.crs !== expectedCrs) errors.push(`${location.id}: ${location.province} coordinate must use ${expectedCrs}`);
  const coordinateEvidence = location.verification.sources.some((source) => source.supports.includes("coordinate"));
  if (!coordinateEvidence) errors.push(`${location.id}: coordinate has no supporting source`);
}

const coveredProvinceNames = new Set(catalog.locations.filter((location) => location.verification.status !== "draft").map((location) => location.province));
const provincesWithoutLocations = expectedProvinceNames.filter((name) => !coveredProvinceNames.has(name));
if (provincesWithoutLocations.length) errors.push(`locations: province-level units without a source-checked location: ${provincesWithoutLocations.join(", ")}`);

for (const preset of catalog.cameraPresets) {
  const cameraScenes = new Set(["coast-sunset", "city-night-driving", "city-night-tripod", "forest-stream-static", "daylight-walk", "rain-walk", "blue-hour-walk"]);
  if (!cameraScenes.has(preset.scene)) errors.push(`${preset.id}: unknown camera scene ${preset.scene}`);
  if (!preset.settings) continue;
  if (preset.settings.iso && preset.settings.iso.min > preset.settings.iso.max) errors.push(`${preset.id}: ISO min exceeds max`);
  if (!preset.settings.resolution || !Number.isFinite(preset.settings.fps) || preset.settings.fps <= 0) errors.push(`${preset.id}: invalid resolution or fps`);
  if (!preset.settings.shutter || !Number.isFinite(preset.settings.whiteBalanceKelvin)) errors.push(`${preset.id}: missing shutter or white balance`);
  for (const control of ["sharpness", "noiseReduction"]) {
    if (preset.settings[control] !== undefined && (!Number.isInteger(preset.settings[control]) || preset.settings[control] < -2 || preset.settings[control] > 2)) errors.push(`${preset.id}: ${control} must be an integer from -2 to 2`);
  }
  if (preset.setup && preset.setup.length < 3) errors.push(`${preset.id}: setup must contain at least 3 steps`);
  if (preset.fieldChecks && preset.fieldChecks.length < 3) errors.push(`${preset.id}: fieldChecks must contain at least 3 checks`);
  if (preset.sourceUrl && !preset.sourceUrl.startsWith("https://")) errors.push(`${preset.id}: sourceUrl must use HTTPS`);
}

for (const route of catalog.routes) {
  const province = regions.provinces.find((item) => item.name === route.province);
  if (!province) errors.push(`${route.id}: unknown province ${route.province}`);
  else for (const city of route.cities) {
    if (!province.divisions.some((division) => division.name === city)) errors.push(`${route.id}: unknown division ${route.province}/${city}`);
  }
  for (const id of route.waypointLocationIds) {
    if (!locationIds.has(id)) errors.push(`${route.id}: unknown waypoint ${id}`);
    const waypoint = catalog.locations.find((location) => location.id === id);
    if (waypoint && waypoint.province !== route.province) errors.push(`${route.id}: waypoint ${id} belongs to ${waypoint.province}, not ${route.province}`);
    if (waypoint && !route.cities.includes(waypoint.city)) errors.push(`${route.id}: waypoint ${id} city ${waypoint.city} missing from route cities`);
  }
  for (const id of route.cameraPresetIds) {
    if (!presetIds.has(id)) errors.push(`${route.id}: unknown camera preset ${id}`);
  }
  if (route.executionMode === "drive-only") {
    if (route.captureStyle !== "scenic-drive") errors.push(`${route.id}: drive-only route must use scenic-drive capture style`);
    const waypoints = route.waypointLocationIds.map((id) => catalog.locations.find((location) => location.id === id)).filter(Boolean);
    if (waypoints.some((waypoint) => waypoint.access.mode !== "drive")) errors.push(`${route.id}: drive-only route contains a non-driving waypoint`);
    if (waypoints.some((waypoint) => waypoint.shooting.modes.length !== 1 || waypoint.shooting.modes[0] !== "driving-video")) errors.push(`${route.id}: drive-only waypoint must allow driving-video only`);
    if (!route.shootAdvice.includes("不停车") || !route.shootAdvice.includes("不下车")) errors.push(`${route.id}: drive-only advice must explicitly prohibit parking and leaving the vehicle`);
  }
}

const routeCoveredProvinceNames = new Set(catalog.routes.filter((route) => route.verification.status !== "draft").map((route) => route.province));
const provincesWithoutRoutes = expectedProvinceNames.filter((name) => !routeCoveredProvinceNames.has(name));
if (provincesWithoutRoutes.length) errors.push(`routes: province-level units without an explorable route: ${provincesWithoutRoutes.join(", ")}`);

for (const plan of catalog.shootPlans) {
  if (!routeIds.has(plan.routeId)) errors.push(`${plan.id}: unknown route ${plan.routeId}`);
  for (const id of plan.equipmentPresetIds) {
    if (!presetIds.has(id)) errors.push(`${plan.id}: unknown equipment preset ${id}`);
  }
}

const divisionCount = regions.provinces.reduce((total, province) => total + province.divisions.length, 0);
const routeProvinceCount = new Set(catalog.routes.map((route) => route.province)).size;
const routeCityKeys = new Set(catalog.routes.flatMap((route) => route.cities.map((city) => `${route.province}/${city}`)));
const locationCityKeys = new Set(catalog.locations.map((location) => `${location.province}/${location.city}`));
const routeCityCount = routeCityKeys.size;
const locationCityCount = locationCityKeys.size;
const minimumCoveredDivisionCount = 391;
if (locationCityCount < minimumCoveredDivisionCount) errors.push(`locations: division coverage regressed below ${minimumCoveredDivisionCount}`);
if (routeCityCount < minimumCoveredDivisionCount) errors.push(`routes: division coverage regressed below ${minimumCoveredDivisionCount}`);
for (const key of locationCityKeys) if (!routeCityKeys.has(key)) errors.push(`coverage: ${key} has locations but no route`);
for (const key of routeCityKeys) if (!locationCityKeys.has(key)) errors.push(`coverage: ${key} has routes but no location`);

if (errors.length > 0) {
  console.error(`Data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Catalog v${catalog.schemaVersion} valid: ${catalog.locations.length} locations across ${locationCityCount} divisions, ${catalog.routes.length} routes across ${routeProvinceCount} provinces and ${routeCityCount} divisions, ${catalog.cameraPresets.length} presets, ${catalog.shootPlans.length} plan; administrative directory ${regions.provinces.length} provinces and ${divisionCount} divisions; DaVinci workflow ${davinciWorkflow.stages.length} stages; YouTube research ${youtubeCreators.creators.length} creators; music library ${youtubeMusic.platforms.length} platforms and ${youtubeMusic.categories.length} directions.`);
