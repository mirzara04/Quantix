export interface StudentProfile {
  id?: string;
  name: string;
  degree: string;
  semester: number;
  cgpa: number;
  skills: string[];
  financial_need: boolean;
  location_preference: string;
  past_experience?: string;
  preferred_types?: string[];
}

export interface Opportunity {
  id: string;
  batch_id?: string;
  title: string;
  organization: string;
  type: 'scholarship' | 'internship' | 'fellowship' | 'competition' | 'grant' | 'admission' | 'spam' | 'unknown';
  deadline?: string | null;
  stipend: string;
  min_cgpa: number;
  keywords: string[];
  requires_financial_need: boolean;
  location: string;
  description: string;
  apply_link: string | null;
  required_documents: string[];
  source_text: string;
  evidence_markers: EvidenceMarker[];
  score: number;
  score_breakdown: ScoreBreakdown;
  rank_reason: string;
  eligibility_gap: string | null;
  is_eligible: boolean;
  is_spam: boolean;
  spam_signals?: string[];
  status: 'pending' | 'processing' | 'complete' | 'error';
  created_at?: string;
}

export interface EvidenceMarker {
  field: EvidenceField;
  text: string;
  start: number;
  end: number;
}

export type EvidenceField = 'deadline' | 'stipend' | 'min_cgpa' | 'location' | 'keywords';

export interface ScoreBreakdown {
  urgency: number;
  fit: number;
  status: number;
  completeness: number;
  total: number;
  urgency_reason?: string;
  fit_reason?: string;
  status_reason?: string;
  completeness_reason?: string;
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
  apply_link?: string | null;
  required_documents?: string[];
  is_spam: boolean;
}

export interface GeneratedPackage {
  id?: string;
  opportunity_id: string;
  cover_letter: string;
  resume_keywords: string[];
  document_checklist: string[];
}

export type DeadlineBucket = 'all' | 'overdue' | '0-3d' | '4-7d' | '8-14d' | '15d+';

export type ActiveField = {
  opportunityId: string;
  field: EvidenceField;
} | null;
