'use client';

import Link from 'next/link';
import { DocumentMeta, DocumentType } from '@/types/document';

interface DocumentListProps {
  documents: DocumentMeta[];
  type: DocumentType;
  title: string;
  icon: string;
  description: string;
}

export default function DocumentList({ documents, type, title, icon, description }: DocumentListProps) {
  const basePath = `/${type}s`;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <p className="text-[hsl(var(--muted-foreground))]">{description}</p>
      </div>

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
          <span className="text-4xl mb-4 block">{icon}</span>
          <p>No {type}s yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`${basePath}/${doc.slug}`}
              className="block p-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg hover:border-[hsl(var(--accent))] transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg group-hover:text-[hsl(var(--accent))] transition-colors">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {doc.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-[hsl(var(--background))] rounded-full text-[hsl(var(--muted-foreground))]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  {doc.updatedAt.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: doc.updatedAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
