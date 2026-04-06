import { createFileRoute } from "@tanstack/react-router";
import { NotionEmbed } from "../components/NotionEmbed";

function NotionRaphaDaviView() {
  return <NotionEmbed id="notion-rapha-davi" title="Notion Rapha/Davi" />;
}

export const Route = createFileRoute("/_chat/notion-rapha-davi")({
  component: NotionRaphaDaviView,
});
