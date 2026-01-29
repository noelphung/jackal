import Link from 'next/link';
import { getRecentDocuments, getStats, getAllTags } from '@/lib/mock-data';

export default function Dashboard() {
  const recentDocs = getRecentDocuments(6);
  const stats = getStats();
  const tags = getAllTags().slice(0, 12);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">
          Your knowledge base at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📓" label="Journals" value={stats.journals} href="/journals" />
        <StatCard icon="💡" label="Concepts" value={stats.concepts} href="/concepts" />
        <StatCard icon="🚀" label="Projects" value={stats.projects} href="/projects" />
        <StatCard icon="📝" label="Notes" value={stats.notes} href="/notes" />
      </div>

      {/* Recent Documents */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="grid gap-3">
          {recentDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/${doc.type}s/${doc.slug}`}
              className="flex items-center justify-between p-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg hover:border-[hsl(var(--accent))] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {doc.type === 'journal' && '📓'}
                  {doc.type === 'concept' && '💡'}
                  {doc.type === 'project' && '🚀'}
                  {doc.type === 'note' && '📝'}
                </span>
                <div>
                  <h3 className="font-medium group-hover:text-[hsl(var(--accent))] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} · {doc.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
                  </p>
                </div>
              </div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                {formatRelativeDate(doc.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tags Cloud */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg hover:border-[hsl(var(--accent))] transition-colors cursor-pointer"
            >
              #{tag}
              <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))]">{count}</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, href }: { icon: string; label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="p-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg hover:border-[hsl(var(--accent))] transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-[hsl(var(--muted-foreground))]">{label}</div>
        </div>
      </div>
    </Link>
  );
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
