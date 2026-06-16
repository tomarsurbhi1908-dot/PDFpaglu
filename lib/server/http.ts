import { NextResponse } from 'next/server';

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof value === 'object' && value !== null && 'arrayBuffer' in value && 'name' in value;
}

export function assertMaxSize(file: File, maxMb = 50) {
  const max = maxMb * 1024 * 1024;
  if (file.size > max) {
    throw new Error(`File is too large. Max allowed size is ${maxMb} MB.`);
  }
}

export function assertMime(file: File, allowed: string[], label: string) {
  const name = file.name.toLowerCase();
  const matches = allowed.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    return file.type === rule;
  });

  if (!matches) {
    throw new Error(`Invalid file type. Please upload ${label}.`);
  }
}
