export interface Feedback {
  id: string;
  name: string;
  message: string;
  status?: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  results?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface SubmitFeedbackRequest {
  name: string;
  message: string;
}

export interface SubmitFeedbackResponse {
  id: string;
  status: string;
}
