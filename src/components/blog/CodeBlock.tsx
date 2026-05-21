interface CodeBlockProps {
  code: string;
  language?: string;
}

/**
 * CodeBlock component with syntax highlighting using brand colors.
 * Renders a styled <pre><code> block with language label.
 */
export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="relative my-6 rounded-lg border border-brand-surface overflow-hidden">
      {language && (
        <div className="flex items-center justify-between bg-brand-surface/80 px-4 py-2 border-b border-brand-surface">
          <span className="text-xs font-code text-brand-text/60 uppercase tracking-wide">
            {language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto bg-brand-background p-4">
        <code className="text-sm font-code text-brand-text/90 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}
