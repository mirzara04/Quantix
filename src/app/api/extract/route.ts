import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const OpportunitySchema = z.object({
  title: z.string().describe('Full title of the opportunity'),
  organization: z.string().describe('Organization or company name'),
  type: z.enum(['scholarship', 'internship', 'fellowship', 'competition', 'grant', 'spam', 'unknown']),
  deadline: z.string().nullable().describe('ISO 8601 date string for the deadline, or null if not found'),
  stipend: z.string().describe('Financial benefit amount as a string (e.g. "₹50,000/year"), empty string if none'),
  min_cgpa: z.number().describe('Minimum CGPA required (0 if not specified)'),
  keywords: z.array(z.string()).describe('Array of skill/domain keywords required'),
  requires_financial_need: z.boolean().describe('Whether financial need is required for this opportunity'),
  location: z.string().describe('Location or "Remote" or "Any"'),
  description: z.string().describe('2-3 sentence summary of the opportunity'),
  apply_link: z.string().nullable().describe('Application URL or email address, or null if not found'),
  required_documents: z.array(z.string()).describe('List of documents required to apply, e.g. ["Transcript", "Recommendation Letter", "SOP"]'),
  source_text: z.string().describe('The most critical 3-4 lines from the email containing deadline, stipend, and eligibility info'),
  is_spam: z.boolean().describe('True if this is a promotional/spam/scam email unrelated to educational opportunities'),
});

const ExtractionResultSchema = z.object({
  opportunities: z.array(OpportunitySchema),
});

const ExtractRequestSchema = z.object({
  emailText: z.string().trim().min(1).max(50000),
});

export async function POST(req: NextRequest) {
  try {
    let data: unknown;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
    }

    const body = ExtractRequestSchema.safeParse(data);
    if (!body.success) {
      return NextResponse.json({ error: 'No email text provided or payload is invalid' }, { status: 400 });
    }

    const { emailText } = body.data;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to .env.local' },
        { status: 503 }
      );
    }

    const { object } = await generateObject({
      model: google('gemini-1.5-flash-8b'),
      schema: ExtractionResultSchema,
      prompt: `You are an expert opportunity extractor for a student platform. Analyze the following batch of emails and extract ALL opportunities (scholarships, internships, fellowships, competitions, grants).

For each opportunity:
- Extract the exact deadline as an ISO 8601 date (e.g., "2024-12-15T23:59:00.000Z"). If the year is not specified, assume 2025.
- Extract stipend/compensation as a formatted string.
- Set is_spam=true for promotional deals, lucky draws, shopping sales, or any non-educational content.
- Set requires_financial_need=true only if the opportunity explicitly requires or gives preference to financially disadvantaged students.
- The source_text field MUST contain the exact verbatim lines from the email that mention deadline, stipend, and CGPA requirement.
- Extract keywords as specific skill names (e.g., "Python", "Machine Learning", not "coding skills").

Email batch:
---
${emailText}
---

Extract every opportunity you find. Include spam emails as single entries with is_spam=true.`,
    });

    return NextResponse.json({ opportunities: object.opportunities });
  } catch (error) {
    console.error('Extraction error:', error instanceof Error ? error.message : 'unknown error');
    const message = error instanceof Error ? error.message : 'Extraction failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
