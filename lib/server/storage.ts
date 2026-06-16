import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.env.PDF_TOOLS_TMP_DIR || path.join(process.cwd(), '.tmp');
export const UPLOAD_ROOT = path.join(ROOT, 'uploads');
export const OUTPUT_ROOT = path.join(ROOT, 'outputs');

export function createJobId() {
  return crypto.randomBytes(12).toString('hex');
}

export function safeFileName(name: string) {
  const clean = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 120);

  return clean || `file-${Date.now()}`;
}

export function assertSafeSegment(value: string) {
  if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
    throw new Error('Unsafe file path segment');
  }
}

export async function ensureBaseDirs() {
  await mkdir(UPLOAD_ROOT, { recursive: true });
  await mkdir(OUTPUT_ROOT, { recursive: true });
}

export async function createJobDirs(jobId: string) {
  assertSafeSegment(jobId);
  const uploadDir = path.join(UPLOAD_ROOT, jobId);
  const outputDir = path.join(OUTPUT_ROOT, jobId);
  await mkdir(uploadDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });
  return { uploadDir, outputDir };
}

export async function saveUploadedFile(file: File, directory: string) {
  const name = safeFileName(file.name);
  const target = path.join(directory, name);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(target, bytes);
  return { path: target, name, size: bytes.length, type: file.type };
}

export function outputPath(jobId: string, filename: string) {
  assertSafeSegment(jobId);
  const safe = safeFileName(filename);
  return path.join(OUTPUT_ROOT, jobId, safe);
}

export function downloadUrl(jobId: string, filename: string) {
  return `/api/download/${encodeURIComponent(jobId)}/${encodeURIComponent(safeFileName(filename))}`;
}

export async function cleanupOldJobs(maxAgeMs = 60 * 60 * 1000) {
  await ensureBaseDirs();
  const now = Date.now();

  for (const root of [UPLOAD_ROOT, OUTPUT_ROOT]) {
    const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
    await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const fullPath = path.join(root, entry.name);
          const info = await stat(fullPath).catch(() => null);
          if (info && now - info.mtimeMs > maxAgeMs) {
            await rm(fullPath, { recursive: true, force: true });
          }
        })
    );
  }
}
