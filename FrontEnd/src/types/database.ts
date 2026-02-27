export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

type Timestamp = string;

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number;
          title: string;
          location: string | null;
          year: string | null;
          status: string | null;
          description: string | null;
          tags: string[] | null;
          image_url: string | null;
          image_url_mobile: string | null;
          gallery_urls: string[] | null;
          created_at: Timestamp | null;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      page_content: {
        Row: {
          section: string;
          title: string | null;
          subtitle: string | null;
          body: string | null;
          image_url: string | null;
          image_url_mobile: string | null;
          updated_at: Timestamp | null;
        };
        Insert: Partial<Database["public"]["Tables"]["page_content"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["page_content"]["Row"]>;
      };
      team: {
        Row: {
          id: number;
          name: string;
          role: string | null;
          image_url: string | null;
          image_url_mobile: string | null;
          created_at: Timestamp | null;
        };
        Insert: Partial<Database["public"]["Tables"]["team"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["team"]["Row"]>;
      };
      news: {
        Row: {
          id: number;
          title: string;
          date: string | null;
          content: string | null;
          image_url: string | null;
          image_url_mobile: string | null;
          gallery_urls: string[] | null;
          created_at: Timestamp | null;
        };
        Insert: Partial<Database["public"]["Tables"]["news"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["news"]["Row"]>;
      };
      chat_sessions: {
        Row: {
          id: number;
          status: string | null;
          created_at: Timestamp | null;
        };
        Insert: Partial<Database["public"]["Tables"]["chat_sessions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["chat_sessions"]["Row"]>;
      };
      chat_messages: {
        Row: {
          id: number;
          session_id: number | null;
          content: string;
          created_at: Timestamp | null;
        };
        Insert: Partial<Database["public"]["Tables"]["chat_messages"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Row"]>;
      };
      ai_knowledge: {
        Row: {
          id: number;
          topic: string;
          content: string;
          created_at: Timestamp | null;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_knowledge"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["ai_knowledge"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
