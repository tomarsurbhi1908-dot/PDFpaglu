import Link from 'next/link';
import { tools } from '@/lib/tools';
import { Combine, Scissors, Image as ImageIcon, Minimize2, FileText, FileEdit, Stamp, Lock, PenTool } from 'lucide-react';

function getToolIcon(slug: string) {
  switch (slug) {
    case 'merge-pdf': return <Combine className="h-6 w-6 text-indigo-500" />;
    case 'split-pdf': return <Scissors className="h-6 w-6 text-emerald-500" />;
    case 'image-to-pdf': return <ImageIcon className="h-6 w-6 text-amber-500" />;
    case 'compress-pdf': return <Minimize2 className="h-6 w-6 text-rose-500" />;
    case 'word-to-pdf': return <FileText className="h-6 w-6 text-blue-500" />;
    case 'pdf-to-word': return <FileEdit className="h-6 w-6 text-sky-500" />;
    case 'watermark-pdf': return <Stamp className="h-6 w-6 text-purple-500" />;
    case 'protect-pdf': return <Lock className="h-6 w-6 text-orange-500" />;
    case 'sign-pdf': return <PenTool className="h-6 w-6 text-pink-500" />;
    default: return <FileText className="h-6 w-6 text-slate-500" />;
  }
}

const features = [
  'Temporary files only',
  'Easy download flow',
  'Clean mobile UI',
  'No paid API required'
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-lg font-black text-white shadow-glow">P</div>
          <span className="text-lg font-bold tracking-tight">PDFPilot</span>
        </Link>
        <a href="#tools" className="rounded-full border border-slate-200 px-5 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
          View tools
        </a>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-16">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
            All-in-one PDF conversion starter
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Merge, convert and download files in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A premium SaaS-style PDF tools website with upload screens, conversion APIs, temporary storage, and ready download links.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tools/merge-pdf" className="rounded-2xl bg-slate-900 px-6 py-3 text-center font-bold text-white transition hover:bg-slate-800">
              Start merging PDFs
            </Link>
            <Link href="/tools/image-to-pdf" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center font-bold text-slate-900 transition hover:bg-slate-50">
              Convert images
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-4">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[3rem] bg-indigo-100 blur-3xl" />
          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm text-slate-500">Current job</p>
                  <p className="font-semibold text-slate-900">invoice-files.pdf</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Ready</span>
              </div>
              <div className="space-y-3">
                {['Upload files', 'Convert securely', 'Download result'].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-black text-white">{index + 1}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{item}</p>
                      <p className="text-sm text-slate-500">Fast tool flow with clean states.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-4 text-center font-black text-white shadow-md">
                Download PDF
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Tools</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-slate-900">Pick a conversion</h2>
          </div>
          <p className="max-w-xl text-slate-600">MVP includes PDF merge, split, image-to-PDF, compression, Word-to-PDF and experimental PDF-to-Word.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-lg font-black border border-slate-100">
                  {getToolIcon(tool.slug)}
                </div>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 bg-slate-50">{tool.badge}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
              <p className="mt-5 text-sm font-bold text-indigo-600 transition group-hover:text-indigo-700">Open tool →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
