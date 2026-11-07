import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = { variant?: "hero" | "page" | "route" };
const SOURCE = `${import.meta.env.BASE_URL}media/evidence-ribbon-3d-foreground.mp4`;

/** Fixed proportions repeat through long pages instead of stretching one video. */
function getRibbonTiles(width: number, height: number) {
  const tileHeight = Math.max(560, Math.min(1300, width * .65));
  const overlap = 144;
  const step = tileHeight - overlap;
  return Array.from({ length: Math.max(1, Math.ceil((height + overlap / 2) / step)) }, (_, index) => ({
    top: index * step - overlap / 2,
    height: tileHeight,
    mirror: index % 2 === 1,
  }));
}

function RibbonVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (document.hidden || preference.matches) element.pause();
      else void element.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    sync();
    return () => {
      element.pause();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, []);
  return <video ref={video} src={SOURCE} muted loop playsInline preload="auto" tabIndex={-1}
    onLoadedData={() => setReady(true)} onError={() => setReady(false)}
    style={{ opacity: ready ? 1 : 0 }} />;
}

function RibbonTile({ top, height, mirror }: { top: number; height: number; mirror: boolean }) {
  const tile = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = tile.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={tile} className={`cv-ribbon-tile${mirror ? " cv-ribbon-tile-mirror" : ""}`} style={{ top, height }}>
    {near && <RibbonVideo />}
  </div>;
}

export default function LimeStream({ variant = "route" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1000, height: 800 });
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const host = document.body;
    const observer = new ResizeObserver(() => {
      const bounds = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      setSize(current => current.width === width && current.height === height ? current : { width, height });
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  if (typeof document === "undefined") return null;
  return createPortal(<div ref={root} className={`cv-ribbon-media cv-ribbon-media-${variant} cv-ribbon-full-page cv-original-ribbon`} style={{ height: size.height }} aria-hidden="true">
    {getRibbonTiles(size.width, size.height).map((tile, index) => <RibbonTile key={index} {...tile} />)}
  </div>, document.body);
}
