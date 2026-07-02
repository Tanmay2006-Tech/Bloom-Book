import { useEffect, useState } from "react";
import { onlineManager, useQueryClient } from "@tanstack/react-query";
import { WifiOff } from "lucide-react";

export function AppStatus() {
  const queryClient = useQueryClient();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [serviceIssue, setServiceIssue] = useState(false);

  useEffect(() => {
    const syncConnection = () => {
      const isOnline = navigator.onLine;
      setOnline(isOnline);
      onlineManager.setOnline(isOnline);
      if (isOnline) void queryClient.resumePausedMutations().then(() => queryClient.invalidateQueries());
    };
    const refreshAfterResume = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        void queryClient.invalidateQueries({ refetchType: "active" });
      }
    };
    let issueTimer = 0;
    const showServiceIssue = () => {
      setServiceIssue(true);
      window.clearTimeout(issueTimer);
      issueTimer = window.setTimeout(() => setServiceIssue(false), 8_000);
    };

    window.addEventListener("online", syncConnection);
    window.addEventListener("offline", syncConnection);
    window.addEventListener("pageshow", refreshAfterResume);
    document.addEventListener("visibilitychange", refreshAfterResume);
    window.addEventListener("bloombook:api-error", showServiceIssue);
    syncConnection();

    return () => {
      window.removeEventListener("online", syncConnection);
      window.removeEventListener("offline", syncConnection);
      window.removeEventListener("pageshow", refreshAfterResume);
      document.removeEventListener("visibilitychange", refreshAfterResume);
      window.removeEventListener("bloombook:api-error", showServiceIssue);
      window.clearTimeout(issueTimer);
    };
  }, [queryClient]);

  if (online && !serviceIssue) return null;

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <WifiOff size={15} aria-hidden="true" />
      <span>{online ? "BloomBook couldn’t reach the journal service." : "You’re offline. Your journal will reconnect automatically."}</span>
      {online && (
        <button type="button" onClick={() => { setServiceIssue(false); void queryClient.invalidateQueries(); }} className="font-bold underline underline-offset-2">
          Retry
        </button>
      )}
    </div>
  );
}
