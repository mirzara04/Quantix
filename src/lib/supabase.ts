import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      student_profiles: {
        Row: {
          id: string;
          name: string;
          degree: string;
          semester: number;
          cgpa: number;
          skills: string[];
          financial_need: boolean;
          location_preference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['student_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['student_profiles']['Insert']>;
      };
      email_batches: {
        Row: {
          id: string;
          raw_text: string;
          processed: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['email_batches']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['email_batches']['Insert']>;
      };
      opportunities: {
        Row: {
          id: string;
          batch_id: string | null;
          title: string;
          organization: string;
          type: string;
          deadline: string | null;
          stipend: string;
          min_cgpa: number;
          keywords: string[];
          requires_financial_need: boolean;
          location: string;
          description: string;
          source_text: string;
          evidence_markers: unknown[];
          score: number;
          score_breakdown: Record<string, unknown>;
          is_eligible: boolean;
          is_spam: boolean;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['opportunities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['opportunities']['Insert']>;
      };
      generated_packages: {
        Row: {
          id: string;
          opportunity_id: string;
          cover_letter: string;
          resume_keywords: string[];
          document_checklist: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['generated_packages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['generated_packages']['Insert']>;
      };
    };
  };
};
