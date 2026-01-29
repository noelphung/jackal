import { notFound } from 'next/navigation';
import DocumentViewer from '@/components/DocumentViewer';
import { getDocumentBySlug, getDocumentsByType } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalPage({ params }: PageProps) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);

  if (!document || document.type !== 'journal') {
    notFound();
  }

  return <DocumentViewer document={document} />;
}

export async function generateStaticParams() {
  const journals = getDocumentsByType('journal');
  return journals.map((doc) => ({
    slug: doc.slug,
  }));
}
