import DocumentList from '@/components/DocumentList';
import { getDocumentsByType } from '@/lib/mock-data';

export default function ConceptsPage() {
  const concepts = getDocumentsByType('concept').sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <DocumentList
      documents={concepts}
      type="concept"
      title="Concepts"
      icon="💡"
      description="Ideas, philosophies, and mental models"
    />
  );
}
