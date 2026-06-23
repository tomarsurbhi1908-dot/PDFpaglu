import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { OUTPUT_ROOT, assertSafeSegment, safeFileName } from '@/lib/server/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string; filename: string }> }
) {
  try {
    const { jobId: rawJobId, filename: rawFilename } = await params;
    const jobId = rawJobId;
    const filename = safeFileName(rawFilename);
    assertSafeSegment(jobId);
    assertSafeSegment(filename);

    const filePath = path.join(OUTPUT_ROOT, jobId, filename);
    await stat(filePath);
    const file = await readFile(filePath);
    const body = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    const ext = path.extname(filename).toLowerCase();

    return new NextResponse(body, {
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store'
      }
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'File not found or expired.' }, { status: 404 });
  }
}
