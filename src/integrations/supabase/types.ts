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
      asset_links: {
        Row: {
          asset_id: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_links_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_tags: {
        Row: {
          asset_id: string
          tag: string
        }
        Insert: {
          asset_id: string
          tag: string
        }
        Update: {
          asset_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_tags_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_versions: {
        Row: {
          asset_id: string | null
          author: string | null
          changes: string | null
          created_at: string | null
          id: string
          path: string
          public_url: string | null
          version: string
        }
        Insert: {
          asset_id?: string | null
          author?: string | null
          changes?: string | null
          created_at?: string | null
          id?: string
          path: string
          public_url?: string | null
          version: string
        }
        Update: {
          asset_id?: string | null
          author?: string | null
          changes?: string | null
          created_at?: string | null
          id?: string
          path?: string
          public_url?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_versions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          author: string | null
          bucket: string
          category: Database["public"]["Enums"]["asset_category"]
          code: string
          created_at: string | null
          description: string | null
          format: string
          id: string
          language: string | null
          metadata: Json | null
          path: string
          public_url: string | null
          status: Database["public"]["Enums"]["asset_status"] | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          author?: string | null
          bucket: string
          category: Database["public"]["Enums"]["asset_category"]
          code: string
          created_at?: string | null
          description?: string | null
          format: string
          id?: string
          language?: string | null
          metadata?: Json | null
          path: string
          public_url?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          author?: string | null
          bucket?: string
          category?: Database["public"]["Enums"]["asset_category"]
          code?: string
          created_at?: string | null
          description?: string | null
          format?: string
          id?: string
          language?: string | null
          metadata?: Json | null
          path?: string
          public_url?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      case_actions: {
        Row: {
          case_id: string | null
          category: string | null
          created_at: string | null
          description: string | null
          expected_result: string | null
          id: string
          impact: string | null
          name: string
          real_result: string | null
          required_tool: string | null
          time_cost: number | null
          xp_reward: number | null
        }
        Insert: {
          case_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          expected_result?: string | null
          id?: string
          impact?: string | null
          name: string
          real_result?: string | null
          required_tool?: string | null
          time_cost?: number | null
          xp_reward?: number | null
        }
        Update: {
          case_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          expected_result?: string | null
          id?: string
          impact?: string | null
          name?: string
          real_result?: string | null
          required_tool?: string | null
          time_cost?: number | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "case_actions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_components: {
        Row: {
          can_inspect: boolean | null
          can_measure: boolean | null
          can_replace: boolean | null
          case_id: string | null
          component_id: string | null
          component_tag: string | null
          created_at: string | null
          expected_state: string
          failure_details: string | null
          id: string
          initial_state: string
          is_faulty: boolean | null
          state_after_intervention: string | null
        }
        Insert: {
          can_inspect?: boolean | null
          can_measure?: boolean | null
          can_replace?: boolean | null
          case_id?: string | null
          component_id?: string | null
          component_tag?: string | null
          created_at?: string | null
          expected_state: string
          failure_details?: string | null
          id?: string
          initial_state: string
          is_faulty?: boolean | null
          state_after_intervention?: string | null
        }
        Update: {
          can_inspect?: boolean | null
          can_measure?: boolean | null
          can_replace?: boolean | null
          case_id?: string | null
          component_id?: string | null
          component_tag?: string | null
          created_at?: string | null
          expected_state?: string
          failure_details?: string | null
          id?: string
          initial_state?: string
          is_faulty?: boolean | null
          state_after_intervention?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_components_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_errors: {
        Row: {
          case_id: string | null
          created_at: string | null
          description: string
          error_type: string
          feedback: string
          id: string
          penalty_explanation: string | null
          xp_penalty: number | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          description: string
          error_type: string
          feedback: string
          id?: string
          penalty_explanation?: string | null
          xp_penalty?: number | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          description?: string
          error_type?: string
          feedback?: string
          id?: string
          penalty_explanation?: string | null
          xp_penalty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "case_errors_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_feedback: {
        Row: {
          case_id: string | null
          created_at: string | null
          feedback_text: string | null
          id: string
          metadata: Json | null
          score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          metadata?: Json | null
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          metadata?: Json | null
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_feedback_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_hints: {
        Row: {
          case_id: string | null
          content: string
          created_at: string | null
          explanation: string | null
          fundamental_basis: string | null
          id: string
          level: number
          xp_penalty: number | null
        }
        Insert: {
          case_id?: string | null
          content: string
          created_at?: string | null
          explanation?: string | null
          fundamental_basis?: string | null
          id?: string
          level: number
          xp_penalty?: number | null
        }
        Update: {
          case_id?: string | null
          content?: string
          created_at?: string | null
          explanation?: string | null
          fundamental_basis?: string | null
          id?: string
          level?: number
          xp_penalty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "case_hints_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_hypotheses: {
        Row: {
          case_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_correct: boolean | null
          root_cause: boolean | null
          title: string
          validation_logic: Json | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_correct?: boolean | null
          root_cause?: boolean | null
          title: string
          validation_logic?: Json | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_correct?: boolean | null
          root_cause?: boolean | null
          title?: string
          validation_logic?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "case_hypotheses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_lessons: {
        Row: {
          best_practices: string | null
          case_id: string | null
          circuit_theory: string | null
          common_mistakes: string | null
          created_at: string | null
          failure_explanation: string | null
          fundamental_basis: string | null
          id: string
          norms_related: string | null
          safety_warnings: string | null
          technical_summary: string | null
        }
        Insert: {
          best_practices?: string | null
          case_id?: string | null
          circuit_theory?: string | null
          common_mistakes?: string | null
          created_at?: string | null
          failure_explanation?: string | null
          fundamental_basis?: string | null
          id?: string
          norms_related?: string | null
          safety_warnings?: string | null
          technical_summary?: string | null
        }
        Update: {
          best_practices?: string | null
          case_id?: string | null
          circuit_theory?: string | null
          common_mistakes?: string | null
          created_at?: string | null
          failure_explanation?: string | null
          fundamental_basis?: string | null
          id?: string
          norms_related?: string | null
          safety_warnings?: string | null
          technical_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_lessons_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_measurements: {
        Row: {
          case_id: string | null
          condition: string | null
          created_at: string | null
          display_message: string | null
          expected_value: string | null
          id: string
          measurement_point_id: string | null
          point_code: string
          precision: number | null
          presented_value: string | null
          real_value: string
          state: string | null
          tolerance: number | null
          unit: string | null
        }
        Insert: {
          case_id?: string | null
          condition?: string | null
          created_at?: string | null
          display_message?: string | null
          expected_value?: string | null
          id?: string
          measurement_point_id?: string | null
          point_code: string
          precision?: number | null
          presented_value?: string | null
          real_value: string
          state?: string | null
          tolerance?: number | null
          unit?: string | null
        }
        Update: {
          case_id?: string | null
          condition?: string | null
          created_at?: string | null
          display_message?: string | null
          expected_value?: string | null
          id?: string
          measurement_point_id?: string | null
          point_code?: string
          precision?: number | null
          presented_value?: string | null
          real_value?: string
          state?: string | null
          tolerance?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_measurements_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_occurrences: {
        Row: {
          case_id: string | null
          created_at: string | null
          criticality: string | null
          description: string
          equipment: string | null
          history: string | null
          id: string
          initial_condition: string | null
          location: string | null
          occurrence_date: string | null
          operational_context: string | null
          operational_risk: string | null
          operator_message: string | null
          responsible: string | null
          shift: string | null
          title: string
          urgency: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          criticality?: string | null
          description: string
          equipment?: string | null
          history?: string | null
          id?: string
          initial_condition?: string | null
          location?: string | null
          occurrence_date?: string | null
          operational_context?: string | null
          operational_risk?: string | null
          operator_message?: string | null
          responsible?: string | null
          shift?: string | null
          title: string
          urgency?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          criticality?: string | null
          description?: string
          equipment?: string | null
          history?: string | null
          id?: string
          initial_condition?: string | null
          location?: string | null
          occurrence_date?: string | null
          operational_context?: string | null
          operational_risk?: string | null
          operator_message?: string | null
          responsible?: string | null
          shift?: string | null
          title?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_occurrences_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_results: {
        Row: {
          accuracy: number | null
          actions_taken: Json | null
          case_id: string | null
          created_at: string | null
          errors_count: number | null
          id: string
          status: string | null
          time_spent: number | null
          total_xp: number | null
          user_id: string | null
        }
        Insert: {
          accuracy?: number | null
          actions_taken?: Json | null
          case_id?: string | null
          created_at?: string | null
          errors_count?: number | null
          id?: string
          status?: string | null
          time_spent?: number | null
          total_xp?: number | null
          user_id?: string | null
        }
        Update: {
          accuracy?: number | null
          actions_taken?: Json | null
          case_id?: string | null
          created_at?: string | null
          errors_count?: number | null
          id?: string
          status?: string | null
          time_spent?: number | null
          total_xp?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_results_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
            referencedColumns: ["id"]
          },
        ]
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
      case_symptoms: {
        Row: {
          appearance_trigger: string | null
          case_id: string | null
          category: string | null
          code: string
          condition_logic: Json | null
          created_at: string | null
          description: string
          id: string
          priority: number | null
          visibility: string | null
        }
        Insert: {
          appearance_trigger?: string | null
          case_id?: string | null
          category?: string | null
          code: string
          condition_logic?: Json | null
          created_at?: string | null
          description: string
          id?: string
          priority?: number | null
          visibility?: string | null
        }
        Update: {
          appearance_trigger?: string | null
          case_id?: string | null
          category?: string | null
          code?: string
          condition_logic?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_symptoms_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_cases"
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
      diagnostic_cases: {
        Row: {
          author: string | null
          category: string | null
          circuit_id: string | null
          code: string
          complexity: number | null
          created_at: string | null
          description: string | null
          id: string
          laboratory_id: string | null
          level: Database["public"]["Enums"]["case_difficulty"] | null
          status: string | null
          time_estimate: string | null
          title: string
          updated_at: string | null
          version: string | null
          xp_reward: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          circuit_id?: string | null
          code: string
          complexity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          laboratory_id?: string | null
          level?: Database["public"]["Enums"]["case_difficulty"] | null
          status?: string | null
          time_estimate?: string | null
          title: string
          updated_at?: string | null
          version?: string | null
          xp_reward?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          circuit_id?: string | null
          code?: string
          complexity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          laboratory_id?: string | null
          level?: Database["public"]["Enums"]["case_difficulty"] | null
          status?: string | null
          time_estimate?: string | null
          title?: string
          updated_at?: string | null
          version?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_cases_laboratory_id_fkey"
            columns: ["laboratory_id"]
            isOneToOne: false
            referencedRelation: "laboratories"
            referencedColumns: ["id"]
          },
        ]
      }
      diagram_hotspots: {
        Row: {
          asset_id: string | null
          component_id: string | null
          created_at: string | null
          height: number
          id: string
          metadata: Json | null
          tag: string | null
          type: string | null
          width: number
          x: number
          y: number
        }
        Insert: {
          asset_id?: string | null
          component_id?: string | null
          created_at?: string | null
          height: number
          id?: string
          metadata?: Json | null
          tag?: string | null
          type?: string | null
          width: number
          x: number
          y: number
        }
        Update: {
          asset_id?: string | null
          component_id?: string | null
          created_at?: string | null
          height?: number
          id?: string
          metadata?: Json | null
          tag?: string | null
          type?: string | null
          width?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "diagram_hotspots_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
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
      marketplace_items: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
          requirements: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
          price: number
          requirements?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          requirements?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      panel_hotspots: {
        Row: {
          asset_id: string | null
          component_id: string | null
          created_at: string | null
          height: number
          id: string
          metadata: Json | null
          tooltip: string | null
          width: number
          x: number
          y: number
        }
        Insert: {
          asset_id?: string | null
          component_id?: string | null
          created_at?: string | null
          height: number
          id?: string
          metadata?: Json | null
          tooltip?: string | null
          width: number
          x: number
          y: number
        }
        Update: {
          asset_id?: string | null
          component_id?: string | null
          created_at?: string | null
          height?: number
          id?: string
          metadata?: Json | null
          tooltip?: string | null
          width?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "panel_hotspots_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
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
          organization_id: string | null
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
          organization_id?: string | null
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
          organization_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      asset_category:
        | "Diagrama de Potência"
        | "Diagrama de Comando"
        | "Diagrama Funcional"
        | "Diagrama Multifilar"
        | "Diagrama Unifilar"
        | "Painel Frontal"
        | "Painel Interno"
        | "Foto"
        | "Vídeo"
        | "Áudio"
        | "Animação"
        | "PDF"
        | "Manual"
        | "Catálogo"
        | "Datasheet"
        | "Checklist"
        | "Norma"
        | "Fluxograma"
        | "Modelo 3D"
        | "Símbolo Elétrico"
        | "Documento Técnico"
      asset_status: "active" | "inactive" | "archived" | "draft"
      case_difficulty:
        | "Iniciante"
        | "Intermediário"
        | "Avançado"
        | "Especialista"
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
      asset_category: [
        "Diagrama de Potência",
        "Diagrama de Comando",
        "Diagrama Funcional",
        "Diagrama Multifilar",
        "Diagrama Unifilar",
        "Painel Frontal",
        "Painel Interno",
        "Foto",
        "Vídeo",
        "Áudio",
        "Animação",
        "PDF",
        "Manual",
        "Catálogo",
        "Datasheet",
        "Checklist",
        "Norma",
        "Fluxograma",
        "Modelo 3D",
        "Símbolo Elétrico",
        "Documento Técnico",
      ],
      asset_status: ["active", "inactive", "archived", "draft"],
      case_difficulty: [
        "Iniciante",
        "Intermediário",
        "Avançado",
        "Especialista",
      ],
    },
  },
} as const
