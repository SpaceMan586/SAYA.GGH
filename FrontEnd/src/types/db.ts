import { Database } from "./database";

export type PageContent =
  Database["public"]["Tables"]["page_content"]["Row"];

export type Project = Database["public"]["Tables"]["projects"]["Row"];

export type News = Database["public"]["Tables"]["news"]["Row"];

export type Team = Database["public"]["Tables"]["team"]["Row"];

export type ChatSession =
  Database["public"]["Tables"]["chat_sessions"]["Row"];

export type ChatMessage =
  Database["public"]["Tables"]["chat_messages"]["Row"];
