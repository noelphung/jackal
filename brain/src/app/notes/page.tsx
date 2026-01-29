import DocumentList from '@/components/DocumentList';
import { getDocumentsByType } from '@/lib/mock-data';

export default function NotesPage() {
  const notes = getDocumentsByType('note').sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <DocumentList
      documents={notes}
      type="note"
      title="Notes"
      icon="📝"
      description="Quick captures and miscellaneous notes"
    />
  );
}
