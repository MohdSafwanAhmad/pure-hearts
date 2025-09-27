export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      beneficiary_types: {
        Row: {
          code: string;
          created_at: string | null;
          id: string;
          label: string;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          id?: string;
          label: string;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          id?: string;
          label?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          amount: number;
          created_at: string | null;
          donor_id: string;
          id: string;
          project_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          donor_id: string;
          id?: string;
          project_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          donor_id?: string;
          id?: string;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey";
            columns: ["donor_id"];
            isOneToOne: false;
            referencedRelation: "donors";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "donations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      donors: {
        Row: {
          donation_preferences: Json | null;
          first_name: string;
          last_name: string;
          profile_completed: boolean | null;
          user_id: string;
        };
        Insert: {
          donation_preferences?: Json | null;
          first_name: string;
          last_name: string;
          profile_completed?: boolean | null;
          user_id: string;
        };
        Update: {
          donation_preferences?: Json | null;
          first_name?: string;
          last_name?: string;
          profile_completed?: boolean | null;
          user_id?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          address: string;
          city: string;
          contact_person_email: string;
          contact_person_name: string;
          contact_person_phone: string;
          country: string;
          facebook_url: string | null;
          instagram_url: string | null;
          is_verified: boolean | null;
          linkedin_url: string | null;
          logo: string | null;
          mission_statement: string;
          organization_name: string;
          organization_phone: string;
          project_areas: Json | null;
          slug: string;
          state: string;
          twitter_url: string | null;
          user_id: string;
          website_url: string | null;
        };
        Insert: {
          address: string;
          city: string;
          contact_person_email: string;
          contact_person_name: string;
          contact_person_phone: string;
          country?: string;
          facebook_url?: string | null;
          instagram_url?: string | null;
          is_verified?: boolean | null;
          linkedin_url?: string | null;
          logo?: string | null;
          mission_statement: string;
          organization_name: string;
          organization_phone: string;
          project_areas?: Json | null;
          slug: string;
          state: string;
          twitter_url?: string | null;
          user_id: string;
          website_url?: string | null;
        };
        Update: {
          address?: string;
          city?: string;
          contact_person_email?: string;
          contact_person_name?: string;
          contact_person_phone?: string;
          country?: string;
          facebook_url?: string | null;
          instagram_url?: string | null;
          is_verified?: boolean | null;
          linkedin_url?: string | null;
          logo?: string | null;
          mission_statement?: string;
          organization_name?: string;
          organization_phone?: string;
          project_areas?: Json | null;
          slug?: string;
          state?: string;
          twitter_url?: string | null;
          user_id?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          beneficiary_type_id: string | null;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          goal_amount: number | null;
          id: string;
          organization_user_id: string;
          project_background_image: string | null;
          slug: string;
          start_date: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          beneficiary_type_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          goal_amount?: number | null;
          id?: string;
          organization_user_id: string;
          project_background_image?: string | null;
          slug: string;
          start_date?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          beneficiary_type_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          goal_amount?: number | null;
          id?: string;
          organization_user_id?: string;
          project_background_image?: string | null;
          slug?: string;
          start_date?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_beneficiary_type_id_fkey";
            columns: ["beneficiary_type_id"];
            isOneToOne: false;
            referencedRelation: "beneficiary_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_organization_user_id_fkey";
            columns: ["organization_user_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["user_id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      slugify: {
        Args: { txt: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
