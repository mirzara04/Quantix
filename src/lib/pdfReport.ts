import { Opportunity, StudentProfile } from './types';

const encoder = new TextEncoder();

function toBytes(value: string): Uint8Array {
  return encoder.encode(value);
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function escapePdfText(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function chunkLines(lines: string[], pageSize: number): string[][] {
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += pageSize) {
    pages.push(lines.slice(i, i + pageSize));
  }
  return pages.length > 0 ? pages : [[]];
}

function buildPdfFromLines(lines: string[]): Uint8Array {
  const pageLines = chunkLines(lines, 42);
  const objectCount = 3 + pageLines.length * 2;
  const objects: Uint8Array[] = new Array(objectCount);

  const pageRefs: string[] = [];
  const firstPageObjectId = 4;

  const setObject = (id: number, content: string) => {
    objects[id - 1] = toBytes(`${id} 0 obj\n${content}\nendobj\n`);
  };

  for (let i = 0; i < pageLines.length; i++) {
    const pageObjectId = firstPageObjectId + i * 2;
    const contentObjectId = pageObjectId + 1;
    pageRefs.push(`${pageObjectId} 0 R`);

    const contentLines = pageLines[i]
      .map((line) => `(${escapePdfText(line)}) Tj`)
      .join(' T*\n');

    const stream = `BT\n/F1 10 Tf\n50 790 Td\n14 TL\n${contentLines}\nET`;
    const streamBytes = toBytes(stream);

    setObject(
      pageObjectId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`
    );

    setObject(
      contentObjectId,
      `<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream`
    );
  }

  setObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
  setObject(2, `<< /Type /Pages /Count ${pageLines.length} /Kids [${pageRefs.join(' ')}] >>`);
  setObject(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  for (let i = 0; i < objects.length; i++) {
    if (!objects[i]) {
      setObject(i + 1, '<< >>');
    }
  }

  const headerBytes = toBytes('%PDF-1.4\n');
  const offsets: number[] = [0];
  let runningOffset = headerBytes.length;
  for (const obj of objects) {
    offsets.push(runningOffset);
    runningOffset += obj.length;
  }

  const xrefStart = runningOffset;
  const xrefString = [`xref\n0 ${objects.length + 1}\n`, '0000000000 65535 f \n']
    .concat(offsets.slice(1).map((n) => `${n.toString().padStart(10, '0')} 00000 n \n`))
    .join('');

  const trailerBytes = toBytes(
    `${xrefString}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  );

  return concatBytes([headerBytes, ...objects, trailerBytes]);
}

function buildReportLines(profile: StudentProfile, opportunities: Opportunity[]): string[] {
  const ranked = [...opportunities]
    .filter((o) => !o.is_spam)
    .sort((a, b) => b.score - a.score);

  const lines: string[] = [];
  lines.push('Opportunity Radar - Ranked Report');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('');
  lines.push('Profile Snapshot');
  lines.push(`Name: ${profile.name}`);
  lines.push(`Degree: ${profile.degree}`);
  lines.push(`Semester: ${profile.semester}`);
  lines.push(`CGPA: ${profile.cgpa.toFixed(1)} / 10.0`);
  lines.push(`Skills: ${profile.skills.join(', ') || 'None'}`);
  lines.push(`Financial Need: ${profile.financial_need ? 'Yes' : 'No'}`);
  lines.push(`Location Preference: ${profile.location_preference}`);
  lines.push('');
  lines.push(`Ranked Opportunities (${ranked.length})`);
  lines.push('');

  ranked.forEach((opp, index) => {
    const breakdown = opp.score_breakdown ?? null;
    lines.push(`${index + 1}. ${opp.title} (${opp.organization})`);
    lines.push(`   Score: ${opp.score} | Type: ${opp.type} | Deadline: ${opp.deadline ?? 'Not specified'}`);
    lines.push(`   Why: ${opp.rank_reason || 'No reason available'}`);
    lines.push(
      `   Breakdown - Urgency: ${breakdown?.urgency ?? 'N/A'}, Fit: ${breakdown?.fit ?? 'N/A'}, Status: ${breakdown?.status ?? 'N/A'}, Completeness: ${breakdown?.completeness ?? 'N/A'}`
    );
    lines.push(`   Checklist: ${(opp.required_documents && opp.required_documents.length > 0 ? opp.required_documents : ['Resume', 'Transcript', 'Application form']).join('; ')}`);
    lines.push('');
  });

  return lines;
}

export function downloadRankedReportPdf(profile: StudentProfile, opportunities: Opportunity[]): void {
  const lines = buildReportLines(profile, opportunities);
  const pdfBytes = buildPdfFromLines(lines);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `opportunity-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}
