
const MAX_BYTES = 250 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [
  ".mp4",
  ".webm",
  ".mov",
  ".m4v",
];

export function validateVideo(file: File): string | null {
  if (file.size === 0) {
    return "The selected video is empty.";
  }

  if (file.size > MAX_BYTES) {
    return "The selected video exceeds the 250 MB frontend preview limit.";
  }

  const filename = file.name.toLowerCase();
  const supportedName = ACCEPTED_EXTENSIONS.some(
    (extension) => filename.endsWith(extension),
  );

  if (!file.type.startsWith("video/") && !supportedName) {
    return "Select a supported video file.";
  }

  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
