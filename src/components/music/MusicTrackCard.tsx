import { Download, Music2, Play } from "lucide-react";
import type { MusicTrack } from "../../services/youtubeMusicService.js";

const formatDuration = (seconds: number | null) =>
  seconds === null
    ? "时长待核实"
    : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export function MusicTrackCard({ track, platformName, riskLabel, sceneLabels, canAdd, added, onAdd }: {
  track: MusicTrack;
  platformName: string;
  riskLabel: string;
  sceneLabels: Record<string, string>;
  canAdd: boolean;
  added: boolean;
  onAdd: () => void;
}) {
  return (
                <article className="music-track-card">
                  <div className="music-track-index">
                    <Music2 size={16} />
                  </div>
                  <div className="music-track-copy">
                    <header>
                      <div>
                        <h3>{track.title}</h3>
                        <p>
                          {track.artist} · {platformName}
                        </p>
                      </div>
                      <time>{formatDuration(track.durationSeconds)}</time>
                    </header>
                    <p>{track.description}</p>
                    <div className="music-album-scenes">
                      {track.scenes.map((item) => (
                        <span key={item}>{sceneLabels[item]}</span>
                      ))}
                    </div>
                    <details className="music-track-license">
                      <summary>署名与授权要求 · {riskLabel}</summary>
                      <aside><strong>{track.credit}</strong><p>{track.licenseNote}</p></aside>
                    </details>
                  </div>
                  <footer>
                    <button disabled={!canAdd || added} onClick={onAdd}>{added ? "已记入项目" : "记入项目"}</button>
                    <a href={track.listenUrl} target="_blank" rel="noreferrer">
                      <Play size={12} />
                      试听
                    </a>
                    <a
                      className="primary"
                      href={track.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download size={12} />
                      {track.downloadLabel}
                    </a>
                  </footer>
                </article>
  );
}
