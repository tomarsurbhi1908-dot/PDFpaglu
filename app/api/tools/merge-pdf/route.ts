import { PDFDocument } from 'pdf-lib';
import { NextResponse } from 'next/server';
import { assertMaxSize, assertMime, isUploadFile, jsonError } from '@/lib/server/http';
import { cleanupOldJobs, createJobDirs, createJobId, downloadUrl, ensureBaseDirs, outputPath } from '@/lib/server/storage';
import { writeFile } from 'node:fs/promises';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureBaseDirs();
    await cleanupOldJobs();

    const formData = await request.formData();
    const files = formData.getAll('files').filter(isUploadFile);

    if (files.length < 2) {
      return jsonError('Upload at least 2 PDF files to merge.');
    }

    files.forEach((file) => {
      assertMaxSize(file, 50);
      assertMime(file, ['application/pdf', '.pdf'], 'PDF files');
    });

    const jobId = createJobId();
    await createJobDirs(jobId);

    const merged = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const copiedPages = await merged.copyPages(source, source.getPageIndices());
      copiedPages.forEach((page) => merged.addPage(page));
    }

    const outputBytes = await merged.save();
    const filename = 'merged.pdf';
    await writeFile(outputPath(jobId, filename), Buffer.from(outputBytes));

    return NextResponse.json({
      ok: true,
      filename,
      downloadUrl: downloadUrl(jobId, filename),
      message: 'PDFs merged successfully.'
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to merge PDFs.', 500);
  }
}
