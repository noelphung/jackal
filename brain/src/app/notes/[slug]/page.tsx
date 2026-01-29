import { notFound } from 'next/navigation';
import DocumentViewer from '@/components/DocumentViewer';
import { getDocumentBySlug, getDocumentsByType } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);

  if (!document || document.type !== 'note') {
    notFound();
  }

  return <DocumentViewer document={document} />;
}

export async function generateStaticParams() {
  const notes = getDocumentsByType('note');
  return notes.map((doc) => ({
    slug: doc.slug,
  }));
}
