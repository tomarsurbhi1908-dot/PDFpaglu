import sys
from pathlib import Path

try:
    from pdf2docx import Converter
except Exception as exc:
    print(f"pdf2docx import failed: {exc}", file=sys.stderr)
    sys.exit(2)

if len(sys.argv) != 3:
    print("Usage: pdf_to_docx.py input.pdf output.docx", file=sys.stderr)
    sys.exit(1)

input_pdf = Path(sys.argv[1])
output_docx = Path(sys.argv[2])
output_docx.parent.mkdir(parents=True, exist_ok=True)

converter = Converter(str(input_pdf))
try:
    converter.convert(str(output_docx), start=0, end=None)
finally:
    converter.close()
