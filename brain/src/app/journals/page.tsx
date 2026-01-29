import DocumentList from '@/components/DocumentList';
import { getDocumentsByType } from '@/lib/mock-data';

export default function JournalsPage() {
  const journals = getDocumentsByType('journal').sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <DocumentList
      documents={journals}
      type="journal"
      title="Journals"
      icon="📓"
      description="Daily logs and session notes"
    />
  );
}
