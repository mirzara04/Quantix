export interface StudentProfile {
  id?: string;
  name: string;
  degree: string;
  semester: number;
  cgpa: number;
  skills: string[];
  financial_need: boolean;
  location_preference: string;
}

export interface Opportunity {
  id: string;
  batch_id?: string;
  title: string;
  organization: string;
  type: 'scholarship' | 'internship' | 'fellowship' | 'competition' | 'grant' | 'spam' | 'unknown';
  deadline?: string | null;
  stipend: string;
  min_cgpa: number;
  keywords: string[];
  requires_financial_need: boolean;
  location: string;
  description: string;
  source_text: string;
  evidence_markers: EvidenceMarker[];
  score: number;
  score_breakdown: ScoreBreakdown;
  is_eligible: boolean;
  is_spam: boolean;
  status: 'pending' | 'processing' | 'complete' | 'error';
  created_at?: string;
}

export interface EvidenceMarker {
  field: string;
  text: string;
  start: number;
  end: number;
}

export interface ScoreBreakdown {
  urgency: number;
  fit: number;
  status: number;
  total: number;
  urgency_reason?: string;
  fit_reason?: string;
  status_reason?: string;
}

export interface ExtractedOpportunityJSON {
  title: string;
  organization: string;
  type: string;
  deadline?: string;
  stipend?: string;
  min_cgpa?: number;
  keywords: string[];
  requires_financial_need?: boolean;
  location?: string;
  description: string;
  source_text: string;
  is_spam: boolean;
}

export interface GeneratedPackage {
  id?: string;
  opportunity_id: string;
  cover_letter: string;
  resume_keywords: string[];
  document_checklist: string[];
}

export type ActiveField = {
  opportunityId: string;
  field: string;
} | null;
