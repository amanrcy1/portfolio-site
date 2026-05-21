import { notFound } from 'next/navigation';
import { getCaseStudySlugs, getCaseStudyBySlug } from '@/lib/content-loader';
import RepoLink from '@/components/shared/RepoLink';
import MetricBadge from '@/components/case-studies/MetricBadge';

export function generateStaticParams() {
  const slugs = getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Renders markdown content to HTML.
 * Handles headings, bold, italic, inline code, code blocks, lists, and paragraphs.
 */
function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  let html = '';
  let inCodeBlock = false;
  let codeContent = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre class="overflow-x-auto rounded-lg bg-brand-background border border-brand-surface p-4 my-4"><code class="text-sm text-brand-text/90 font-code">${escapeHtml(codeContent.trim())}</code></pre>`;
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Close list if we hit a non-list line
    if (inList && !line.startsWith('- ') && line.trim() !== '') {
      html += '</ul>';
      inList = false;
    }

    // Headings
    if (line.startsWith('## ')) {
      html += `<h2 class="text-2xl font-heading font-bold text-brand-text mt-10 mb-4">${formatInline(line.slice(3))}</h2>`;
    } else if (line.startsWith('### ')) {
      html += `<h3 class="text-xl font-heading font-semibold text-brand-text mt-8 mb-3">${formatInline(line.slice(4))}</h3>`;
    } else if (line.startsWith('- **')) {
      // List item with bold
      if (!inList) {
        html += '<ul class="space-y-2 my-4 ml-4">';
        inList = true;
      }
      html += `<li class="text-brand-text/80 leading-relaxed list-disc list-outside">${formatInline(line.slice(2))}</li>`;
    } else if (line.startsWith('- ')) {
      // Plain list item
      if (!inList) {
        html += '<ul class="space-y-2 my-4 ml-4">';
        inList = true;
      }
      html += `<li class="text-brand-text/80 leading-relaxed list-disc list-outside">${formatInline(line.slice(2))}</li>`;
    } else if (line.trim() === '') {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    } else {
      // Paragraph
      html += `<p class="text-brand-text/80 leading-relaxed my-4">${formatInline(line)}</p>`;
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatInline(text: string): string {
  // Bold
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-brand-text">$1</strong>');
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  result = result.replace(/`(.+?)`/g, '<code class="rounded bg-brand-background px-1.5 py-0.5 text-sm font-code text-brand-accent">$1</code>');
  return result;
}

interface PageProps {
  params: { slug: string };
}

export default function CaseStudyDetailPage({ params }: PageProps) {
  const caseStudy = getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    notFound();
  }

  const { frontmatter, content } = caseStudy;
  const renderedContent = renderMarkdownToHtml(content);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-heading font-bold text-brand-text sm:text-4xl">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-lg text-brand-text/70">{frontmatter.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <MetricBadge
            label={frontmatter.primaryMetric.label}
            before={frontmatter.primaryMetric.before}
            after={frontmatter.primaryMetric.after}
            unit={frontmatter.primaryMetric.unit}
          />
          <time
            className="text-sm text-brand-text/50"
            dateTime={frontmatter.publishedDate}
          >
            {new Date(frontmatter.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <div className="mt-6">
          <RepoLink url={frontmatter.repoUrl} />
        </div>
      </header>

      {/* MDX Content */}
      <article
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      {/* Tools Used */}
      <section className="mt-12 border-t border-brand-surface pt-8">
        <h2 className="text-lg font-heading font-semibold text-brand-text mb-4">
          Tools Used
        </h2>
        <div className="flex flex-wrap gap-2">
          {frontmatter.toolsUsed.map((tool) => (
            <span
              key={tool}
              className="rounded-full bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 text-xs font-medium text-brand-secondary"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>

      {/* Bottom RepoLink */}
      <section className="mt-10 border-t border-brand-surface pt-8">
        <RepoLink url={frontmatter.repoUrl} label="View Full Repository on GitHub" />
      </section>
    </div>
  );
}
