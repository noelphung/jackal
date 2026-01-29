export type DocumentType = 'journal' | 'concept' | 'project' | 'note';

export interface Document {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: DocumentType;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentMeta {
  id: string;
  slug: string;
  title: string;
  type: DocumentType;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
