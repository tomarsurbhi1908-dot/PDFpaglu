import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTool, tools } from '@/lib/tools';
import ToolClient from './tool-client';

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  return (
    <main className="min-h-screen px-6 py-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-slate-600 transition hover:text-slate-900">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-lg font-black text-white shadow-glow">P</div>
            <span className="font-bold text-slate-900">PDFPilot</span>
          </Link>
          <Link href="/#tools" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50">
            All tools
          </Link>
        </header>

        <section className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 font-medium">
            {tool.badge}
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-slate-900">{tool.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{tool.description}</p>
        </section>

        <ToolClient tool={tool} />
      </div>
    </main>
  );
}
