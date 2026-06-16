export function parsePageRanges(input: string, totalPages: number) {
  const clean = input.trim() || '1';
  const indices: number[] = [];

  for (const part of clean.split(',')) {
    const chunk = part.trim();
    if (!chunk) continue;

    if (chunk.includes('-')) {
      const [startText, endText] = chunk.split('-');
      const start = Number(startText);
      const end = Number(endText);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
        throw new Error('Invalid page range. Use format like 1-3,5,8-10.');
      }
      for (let page = start; page <= end; page += 1) indices.push(page - 1);
    } else {
      const page = Number(chunk);
      if (!Number.isInteger(page) || page < 1) {
        throw new Error('Invalid page number. Use format like 1-3,5,8-10.');
      }
      indices.push(page - 1);
    }
  }

  const unique = Array.from(new Set(indices));
  if (unique.some((index) => index < 0 || index >= totalPages)) {
    throw new Error(`Page range exceeds PDF length. This PDF has ${totalPages} pages.`);
  }

  return unique;
}
