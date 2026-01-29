import { notFound } from 'next/navigation';
import DocumentViewer from '@/components/DocumentViewer';
import { getDocumentBySlug, getDocumentsByType } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);

  if (!document || document.type !== 'project') {
    notFound();
  }

  return <DocumentViewer document={document} />;
}

export async function generateStaticParams() {
  const projects = getDocumentsByType('project');
  return projects.map((doc) => ({
    slug: doc.slug,
  }));
}
