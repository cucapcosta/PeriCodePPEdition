const STORAGE_KEY = "t3code:notion-links:v1";

export type NotionLinkId = "notion-luiza" | "notion-rapha-davi";

type NotionLinks = Partial<Record<NotionLinkId, string>>;

function readLinks(): NotionLinks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as NotionLinks;
  } catch {
    return {};
  }
}

function writeLinks(links: NotionLinks): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function getNotionLink(id: NotionLinkId): string | null {
  return readLinks()[id] ?? null;
}

export function setNotionLink(id: NotionLinkId, url: string): void {
  const links = readLinks();
  links[id] = url;
  writeLinks(links);
}
