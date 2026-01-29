'use client';

import Link from 'next/link';
import { Document } from '@/types/document';

interface DocumentViewerProps {
  document: Document;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  const typeConfig = {
    journal: { icon: '📓', label: 'Journal', path: '/journals' },
    concept: { icon: '💡', label: 'Concept', path: '/concepts' },
    project: { icon: '🚀', label: 'Project', path: '/projects' },
    note: { icon: '📝', label: 'Note', path: '/notes' },
  };

  const config = typeConfig[document.type];

  // Simple markdown to HTML conversion for the mock
  const htmlContent = parseMarkdown(document.content);

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-6">
        <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
        <span>/</span>
        <Link href={config.path} className="hover:text-[hsl(var(--foreground))]">{config.label}s</Link>
        <span>/</span>
        <span className="text-[hsl(var(--foreground))]">{document.title}</span>
      </div>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{config.icon}</span>
          <h1 className="text-3xl font-bold">{document.title}</h1>
        </div>
        
        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          <span>
            Created {document.createdAt.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
          <span>·</span>
          <span>
            Updated {document.updatedAt.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {document.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <article 
        className="prose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[hsl(var(--border))]">
        <Link 
          href={config.path}
          className="text-sm text-[hsl(var(--accent))] hover:underline"
        >
          ← Back to {config.label}s
        </Link>
      </footer>
    </div>
  );
}

// Simple markdown parser for demo purposes
function parseMarkdown(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/g, '');
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // Checkboxes
    .replace(/^\- \[x\] (.*$)/gim, '<li>✅ $1</li>')
    .replace(/^\- \[ \] (.*$)/gim, '<li>☐ $1</li>')
    // Wrap consecutive li in ul
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|u|p|l|o|b])(.+)$/gim, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hulo])/g, '$1')
    .replace(/(<\/[hulo][^>]*>)<\/p>/g, '$1');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
