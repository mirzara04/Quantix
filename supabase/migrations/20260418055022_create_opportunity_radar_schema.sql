/*
  # Opportunity Radar - Core Schema

  ## Overview
  Creates the core tables for the Opportunity Radar platform.

  ## New Tables

  ### 1. student_profiles
  Stores student profile data used for opportunity scoring and matching.
  - id: UUID primary key
  - name: Student display name
  - degree: Academic degree (e.g., B.Tech, M.Sc)
  - semester: Current semester (1-8)
  - cgpa: Cumulative GPA (0.0 - 10.0)
  - skills: Array of skill tags
  - financial_need: Whether student qualifies for need-based aid
  - location_preference: Preferred work/study location
  - created_at / updated_at: Timestamps

  ### 2. email_batches
  Stores raw email text that users paste for processing.
  - id: UUID primary key
  - raw_text: Full raw email content
  - processed: Whether AI extraction is complete
  - created_at: Timestamp

  ### 3. opportunities
  Stores extracted and structured opportunity data.
  - id: UUID primary key
  - batch_id: Links to email_batches
  - title, organization, type: Basic info
  - deadline: Application deadline
  - stipend: Financial benefit
  - min_cgpa: Minimum CGPA requirement
  - keywords: Array of skill/domain keywords
  - requires_financial_need: Whether need-based aid required
  - location: Location of opportunity
  - description: Full description text
  - source_text: Original text excerpt for evidence highlighting
  - evidence_markers: JSON array of text positions for highlighting
  - score: Calculated match score (0-100)
  - score_breakdown: JSON with scoring details
  - is_eligible: Whether student meets hard requirements
  - status: Processing status
  - created_at: Timestamp

  ### 4. generated_packages
  Stores AI-generated application packages for opportunities.
  - id: UUID primary key
  - opportunity_id: Links to opportunities
  - cover_letter: Generated cover letter draft
  - resume_keywords: ATS keyword optimization list
  - document_checklist: Required documents list
  - created_at: Timestamp

  ## Security
  - RLS enabled on all tables
  - Public access policies for demo mode (no auth required for now)
    - Note: In production, these would be restricted to authenticated users
*/

CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Student',
  degree text NOT NULL DEFAULT 'B.Tech',
  semester integer NOT NULL DEFAULT 1 CHECK (semester >= 1 AND semester <= 12),
  cgpa numeric(3,1) NOT NULL DEFAULT 0.0 CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
  skills text[] NOT NULL DEFAULT '{}',
  financial_need boolean NOT NULL DEFAULT false,
  location_preference text NOT NULL DEFAULT 'Any',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_text text NOT NULL DEFAULT '',
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES email_batches(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  organization text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'unknown' CHECK (type IN ('scholarship', 'internship', 'fellowship', 'competition', 'grant', 'spam', 'unknown')),
  deadline timestamptz,
  stipend text NOT NULL DEFAULT '',
  min_cgpa numeric(3,1) NOT NULL DEFAULT 0.0,
  keywords text[] NOT NULL DEFAULT '{}',
  requires_financial_need boolean NOT NULL DEFAULT false,
  location text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  source_text text NOT NULL DEFAULT '',
  evidence_markers jsonb NOT NULL DEFAULT '[]',
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  score_breakdown jsonb NOT NULL DEFAULT '{}',
  is_eligible boolean NOT NULL DEFAULT true,
  is_spam boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'complete', 'error')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generated_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  cover_letter text NOT NULL DEFAULT '',
  resume_keywords text[] NOT NULL DEFAULT '{}',
  document_checklist text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read student profiles"
  ON student_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public insert student profiles"
  ON student_profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public update student profiles"
  ON student_profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete student profiles"
  ON student_profiles FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read email batches"
  ON email_batches FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public insert email batches"
  ON email_batches FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public update email batches"
  ON email_batches FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read opportunities"
  ON opportunities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public insert opportunities"
  ON opportunities FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public update opportunities"
  ON opportunities FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete opportunities"
  ON opportunities FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read generated packages"
  ON generated_packages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public insert generated packages"
  ON generated_packages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_opportunities_batch_id ON opportunities(batch_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_score ON opportunities(score DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_generated_packages_opportunity_id ON generated_packages(opportunity_id);
