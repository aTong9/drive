import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import type { Location, Route } from "../../types/domain.js";
import { findAmapLocationPhotos } from "../../services/amapPhotoService.js";
import { GeoThumbnail } from "./GeoThumbnail.js";
import { useDialogFocus } from "./useDialogFocus.js";

interface GeoPhotoThumbnailProps {
  id: string;
  label: string;
  type: Location["type"] | Route["type"];
  points: Array<Pick<Location, "id" | "name" | "city" | "coordinate">>;
  variant?: "card" | "location" | "hero";
  interactive?: boolean;
}

export function GeoPhotoThumbnail(props: GeoPhotoThumbnailProps) {
  const interactive = props.interactive ?? true;
  const hostRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setPhotos([]);
    setIndex(0);
    setLightboxOpen(false);
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const load = async () => {
      const batches: string[][] = [];
      for (const point of props.points.slice(0, 3)) {
        batches.push(await findAmapLocationPhotos(point));
        if (cancelled) return;
      }
      setPhotos([...new Set(batches.flat())].slice(0, 10));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void load();
      },
      { rootMargin: "180px" },
    );
    observer.observe(host);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [props.id, props.points]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft")
        setIndex((current) => (current - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight")
        setIndex((current) => (current + 1) % photos.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, photos.length]);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  useDialogFocus(lightboxOpen, lightboxRef, closeLightbox);

  const move = (direction: number, event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIndex(
      (current) => (current + direction + photos.length) % photos.length,
    );
  };
  const open = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setLightboxOpen(true);
  };
  const removeFailed = () => {
    setPhotos((current) =>
      current.filter((_, photoIndex) => photoIndex !== index),
    );
    setIndex(0);
  };

  return (
    <div className="geo-photo-host" ref={hostRef}>
      <GeoThumbnail {...props} />
      {photos[index] &&
        (interactive ? (
          <button
            className="geo-photo-button"
            onClick={open}
            aria-label={`放大查看${props.label}图片`}
          >
            <img
              className="geo-real-photo"
              src={photos[index]}
              alt={`${props.label}实景照片 ${index + 1}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={removeFailed}
            />
          </button>
        ) : (
          <img
            className="geo-real-photo"
            src={photos[index]}
            alt={`${props.label}实景照片 ${index + 1}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={removeFailed}
          />
        ))}
      {photos.length > 0 && (
        <>
          <small className="geo-photo-credit">
            地点实景 · {index + 1}/{photos.length}
          </small>
          {interactive && (
            <button
              className="geo-expand"
              aria-label={`放大查看${props.label}图片`}
              onClick={open}
            >
              <Maximize2 size={12} />
            </button>
          )}
        </>
      )}
      {interactive && photos.length > 1 && (
        <>
          <button
            className="geo-swiper-button previous"
            aria-label="上一张图片"
            onClick={(event) => move(-1, event)}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className="geo-swiper-button next"
            aria-label="下一张图片"
            onClick={(event) => move(1, event)}
          >
            <ChevronRight size={14} />
          </button>
          <span className="geo-swiper-dots" aria-hidden="true">
            {photos.map((photo, photoIndex) => (
              <i className={photoIndex === index ? "active" : ""} key={photo} />
            ))}
          </span>
        </>
      )}
      {lightboxOpen &&
        photos[index] &&
        createPortal(
          <div
            ref={lightboxRef}
            className="geo-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${props.label}实景图片查看器`}
            onMouseDown={(event) => {
              event.stopPropagation();
              if (event.target === event.currentTarget) setLightboxOpen(false);
            }}
          >
            <button
              className="geo-lightbox-close"
              onClick={closeLightbox}
              aria-label="关闭图片"
            >
              <X size={21} />
            </button>
            {photos.length > 1 && (
              <button
                className="geo-lightbox-nav previous"
                onClick={(event) => move(-1, event)}
                aria-label="上一张图片"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            <figure>
              <img
                src={photos[index]}
                alt={`${props.label}实景照片 ${index + 1}`}
                referrerPolicy="no-referrer"
              />
              <figcaption>
                <strong>{props.label}</strong>
                <span>
                  地点实景 · {index + 1} / {photos.length}
                </span>
              </figcaption>
            </figure>
            {photos.length > 1 && (
              <button
                className="geo-lightbox-nav next"
                onClick={(event) => move(1, event)}
                aria-label="下一张图片"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
