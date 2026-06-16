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
    <main className="min-h-screen px-6 py-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-slate-200 transition hover:text-white">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-lg font-black text-slate-950">P</div>
            <span className="font-bold">PDFPilot</span>
          </Link>
          <Link href="/#tools" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            All tools
          </Link>
        </header>

        <section className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-100">
            {tool.badge}
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{tool.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">{tool.description}</p>
        </section>

        <ToolClient tool={tool} />
      </div>
    </main>
  );
}
