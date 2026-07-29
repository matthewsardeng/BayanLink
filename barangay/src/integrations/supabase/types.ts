export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          is_published: boolean
          kind: Database["public"]["Enums"]["announcement_kind"]
          published_at: string | null
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          is_published?: boolean
          kind?: Database["public"]["Enums"]["announcement_kind"]
          published_at?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          kind?: Database["public"]["Enums"]["announcement_kind"]
          published_at?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_official: boolean
          post_id: string
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_official?: boolean
          post_id: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_official?: boolean
          post_id?: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          created_at: string
          details: string | null
          entity_id: string
          entity_type: string
          id: string
          reason: string
          reporter_id: string
          status: Database["public"]["Enums"]["report_status"]
        }
        Insert: {
          created_at?: string
          details?: string | null
          entity_id: string
          entity_type: string
          id?: string
          reason: string
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status"]
        }
        Update: {
          created_at?: string
          details?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status"]
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      issue_confirmations: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          user_id: string
          verdict: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          user_id: string
          verdict: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          user_id?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_confirmations_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_resolutions: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          note: string | null
          photo_url: string | null
          user_id: string
          verdict: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          note?: string | null
          photo_url?: string | null
          user_id: string
          verdict: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          note?: string | null
          photo_url?: string | null
          user_id?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_resolutions_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_updates: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          is_official: boolean
          issue_id: string
          note: string | null
          status: Database["public"]["Enums"]["issue_status"]
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          is_official?: boolean
          issue_id: string
          note?: string | null
          status: Database["public"]["Enums"]["issue_status"]
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          is_official?: boolean
          issue_id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
        }
        Relationships: [
          {
            foreignKeyName: "issue_updates_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          category: string
          content_status: Database["public"]["Enums"]["content_status"]
          created_at: string
          description: string
          id: string
          latitude: number | null
          location_label: string
          longitude: number | null
          photo_url: string | null
          reference_no: string
          reporter_id: string
          status: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          description: string
          id?: string
          latitude?: number | null
          location_label: string
          longitude?: number | null
          photo_url?: string | null
          reference_no?: string
          reporter_id: string
          status?: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          description?: string
          id?: string
          latitude?: number | null
          location_label?: string
          longitude?: number | null
          photo_url?: string | null
          reference_no?: string
          reporter_id?: string
          status?: Database["public"]["Enums"]["issue_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          kind: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["post_category"]
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_official: boolean
          location_label: string | null
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: Database["public"]["Enums"]["post_category"]
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_official?: boolean
          location_label?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["post_category"]
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_official?: boolean
          location_label?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          area: string | null
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
        }
        Insert: {
          area?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
        }
        Update: {
          area?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      service_request_updates: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          note: string | null
          request_id: string
          status: Database["public"]["Enums"]["request_status"]
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          request_id: string
          status: Database["public"]["Enums"]["request_status"]
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "service_request_updates_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          contact_number: string | null
          created_at: string
          details: string | null
          id: string
          purpose: string
          reference_no: string
          requester_id: string
          service_id: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          details?: string | null
          id?: string
          purpose: string
          reference_no?: string
          requester_id: string
          service_id: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          details?: string | null
          id?: string
          purpose?: string
          reference_no?: string
          requester_id?: string
          service_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          contact_info: string | null
          created_at: string
          description: string | null
          fee_info: string | null
          id: string
          is_active: boolean
          name: string
          online_request_enabled: boolean
          processing_info: string | null
          requirements: string[]
          slug: string
          sort_order: number
          source_note: string | null
          summary: string | null
          updated_at: string
          where_to_apply: string | null
          where_to_claim: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string
          description?: string | null
          fee_info?: string | null
          id?: string
          is_active?: boolean
          name: string
          online_request_enabled?: boolean
          processing_info?: string | null
          requirements?: string[]
          slug: string
          sort_order?: number
          source_note?: string | null
          summary?: string | null
          updated_at?: string
          where_to_apply?: string | null
          where_to_claim?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string
          description?: string | null
          fee_info?: string | null
          id?: string
          is_active?: boolean
          name?: string
          online_request_enabled?: boolean
          processing_info?: string | null
          requirements?: string[]
          slug?: string
          sort_order?: number
          source_note?: string | null
          summary?: string | null
          updated_at?: string
          where_to_apply?: string | null
          where_to_claim?: string | null
        }
        Relationships: []
      }
      suggestion_responses: {
        Row: {
          content: string
          created_at: string
          id: string
          is_official: boolean
          responder_id: string
          suggestion_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_official?: boolean
          responder_id: string
          suggestion_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_official?: boolean
          responder_id?: string
          suggestion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_responses_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestion_supports: {
        Row: {
          created_at: string
          id: string
          suggestion_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          suggestion_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          suggestion_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_supports_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          author_id: string
          category: string
          content_status: Database["public"]["Enums"]["content_status"]
          created_at: string
          description: string
          id: string
          location_label: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          description: string
          id?: string
          location_label?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          description?: string
          id?: string
          location_label?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      notify: {
        Args: {
          _body: string
          _kind: string
          _link: string
          _title: string
          _user: string
        }
        Returns: undefined
      }
    }
    Enums: {
      announcement_kind:
        | "announcement"
        | "advisory"
        | "update"
        | "event"
        | "service_interruption"
      app_role: "resident" | "official" | "admin"
      content_status: "visible" | "hidden" | "removed"
      issue_status:
        | "submitted"
        | "under_review"
        | "verified"
        | "assigned"
        | "in_progress"
        | "completed"
        | "closed"
      post_category:
        | "community_update"
        | "suggestion"
        | "question"
        | "discussion"
        | "public_concern"
        | "announcement"
        | "event"
      report_status: "open" | "reviewed" | "actioned" | "dismissed"
      request_status:
        | "submitted"
        | "under_review"
        | "processing"
        | "ready_for_claim"
        | "completed"
        | "rejected"
      suggestion_status:
        | "submitted"
        | "under_review"
        | "acknowledged"
        | "in_progress"
        | "implemented"
        | "declined"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_kind: [
        "announcement",
        "advisory",
        "update",
        "event",
        "service_interruption",
      ],
      app_role: ["resident", "official", "admin"],
      content_status: ["visible", "hidden", "removed"],
      issue_status: [
        "submitted",
        "under_review",
        "verified",
        "assigned",
        "in_progress",
        "completed",
        "closed",
      ],
      post_category: [
        "community_update",
        "suggestion",
        "question",
        "discussion",
        "public_concern",
        "announcement",
        "event",
      ],
      report_status: ["open", "reviewed", "actioned", "dismissed"],
      request_status: [
        "submitted",
        "under_review",
        "processing",
        "ready_for_claim",
        "completed",
        "rejected",
      ],
      suggestion_status: [
        "submitted",
        "under_review",
        "acknowledged",
        "in_progress",
        "implemented",
        "declined",
      ],
    },
  },
} as const
