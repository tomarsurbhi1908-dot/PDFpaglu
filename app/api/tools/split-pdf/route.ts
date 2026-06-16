import { PDFDocument } from 'pdf-lib';
import { NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import { assertMaxSize, assertMime, isUploadFile, jsonError } from '@/lib/server/http';
import { parsePageRanges } from '@/lib/server/ranges';
import { cleanupOldJobs, createJobDirs, createJobId, downloadUrl, ensureBaseDirs, outputPath } from '@/lib/server/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureBaseDirs();
    await cleanupOldJobs();

    const formData = await request.formData();
    const file = formData.get('file');
    const ranges = String(formData.get('ranges') || '1');

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    assertMaxSize(file, 50);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const pageIndices = parsePageRanges(ranges, source.getPageCount());

    const output = await PDFDocument.create();
    const copiedPages = await output.copyPages(source, pageIndices);
    copiedPages.forEach((page) => output.addPage(page));

    const jobId = createJobId();
    await createJobDirs(jobId);
    const filename = 'split.pdf';
    await writeFile(outputPath(jobId, filename), Buffer.from(await output.save()));

    return NextResponse.json({
      ok: true,
      filename,
      downloadUrl: downloadUrl(jobId, filename),
      message: `Extracted ${pageIndices.length} page(s).`
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to split PDF.', 500);
  }
}
