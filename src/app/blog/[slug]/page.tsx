import { notFound } from 'next/navigation';
import { getBlogPostSlugs, getBlogPostBySlug } from '@/lib/content-loader';

export function generateStaticParams() {
  const slugs = getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Renders markdown content to HTML with syntax-highlighted code blocks.
 * Handles headings, bold, italic, inline code, code blocks, lists, and paragraphs.
 */
function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  let html = '';
  let inCodeBlock = false;
  let codeContent = '';
  let codeLanguage = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block - render with CodeBlock styling
        const langLabel = codeLanguage
          ? `<div class="flex items-center justify-between bg-[#1E293B]/80 px-4 py-2 border-b border-[#1E293B]"><span class="text-xs font-code text-[#F8FAFC]/60 uppercase tracking-wide">${escapeHtml(codeLanguage)}</span></div>`
          : '';
        html += `<div class="relative my-6 rounded-lg border border-[#1E293B] overflow-hidden">${langLabel}<pre class="overflow-x-auto bg-[#0F172A] p-4"><code class="text-sm font-code text-[#F8FAFC]/90 leading-relaxed">${escapeHtml(codeContent.trim())}</code></pre></div>`;
        codeContent = '';
        codeLanguage = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
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
    } else if (line.startsWith('#### ')) {
      html += `<h4 class="text-lg font-heading font-semibold text-brand-text mt-6 mb-2">${formatInline(line.slice(5))}</h4>`;
    } else if (line.startsWith('- ')) {
      // List item
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
  let result = text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-brand-text">$1</strong>'
  );
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  result = result.replace(
    /`(.+?)`/g,
    '<code class="rounded bg-brand-background px-1.5 py-0.5 text-sm font-code text-brand-accent">$1</code>'
  );
  return result;
}

interface PageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;
  const renderedContent = renderMarkdownToHtml(content);

  const formattedDate = new Date(frontmatter.publishedDate).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const categoryLabels: Record<string, string> = {
    'tool-comparisons': 'Tool Comparisons',
    'lessons-learned': 'Lessons Learned',
    'war-stories': 'War Stories',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-0.5 text-xs font-medium text-brand-primary">
            {categoryLabels[frontmatter.category] || frontmatter.category}
          </span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-brand-text sm:text-4xl">
          {frontmatter.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-brand-text/60">
          <time dateTime={frontmatter.publishedDate}>{formattedDate}</time>
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {frontmatter.readingTimeMinutes} min read
          </span>
        </div>
      </header>

      {/* Article Content */}
      <article
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      {/* Back to Blog */}
      <div className="mt-12 border-t border-brand-surface pt-8">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all articles
        </a>
      </div>
    </div>
  );
}
