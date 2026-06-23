import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTool, tools } from '@/lib/tools';
import { BrandMark } from '@/components/brand-mark';
import { SiteHeader } from '@/components/site-header';
import ToolClient from './tool-client';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const title = tool.seoTitle || tool.title;
  const description = tool.longDescription || tool.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} - PDFpaglu`,
      description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  // Generate JSON-LD Structured Data
  const jsonLdSoftware = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.longDescription || tool.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  const jsonLdFaq = tool.faqs && tool.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  return (
    <main className="min-h-screen text-slate-900 bg-slate-50">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      <SiteHeader ctaHref="/#tools" ctaLabel="All tools" />

      <div className="mx-auto max-w-5xl px-6 pt-10 pb-20">

        <section className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 font-medium">
            {tool.badge}
          </div>
          <h1 className="text-4xl font-black sm:text-6xl text-slate-900">{tool.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{tool.description}</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Files are used only for this conversion and cleared automatically after 1 hour.
          </p>
        </section>

        <ToolClient tool={tool} />

        {/* SEO Content Section */}
        <section className="mt-20 max-w-3xl mx-auto space-y-16">
          {tool.longDescription && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About {tool.title}</h2>
              <p className="text-slate-600 leading-relaxed">{tool.longDescription}</p>
            </div>
          )}

          {tool.howToGuide && tool.howToGuide.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How to {tool.title}</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {tool.howToGuide.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tool.faqs && tool.faqs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {tool.faqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>

      <footer id="privacy" className="mx-auto max-w-5xl border-t border-slate-200 pt-8 pb-6 px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark size="sm" />
            <span className="text-sm font-bold text-slate-900">PDFpaglu</span>
          </Link>
          <p className="text-sm text-slate-500 text-center">
            Your files are automatically deleted after 1 hour. We never store or share your data.
          </p>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} PDFpaglu</p>
        </div>
      </footer>
    </main>
  );
}
