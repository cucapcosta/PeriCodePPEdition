import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { isElectron } from "~/env";
import { isMacPlatform } from "~/lib/utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from "../ui/dialog";

interface HtmlPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cwd: string;
  htmlFiles: Array<{ path: string; name: string }>;
}

function getServerHttpOrigin(): string {
  const bridgeUrl = window.desktopBridge?.getWsUrl();
  const envUrl = import.meta.env.VITE_WS_URL as string | undefined;
  const wsUrl =
    bridgeUrl && bridgeUrl.length > 0
      ? bridgeUrl
      : envUrl && envUrl.length > 0
        ? envUrl
        : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:${window.location.port}`;
  const httpUrl = wsUrl.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
  try {
    return new URL(httpUrl).origin;
  } catch {
    return httpUrl;
  }
}

export function HtmlPreviewDialog({ open, onOpenChange, cwd, htmlFiles }: HtmlPreviewDialogProps) {
  const [selectedFile, setSelectedFile] = useState(htmlFiles[0]?.path ?? "");
  const [iframeKey, setIframeKey] = useState(0);

  const serverOrigin = getServerHttpOrigin();
  const iframeSrc = selectedFile
    ? `${serverOrigin}/api/workspace-file?cwd=${encodeURIComponent(cwd)}&path=${encodeURIComponent(selectedFile)}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport
          className={`!grid-rows-[1fr] !p-4${isElectron && isMacPlatform(navigator.platform) ? " pt-14" : ""}`}
        >
          <DialogPopup
            showCloseButton
            bottomStickOnMobile={false}
            className="!max-w-[90vw] !w-[90vw] !h-[90vh] !max-h-[90vh] row-start-1 flex flex-col"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
              <DialogTitle className="!text-sm shrink-0">Preview HTML</DialogTitle>
              {htmlFiles.length > 1 && (
                <select
                  className="min-w-0 flex-1 rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground focus:outline-none focus:border-ring"
                  value={selectedFile}
                  onChange={(e) => {
                    setSelectedFile(e.target.value);
                    setIframeKey((k) => k + 1);
                  }}
                >
                  {htmlFiles.map((file) => (
                    <option key={file.path} value={file.path}>
                      {file.name}
                    </option>
                  ))}
                </select>
              )}
              {htmlFiles.length === 1 && (
                <span className="text-xs text-muted-foreground truncate">{htmlFiles[0]?.name}</span>
              )}
              <Button
                variant="outline"
                size="xs"
                onClick={() => setIframeKey((k) => k + 1)}
                title="Atualizar"
              >
                <RefreshCwIcon className="size-3" />
              </Button>
            </div>
            <div className="min-h-0 flex-1">
              {iframeSrc && (
                <iframe
                  key={iframeKey}
                  src={iframeSrc}
                  sandbox="allow-scripts"
                  className="h-full w-full border-0"
                  title="HTML Preview"
                />
              )}
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
