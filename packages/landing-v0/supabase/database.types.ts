export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      task_links: {
        Row: {
          id: string
          task_id: string
          title: string
          url: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          url: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_links_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          action: string | null
          actionabletasks: Json | null
          attention_power: Database["public"]["Enums"]["attention_power"]
          created_at: string | null
          description: string
          detail_needed: string | null
          details: string | null
          due_date: string | null
          explanation: string | null
          group_name: string
          id: string
          importance: string | null
          is_main_task: boolean | null
          name: string
          next_step: string | null
          parent_task_id: string | null
          points: number | null
          raw_message: string | null
          status: string | null
          time_estimate: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action?: string | null
          actionabletasks?: Json | null
          attention_power: Database["public"]["Enums"]["attention_power"]
          created_at?: string | null
          description: string
          detail_needed?: string | null
          details?: string | null
          due_date?: string | null
          explanation?: string | null
          group_name: string
          id?: string
          importance?: string | null
          is_main_task?: boolean | null
          name: string
          next_step?: string | null
          parent_task_id?: string | null
          points?: number | null
          raw_message?: string | null
          status?: string | null
          time_estimate: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action?: string | null
          actionabletasks?: Json | null
          attention_power?: Database["public"]["Enums"]["attention_power"]
          created_at?: string | null
          description?: string
          detail_needed?: string | null
          details?: string | null
          due_date?: string | null
          explanation?: string | null
          group_name?: string
          id?: string
          importance?: string | null
          is_main_task?: boolean | null
          name?: string
          next_step?: string | null
          parent_task_id?: string | null
          points?: number | null
          raw_message?: string | null
          status?: string | null
          time_estimate?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          email_address: string
          id: number
          last_action_date: string | null
          points: number | null
          streak_start: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email_address: string
          id?: number
          last_action_date?: string | null
          points?: number | null
          streak_start?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email_address?: string
          id?: number
          last_action_date?: string | null
          points?: number | null
          streak_start?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user-settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      attention_power: "Squirrel" | "Caffeinated" | "Hyperfocus" | "Time Lord"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
