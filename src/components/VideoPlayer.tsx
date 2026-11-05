
import { useState } from "react";
import { Film } from "lucide-react";
import type { VideoAsset } from "../types/inference";

interface Props {
  video: VideoAsset | null;
}

export default function VideoPlayer({ video }: Props) {
  const [errorUrl, setErrorUrl] = useState<string | null>(null);

  const playbackError = Boolean(
    video && errorUrl === video.url
  );

  return (
    <div className="video-stage">
      {video ? (
        playbackError ? (
          <div className="video-empty">
            <Film size={32} strokeWidth={1.5} />
            <strong>Video playback unavailable</strong>
            <p>
              The selected file may use a codec unsupported
              by this browser. The file has not been changed.
            </p>
          </div>
        ) : (
          <video
            key={video.url}
            src={video.url}
            controls
            playsInline
            preload="metadata"
            onError={() => setErrorUrl(video.url)}
            aria-label="Selected video playback"
          />
        )
      ) : (
        <div className="video-empty">
          <Film size={34} strokeWidth={1.4} />
          <strong>No video selected</strong>
          <p>
            Upload video footage or record a scene using
            the webcam.
          </p>
        </div>
      )}
    </div>
  );
}
