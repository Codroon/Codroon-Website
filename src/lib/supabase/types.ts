/**
 * Database types for the estimator persistence schema.
 * Mirrors supabase/migrations/0001_estimates_and_leads.sql.
 *
 * Note the shape of what anon can reach: Row types exist for reading,
 * but the only anon-accessible read path is the get_estimate RPC. There
 * is deliberately no way to express "select * from estimates" here,
 * because the policies deny it.
 */

export type LeadSource =
  | "modal_call"
  | "modal_email"
  | "modal_meeting"
  | "estimator_email"
  | "estimator_quote";

export type ToolKey = "agent" | "mvp";

export type EstimateRow = {
  short_code: string;
  tool: ToolKey;
  answers: Record<string, unknown>;
  computed: Record<string, unknown> | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      estimates: {
        Row: EstimateRow & { id: string };
        Insert: {
          short_code: string;
          tool: ToolKey;
          answers?: Record<string, unknown>;
          computed?: Record<string, unknown> | null;
          completed?: boolean;
        };
        Update: never; // anon updates go through update_estimate()
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          estimate_id: string | null;
          source: LeadSource;
          name: string | null;
          email: string | null;
          phone: string | null;
          message: string | null;
          created_at: string;
        };
        // only the modal sources may be inserted directly; estimator
        // leads must go through create_lead() so the estimate is
        // resolved from its short code
        Insert: {
          source: Extract<
            LeadSource,
            "modal_call" | "modal_email" | "modal_meeting"
          >;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          message?: string | null;
        };
        Update: never;
        Relationships: [];
      };
    };
    // Revoked from anon — only reachable with the service role, which
    // is why the cron routes are the only callers.
    Views: {
      v_estimate_funnel: {
        Row: {
          tool: ToolKey;
          answered_count: number;
          completed: number;
          abandoned: number;
          total: number;
        };
        Relationships: [];
      };
      v_industry_breakdown: {
        Row: {
          tool: ToolKey;
          industry: string;
          estimates: number;
          completed: number;
        };
        Relationships: [];
      };
      v_value_distribution: {
        Row: { tool: ToolKey; band: string; estimates: number };
        Relationships: [];
      };
      v_high_value_no_lead: {
        Row: {
          short_code: string;
          tool: ToolKey;
          midpoint: number;
          industry: string | null;
          updated_at: string;
          high_value_notified_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_estimate: {
        Args: { p_short_code: string };
        Returns: EstimateRow[];
      };
      update_estimate: {
        Args: {
          p_short_code: string;
          p_answers?: Record<string, unknown> | null;
          p_computed?: Record<string, unknown> | null;
          p_completed?: boolean | null;
        };
        Returns: undefined;
      };
      create_lead: {
        Args: {
          p_source: LeadSource;
          p_short_code?: string | null;
          p_name?: string | null;
          p_email?: string | null;
          p_phone?: string | null;
          p_message?: string | null;
        };
        Returns: undefined;
      };
      mark_high_value_notified: {
        Args: { p_short_codes: string[] };
        Returns: number;
      };
      purge_expired_estimates: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
