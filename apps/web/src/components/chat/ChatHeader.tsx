import { type ThreadId } from "@t3tools/contracts";
import { memo } from "react";
import { Badge } from "../ui/badge";
import { SidebarTrigger } from "../ui/sidebar";
import { HtmlPreviewButton } from "./HtmlPreviewButton";

interface ChatHeaderProps {
  activeThreadId: ThreadId;
  activeThreadTitle: string;
  activeProjectName: string | undefined;
  projectCwd: string | null;
}

export const ChatHeader = memo(function ChatHeader({
  activeThreadTitle,
  activeProjectName,
  projectCwd,
}: ChatHeaderProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3">
        <SidebarTrigger className="size-7 shrink-0 md:hidden" />
        <h2
          className="min-w-0 shrink truncate text-sm font-medium text-foreground"
          title={activeThreadTitle}
        >
          {activeThreadTitle}
        </h2>
        {activeProjectName && (
          <Badge variant="outline" className="min-w-0 shrink truncate">
            {activeProjectName}
          </Badge>
        )}
      </div>
      <div className="flex min-w-0 items-center justify-end gap-2">
        <HtmlPreviewButton cwd={projectCwd} />
      </div>
    </div>
  );
});
