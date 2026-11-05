
import { CircleAlert } from "lucide-react";

export default function StatusIndicator() {
  return (
    <div className="status-notice" role="status">
      <CircleAlert size={18} />
      <span>
        Frontend-only mode. The interface is available,
        but no model inference is connected or running.
      </span>
    </div>
  );
}
