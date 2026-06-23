import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';

type SiteHeaderProps = {
  toolsHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteHeader({
  toolsHref = '/#tools',
  ctaHref = '/tools/merge-pdf',
  ctaLabel = 'Start now',
}: SiteHeaderProps) {
  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <header className="w-full max-w-6xl rounded-2xl border border-white/60 bg-white/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15),_0_2px_6px_rgba(0,0,0,0.05),_inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-slate-900/5 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
            <BrandMark size="sm" />
            <span className="truncate text-xl font-black tracking-tight text-slate-800" style={{ textShadow: '1px 1px 0px #cbd5e1, 2px 2px 0px #94a3b8' }}>
              PDFpaglu
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            <Link href={toolsHref} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              Tools
            </Link>
            <Link href="/tools/merge-pdf" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              Merge
            </Link>
            <Link href="/tools/compress-pdf" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              Compress
            </Link>
            <Link href="/tools/pdf-to-word" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              Convert
            </Link>
          </nav>

          <Link
            href={ctaHref}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.05),_0_1px_1px_rgba(0,0,0,0.05),_inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.1),_0_2px_5px_rgba(0,0,0,0.05)] active:translate-y-0 active:shadow-sm sm:px-5"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </header>
    </div>
  );
}
