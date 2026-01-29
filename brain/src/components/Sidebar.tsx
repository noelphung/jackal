'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAllTags, getRecentDocuments, getStats } from '@/lib/mock-data';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Journals', href: '/journals', icon: '📓' },
  { name: 'Concepts', href: '/concepts', icon: '💡' },
  { name: 'Projects', href: '/projects', icon: '🚀' },
  { name: 'Notes', href: '/notes', icon: '📝' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const recentDocs = getRecentDocuments(4);
  const tags = getAllTags().slice(0, 8);
  const stats = getStats();

  return (
    <aside className="w-64 h-screen bg-[hsl(var(--muted))] border-r border-[hsl(var(--border))] flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="font-semibold text-lg">Second Brain</span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search... ⌘K"
            className="w-full px-3 py-2 text-sm bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = 
              item.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[hsl(var(--accent))] text-white'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {item.name !== 'Dashboard' && (
                  <span className="ml-auto text-xs opacity-60">
                    {item.name === 'Journals' && stats.journals}
                    {item.name === 'Concepts' && stats.concepts}
                    {item.name === 'Projects' && stats.projects}
                    {item.name === 'Notes' && stats.notes}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Recent
          </h3>
          <div className="mt-2 space-y-1">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/${doc.type}s/${doc.slug}`}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background))] rounded-lg transition-colors"
              >
                <span className="text-xs">
                  {doc.type === 'journal' && '📓'}
                  {doc.type === 'concept' && '💡'}
                  {doc.type === 'project' && '🚀'}
                  {doc.type === 'note' && '📝'}
                </span>
                <span className="truncate">{doc.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Tags
          </h3>
          <div className="mt-2 px-3 flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-full text-[hsl(var(--muted-foreground))]"
              >
                #{tag}
                <span className="ml-1 opacity-50">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center justify-between">
          <span>Powered by Jackal 🦊</span>
          <span>{stats.total} docs</span>
        </div>
      </div>
    </aside>
  );
}
