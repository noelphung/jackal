import DocumentList from '@/components/DocumentList';
import { getDocumentsByType } from '@/lib/mock-data';

export default function ProjectsPage() {
  const projects = getDocumentsByType('project').sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <DocumentList
      documents={projects}
      type="project"
      title="Projects"
      icon="🚀"
      description="Work in progress and completed projects"
    />
  );
}
