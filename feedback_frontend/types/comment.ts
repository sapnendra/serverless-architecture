export interface Comment {
  id: string;
  feedback_id: string;
  parent_comment_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
  replies?: Comment[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
