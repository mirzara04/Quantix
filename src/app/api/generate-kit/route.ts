import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const KitSchema = z.object({
  cover_letter: z.string().describe('A tailored, professional cover letter (400-600 words)'),
  resume_keywords: z.array(z.string()).describe('10-15 ATS keywords extracted from the opportunity requirements'),
  document_checklist: z.array(z.string()).describe('Step-by-step action plan and document checklist items'),
});

export async function POST(req: NextRequest) {
  try {
    const { opportunity, profile } = await req.json();

    if (!opportunity || !profile) {
      return NextResponse.json({ error: 'Missing opportunity or profile' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 503 }
      );
    }

    const { object } = await generateObject({
      model: google('gemini-1.5-flash-8b'),
      schema: KitSchema,
      prompt: `You are an expert career advisor helping a student apply for an opportunity. Generate a complete application kit.

STUDENT PROFILE:
- Name: ${profile.name}
- Degree: ${profile.degree}, Semester ${profile.semester}
- CGPA: ${profile.cgpa}/10.0
- Skills: ${profile.skills.join(', ')}
- Financial Need: ${profile.financial_need ? 'Yes' : 'No'}
- Location Preference: ${profile.location_preference}

OPPORTUNITY:
- Title: ${opportunity.title}
- Organization: ${opportunity.organization}
- Type: ${opportunity.type}
- Deadline: ${opportunity.deadline || 'Not specified'}
- Stipend: ${opportunity.stipend || 'Not specified'}
- Min CGPA: ${opportunity.min_cgpa || 'None'}
- Required Skills: ${opportunity.keywords?.join(', ') || 'None specified'}
- Financial Need Required: ${opportunity.requires_financial_need ? 'Yes' : 'No'}
- Description: ${opportunity.description}

Generate:
1. cover_letter: A professional, personalized cover letter addressed to the selection committee. Reference specific skills that match the opportunity. If financial need is relevant, mention it naturally. Use today's date. Sign off with the student's name and details.
2. resume_keywords: ATS-optimized keywords from the opportunity description that the student should include in their resume.
3. document_checklist: A numbered step-by-step action plan. Start with "Step 1: ...", "Step 2: ..." etc. Include where to get each document (e.g., "Get official transcripts from the Registrar's office"). Include 8-12 steps covering all required documents and submission steps.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('Kit generation error:', error);
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
