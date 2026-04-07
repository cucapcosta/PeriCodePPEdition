import { EyeIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectSearchEntriesQueryOptions } from "~/lib/projectReactQuery";
import { Button } from "../ui/button";
import { HtmlPreviewDialog } from "./HtmlPreviewDialog";

interface HtmlPreviewButtonProps {
  cwd: string | null;
}

export function HtmlPreviewButton({ cwd }: HtmlPreviewButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const searchQuery = useQuery(
    projectSearchEntriesQueryOptions({
      cwd,
      query: ".html",
      limit: 50,
      staleTime: 5_000,
      refetchInterval: 5_000,
    }),
  );

  const htmlFiles = useMemo(() => {
    const entries = searchQuery.data?.entries ?? [];
    return entries
      .filter((entry) => entry.path.endsWith(".html"))
      .map((entry) => ({
        path: entry.path,
        name: entry.path.split("/").pop() ?? entry.path,
      }));
  }, [searchQuery.data?.entries]);

  const disabled = !cwd || htmlFiles.length === 0;

  return (
    <>
      <Button
        variant="outline"
        size="xs"
        disabled={disabled}
        onClick={() => setDialogOpen(true)}
        title={disabled ? "Nenhum arquivo HTML encontrado" : "Preview HTML"}
      >
        <EyeIcon className="size-3" />
        <span className="sr-only sm:not-sr-only">Preview</span>
      </Button>
      {dialogOpen && cwd && htmlFiles.length > 0 && (
        <HtmlPreviewDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          cwd={cwd}
          htmlFiles={htmlFiles}
        />
      )}
    </>
  );
}
