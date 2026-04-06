import { useCallback, useState } from "react";
import { type NotionLinkId, getNotionLink, setNotionLink } from "../notionLinks";
import { isElectron } from "../env";
import { SidebarInset } from "./ui/sidebar";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LinkIcon, PencilIcon } from "lucide-react";

function toEmbedUrl(url: string): string {
  // Notion URLs can be embedded by appending a query parameter
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return url;
  }
}

export function NotionEmbed({ id, title }: { id: NotionLinkId; title: string }) {
  const [link, setLink] = useState(() => getNotionLink(id));
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const saveLink = useCallback(
    (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      setNotionLink(id, trimmed);
      setLink(trimmed);
      setInputValue("");
      setIsEditing(false);
    },
    [id],
  );

  const showPrompt = !link || isEditing;

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-hidden overscroll-y-none bg-background text-foreground isolate">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground">
        {!isElectron && (
          <header className="border-b border-border px-3 py-2 sm:px-5">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="size-7 shrink-0 md:hidden" />
              <span className="text-sm font-medium text-foreground">{title}</span>
              {link && !isEditing && (
                <div className="ms-auto flex items-center gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setInputValue(link);
                      setIsEditing(true);
                    }}
                  >
                    <PencilIcon className="size-3.5" />
                    Alterar link
                  </Button>
                </div>
              )}
            </div>
          </header>
        )}

        {isElectron && (
          <div className="drag-region flex h-[52px] shrink-0 items-center border-b border-border px-5">
            <span className="text-xs font-medium tracking-wide text-muted-foreground/70">
              {title}
            </span>
            {link && !isEditing && (
              <div className="ms-auto flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setInputValue(link);
                    setIsEditing(true);
                  }}
                >
                  <PencilIcon className="size-3.5" />
                  Alterar link
                </Button>
              </div>
            )}
          </div>
        )}

        {showPrompt ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <LinkIcon className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Altere o link do Notion abaixo:"
                : "Cole o link do Notion para começar:"}
            </p>
            <form
              className="flex w-full max-w-md items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveLink(inputValue);
              }}
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue((e.target as HTMLInputElement).value)}
                placeholder="https://www.notion.so/..."
                autoFocus
              />
              <Button type="submit" size="sm" disabled={!inputValue.trim()}>
                Salvar
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              )}
            </form>
          </div>
        ) : (
          <iframe src={toEmbedUrl(link)} className="flex-1 border-0" title={title} />
        )}
      </div>
    </SidebarInset>
  );
}
