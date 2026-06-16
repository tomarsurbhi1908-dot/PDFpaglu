import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { assertMaxSize, assertMime, isUploadFile, jsonError } from '@/lib/server/http';
import { cleanupOldJobs, createJobDirs, createJobId, downloadUrl, ensureBaseDirs, outputPath, saveUploadedFile } from '@/lib/server/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const run = promisify(execFile);

export async function POST(request: Request) {
  try {
    await ensureBaseDirs();
    await cleanupOldJobs();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    assertMaxSize(file, 50);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const jobId = createJobId();
    const { uploadDir } = await createJobDirs(jobId);
    const input = await saveUploadedFile(file, uploadDir);
    const filename = 'converted.docx';
    const output = outputPath(jobId, filename);

    const python = process.env.PYTHON_BINARY || 'python3';
    const script = path.join(process.cwd(), 'scripts', 'pdf_to_docx.py');

    try {
      await run(python, [script, input.path, output], { timeout: 120000, maxBuffer: 1024 * 1024 * 20 });
    } catch {
      return jsonError('PDF to Word needs Python and pdf2docx installed. Run: pip install pdf2docx', 500);
    }

    return NextResponse.json({
      ok: true,
      filename,
      downloadUrl: downloadUrl(jobId, filename),
      message: 'PDF converted to DOCX. Please review layout after download.'
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to convert PDF to Word.', 500);
  }
}
