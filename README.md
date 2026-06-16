# PDFPilot — PDF Tools Website

A premium PDF conversion website starter built with Next.js, TypeScript, Tailwind CSS and server-side conversion routes.

## Included tools

- Merge PDF
- Split PDF by page ranges
- Image to PDF for JPG/PNG
- Compress PDF using Ghostscript
- Word to PDF using LibreOffice headless
- PDF to Word using Python + pdf2docx, experimental

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## System dependencies for heavy conversions

Merge PDF, Split PDF and Image to PDF work with the Node dependency `pdf-lib`.

For Compress PDF, install Ghostscript:

```bash
# macOS
brew install ghostscript

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y ghostscript
```

For Word to PDF, install LibreOffice:

```bash
# macOS
brew install --cask libreoffice

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y libreoffice
```

For PDF to Word, install Python dependency:

```bash
pip install pdf2docx
```

Optional environment variables:

```bash
GS_BINARY=gs
LIBREOFFICE_BINARY=soffice
PYTHON_BINARY=python3
PDF_TOOLS_TMP_DIR=.tmp
```

On macOS, if `soffice` is not found, use:

```bash
LIBREOFFICE_BINARY=/Applications/LibreOffice.app/Contents/MacOS/soffice npm run dev
```

## Routes

Frontend pages:

```text
/
/tools/merge-pdf
/tools/split-pdf
/tools/image-to-pdf
/tools/compress-pdf
/tools/word-to-pdf
/tools/pdf-to-word
```

API routes:

```text
POST /api/tools/merge-pdf
POST /api/tools/split-pdf
POST /api/tools/image-to-pdf
POST /api/tools/compress-pdf
POST /api/tools/word-to-pdf
POST /api/tools/pdf-to-word
GET  /api/download/[jobId]/[filename]
```

## File privacy

Uploaded and converted files are stored temporarily in `.tmp` by default. The app cleans old jobs opportunistically when a new conversion request arrives.

For production, you should add:

- Authentication if needed
- Rate limiting
- Better job queue for large files
- Virus scanning
- A cron cleanup job
- Cloud object storage with short expiry links
- Worker containers for LibreOffice/Ghostscript conversions

## Important notes

PDF to Word conversion is never perfect because PDF is a fixed-layout format. Keep it marked experimental unless you use a more advanced commercial conversion engine.

## Deployment recommendation

Do not deploy LibreOffice/Ghostscript conversions to a tiny serverless function. Use Docker or a VPS/container worker.

