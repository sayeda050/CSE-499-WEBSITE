
import { useEffect, useRef, useState } from "react";
import { Film, Pause, Play } from "lucide-react";

const DATASET_VIDEO =
  "/media/vru-accident-showcase.mp4";

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      setPlaying(false);
    });

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video || !available) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
    }
  }

  return (
    <>
      <div
        className={`cinematic-film ${
          available ? "has-footage" : "no-footage"
        }`}
        aria-hidden="true"
      >
        <div className="cinematic-film-fallback" />

        {!failed && (
          <video
            ref={videoRef}
            src={DATASET_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onCanPlay={() => setAvailable(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setAvailable(false);
              setFailed(true);
              setPlaying(false);
            }}
          />
        )}

        <div className="cinematic-film-scrim" />
      </div>

      <div className="cinematic-film-controls">
        {available ? (
          <>
            <span className="cinematic-footage-source">
              VRU-Accident · Research footage
            </span>

            <button
              type="button"
              className="cinematic-film-button"
              onClick={togglePlayback}
              aria-label={
                playing
                  ? "Pause background video"
                  : "Play background video"
              }
              title={
                playing
                  ? "Pause background video"
                  : "Play background video"
              }
            >
              {playing ? (
                <Pause size={15} />
              ) : (
                <Play size={15} />
              )}
            </button>
          </>
        ) : (
          <span className="cinematic-footage-missing">
            <Film size={14} />
            Dataset background not installed
          </span>
        )}
      </div>
    </>
  );
}
