import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { rename, readdir } from 'node:fs/promises';
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

    if (!isUploadFile(file)) return jsonError('Please upload one DOC or DOCX file.');
    assertMaxSize(file, 50);
    assertMime(
      file,
      [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.doc',
        '.docx'
      ],
      'DOC or DOCX file'
    );

    const jobId = createJobId();
    const { uploadDir, outputDir } = await createJobDirs(jobId);
    const input = await saveUploadedFile(file, uploadDir);

    const binary = process.env.LIBREOFFICE_BINARY || 'soffice';
    const args = ['--headless', '--convert-to', 'pdf', '--outdir', outputDir, input.path];

    try {
      await run(binary, args, { timeout: 120000, maxBuffer: 1024 * 1024 * 20 });
    } catch {
      return jsonError('LibreOffice is not installed or not available. Install it or set LIBREOFFICE_BINARY.', 500);
    }

    const files = await readdir(outputDir);
    const generated = files.find((name) => name.toLowerCase().endsWith('.pdf'));
    if (!generated) return jsonError('LibreOffice did not generate a PDF.', 500);

    const filename = 'converted.pdf';
    if (generated !== filename) {
      await rename(path.join(outputDir, generated), outputPath(jobId, filename));
    }

    return NextResponse.json({
      ok: true,
      filename,
      downloadUrl: downloadUrl(jobId, filename),
      message: 'Word file converted to PDF successfully.'
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to convert Word to PDF.', 500);
  }
}
