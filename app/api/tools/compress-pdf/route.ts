import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { assertMaxSize, assertMime, isUploadFile, jsonError } from '@/lib/server/http';
import { cleanupOldJobs, createJobDirs, createJobId, downloadUrl, ensureBaseDirs, outputPath, saveUploadedFile } from '@/lib/server/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const run = promisify(execFile);
const QUALITY_MAP: Record<string, string> = {
  screen: '/screen',
  ebook: '/ebook',
  printer: '/printer',
  prepress: '/prepress'
};

export async function POST(request: Request) {
  try {
    await ensureBaseDirs();
    await cleanupOldJobs();

    const formData = await request.formData();
    const file = formData.get('file');
    const qualityInput = String(formData.get('quality') || 'ebook');
    const quality = QUALITY_MAP[qualityInput] || '/ebook';

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    assertMaxSize(file, 80);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const jobId = createJobId();
    const { uploadDir } = await createJobDirs(jobId);
    const input = await saveUploadedFile(file, uploadDir);
    const filename = 'compressed.pdf';
    const output = outputPath(jobId, filename);

    const binary = process.env.GS_BINARY || 'gs';
    const args = [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=${quality}`,
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${output}`,
      input.path
    ];

    try {
      await run(binary, args, { timeout: 120000, maxBuffer: 1024 * 1024 * 10 });
    } catch {
      return jsonError('Ghostscript is not installed or not available. Install it or set GS_BINARY.', 500);
    }

    return NextResponse.json({
      ok: true,
      filename,
      downloadUrl: downloadUrl(jobId, filename),
      message: 'PDF compressed successfully.'
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to compress PDF.', 500);
  }
}
