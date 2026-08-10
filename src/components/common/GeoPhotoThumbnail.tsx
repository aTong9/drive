import { useEffect, useRef, useState } from "react";
import type { Location, Route } from "../../types/domain.js";
import { findAmapLocationPhoto } from "../../services/amapPhotoService.js";
import { GeoThumbnail } from "./GeoThumbnail.js";

interface GeoPhotoThumbnailProps {
  id: string;
  label: string;
  type: Location["type"] | Route["type"];
  points: Location[];
  variant?: "card" | "location" | "hero";
}

export function GeoPhotoThumbnail(props: GeoPhotoThumbnailProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setPhotoUrl(null);
    setFailed(false);
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const load = async () => {
      for (const point of props.points.slice(0, 3)) {
        const url = await findAmapLocationPhoto(point);
        if (cancelled) return;
        if (url) { setPhotoUrl(url); return; }
      }
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void load();
    }, { rootMargin: "180px" });
    observer.observe(host);
    return () => { cancelled = true; observer.disconnect(); };
  }, [props.id, props.points]);

  return <div className="geo-photo-host" ref={hostRef}>
    <GeoThumbnail {...props} />
    {photoUrl && !failed && <img className="geo-real-photo" src={photoUrl} alt={`${props.label}实景照片`} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />}
    {photoUrl && !failed && <small className="geo-photo-credit">地点实景</small>}
  </div>;
}
