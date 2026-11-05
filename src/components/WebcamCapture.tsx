
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Circle, Square, VideoOff } from "lucide-react";

interface Props {
  onCapture: (file: File) => void;
}

const MAX_SECONDS = 20;

export default function WebcamCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [active, setActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopRecording();

    streamRef.current?.getTracks().forEach(
      (track) => track.stop(),
    );

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setActive(false);
  }, [stopRecording]);

  useEffect(() => {
    if (!recording) return;

    const timer = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (recording && seconds >= MAX_SECONDS) {
      stopRecording();
    }
  }, [recording, seconds, stopRecording]);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;

      if (recorder?.state === "recording") {
        recorder.onstop = null;
        recorder.stop();
      }

      streamRef.current?.getTracks().forEach(
        (track) => track.stop(),
      );
    };
  }, []);

  async function startCamera() {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Camera access is unavailable in this browser or context.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setActive(true);
    } catch {
      streamRef.current?.getTracks().forEach(
        (track) => track.stop(),
      );
      streamRef.current = null;

      setError(
        "Camera could not be started. Check browser permission and device availability.",
      );
    }
  }

  function startRecording() {
    const stream = streamRef.current;

    if (!stream || !active) return;

    if (typeof MediaRecorder === "undefined") {
      setError("Video recording is unsupported in this browser.");
      return;
    }

    const candidates = [
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ];

    const mimeType = candidates.find(
      (type) => MediaRecorder.isTypeSupported(type),
    );

    try {
      chunksRef.current = [];
      setSeconds(0);
      setError("");

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("The recording encountered an error.");
      };

      recorder.onstop = () => {
        setRecording(false);

        const actualType =
          recorder.mimeType || mimeType || "video/webm";

        const blob = new Blob(chunksRef.current, {
          type: actualType,
        });

        if (blob.size === 0) {
          setError("No video data was recorded.");
          return;
        }

        const extension = actualType.includes("mp4")
          ? "mp4"
          : "webm";

        const file = new File(
          [blob],
          `webcam-${Date.now()}.${extension}`,
          { type: actualType },
        );

        onCapture(file);
      };

      recorder.start(1000);
      setRecording(true);
    } catch {
      setRecording(false);
      setError("Unable to begin recording with this camera.");
    }
  }

  return (
    <section className="camera-panel">
      <div className="camera-preview">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          aria-label="Live webcam preview"
        />

        {!active && (
          <div className="camera-empty">
            <Camera size={30} strokeWidth={1.4} />
            <strong>Camera is not active</strong>
            <span>
              Enable your webcam to capture a live scene.
            </span>
          </div>
        )}

        {recording && (
          <div className="record-indicator">
            <Circle size={10} fill="currentColor" />
            REC {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </div>
        )}
      </div>

      <div className="camera-controls">
        {!active ? (
          <button
            className="button button-primary"
            onClick={startCamera}
            type="button"
          >
            <Camera size={17} />
            Enable camera
          </button>
        ) : (
          <>
            {!recording ? (
              <button
                className="button button-primary"
                onClick={startRecording}
                type="button"
              >
                <Circle size={14} />
                Start recording
              </button>
            ) : (
              <button
                className="button button-primary"
                onClick={stopRecording}
                type="button"
              >
                <Square size={14} />
                Stop recording
              </button>
            )}

            <button
              className="button button-secondary"
              onClick={stopCamera}
              type="button"
            >
              <VideoOff size={17} />
              Turn off
            </button>
          </>
        )}
      </div>

      <p className="microcopy">
        Capture length: up to {MAX_SECONDS} seconds. Audio is
        disabled. Recording stays in your browser unless
        explicitly submitted to a future backend.
      </p>

      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
