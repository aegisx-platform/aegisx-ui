// Import and re-export types from schemas for convenience
import {
  type Books,
  type CreateBooks,
  type UpdateBooks,
  type BooksIdParam,
  type GetBooksQuery,
  type ListBooksQuery,
  type BooksCreatedEvent,
  type BooksUpdatedEvent,
  type BooksDeletedEvent,
} from '../schemas/books.schemas';

export {
  type Books,
  type CreateBooks,
  type UpdateBooks,
  type BooksIdParam,
  type GetBooksQuery,
  type ListBooksQuery,
  type BooksCreatedEvent,
  type BooksUpdatedEvent,
  type BooksDeletedEvent,
};

// Additional type definitions
export interface BooksRepository {
  create(data: CreateBooks): Promise<Books>;
  findById(id: number | string): Promise<Books | null>;
  findMany(query: ListBooksQuery): Promise<{
    data: Books[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(id: number | string, data: UpdateBooks): Promise<Books | null>;
  delete(id: number | string): Promise<boolean>;
}

// Real-time event type definitions
export interface BooksEventHandlers {
  onCreated?: (data: Books) => void | Promise<void>;
  onUpdated?: (data: Books) => void | Promise<void>;
  onDeleted?: (data: { id: number | string }) => void | Promise<void>;
}

export interface BooksWebSocketSubscription {
  subscribe(handlers: BooksEventHandlers): void;
  unsubscribe(): void;
}

// Database entity type (matches database table structure exactly)
export interface BooksEntity {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  isbn: string | null;
  pages: number | null;
  published_date: Date | null;
  price: number | null;
  genre: string | null;
  available: boolean | null;
  created_at: Date;
  updated_at: Date;
}
