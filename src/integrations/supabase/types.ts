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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          description: string
          id: string
          max_progress: number
          title: string
          xp_reward: number
        }
        Insert: {
          category?: string | null
          description: string
          id?: string
          max_progress: number
          title: string
          xp_reward: number
        }
        Update: {
          category?: string | null
          description?: string
          id?: string
          max_progress?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      case_sessions: {
        Row: {
          answers: Json | null
          case_id: string
          completed_at: string | null
          current_step: number | null
          id: string
          start_time: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          case_id: string
          completed_at?: string | null
          current_step?: number | null
          id?: string
          start_time?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          case_id?: string
          completed_at?: string | null
          current_step?: number | null
          id?: string
          start_time?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_sessions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          category: string
          checklist: string[] | null
          code: string | null
          content: Json | null
          created_at: string | null
          description: string | null
          diagram_url: string | null
          id: string
          image_url: string | null
          laboratory_id: string | null
          level: string
          published: boolean | null
          slug: string
          symptoms: string[] | null
          time_estimate: string
          title: string
          xp_reward: number
        }
        Insert: {
          category: string
          checklist?: string[] | null
          code?: string | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          diagram_url?: string | null
          id?: string
          image_url?: string | null
          laboratory_id?: string | null
          level: string
          published?: boolean | null
          slug: string
          symptoms?: string[] | null
          time_estimate: string
          title: string
          xp_reward: number
        }
        Update: {
          category?: string
          checklist?: string[] | null
          code?: string | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          diagram_url?: string | null
          id?: string
          image_url?: string | null
          laboratory_id?: string | null
          level?: string
          published?: boolean | null
          slug?: string
          symptoms?: string[] | null
          time_estimate?: string
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "cases_laboratory_id_fkey"
            columns: ["laboratory_id"]
            isOneToOne: false
            referencedRelation: "laboratories"
            referencedColumns: ["id"]
          },
        ]
      }
      laboratories: {
        Row: {
          base_circuit_data: Json | null
          code: string
          components: Json | null
          created_at: string | null
          description: string | null
          estimated_time: string | null
          id: string
          learning_objectives: string[] | null
          level: string
          measurements: Json | null
          name: string
          panel_data: Json | null
          prerequisites: string[] | null
          published: boolean | null
          total_xp: number | null
          updated_at: string | null
        }
        Insert: {
          base_circuit_data?: Json | null
          code: string
          components?: Json | null
          created_at?: string | null
          description?: string | null
          estimated_time?: string | null
          id?: string
          learning_objectives?: string[] | null
          level: string
          measurements?: Json | null
          name: string
          panel_data?: Json | null
          prerequisites?: string[] | null
          published?: boolean | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Update: {
          base_circuit_data?: Json | null
          code?: string
          components?: Json | null
          created_at?: string | null
          description?: string | null
          estimated_time?: string | null
          id?: string
          learning_objectives?: string[] | null
          level?: string
          measurements?: Json | null
          name?: string
          panel_data?: Json | null
          prerequisites?: string[] | null
          published?: boolean | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accuracy: number | null
          avatar_url: string | null
          avg_time: number | null
          bio: string | null
          city: string | null
          company: string | null
          created_at: string | null
          full_name: string | null
          id: string
          language: string | null
          last_activity: string | null
          level: number | null
          phone: string | null
          role: string | null
          state: string | null
          streak_best: number | null
          streak_current: number | null
          theme: string | null
          total_diagnoses: number | null
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          accuracy?: number | null
          avatar_url?: string | null
          avg_time?: number | null
          bio?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          last_activity?: string | null
          level?: number | null
          phone?: string | null
          role?: string | null
          state?: string | null
          streak_best?: number | null
          streak_current?: number | null
          theme?: string | null
          total_diagnoses?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          accuracy?: number | null
          avatar_url?: string | null
          avg_time?: number | null
          bio?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          last_activity?: string | null
          level?: number | null
          phone?: string | null
          role?: string | null
          state?: string | null
          streak_best?: number | null
          streak_current?: number | null
          theme?: string | null
          total_diagnoses?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          completed: boolean | null
          completed_at: string | null
          progress: number | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed?: boolean | null
          completed_at?: string | null
          progress?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed?: boolean | null
          completed_at?: string | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
