import { createFileRoute } from "@tanstack/react-router";
import { NotionEmbed } from "../components/NotionEmbed";

function NotionLuizaView() {
  return <NotionEmbed id="notion-luiza" title="Notion Luiza" />;
}

export const Route = createFileRoute("/_chat/notion-luiza")({
  component: NotionLuizaView,
});
