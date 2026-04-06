import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { HtmlPreviewDialog } from "./HtmlPreviewDialog";

interface HtmlPreviewCardProps {
  cwd: string;
  file: { path: string; name: string };
}

export function HtmlPreviewCard({ cwd, file }: HtmlPreviewCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs">
        <EyeIcon className="size-3 shrink-0 text-muted-foreground" />
        <span className="truncate">{file.name}</span>
        <Button variant="outline" size="xs" onClick={() => setDialogOpen(true)}>
          Preview
        </Button>
      </div>
      {dialogOpen && (
        <HtmlPreviewDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          cwd={cwd}
          htmlFiles={[file]}
        />
      )}
    </>
  );
}
