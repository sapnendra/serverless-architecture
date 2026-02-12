import { API_BASE_URL, API_ENDPOINTS, ADMIN_API_KEY } from "@/config/api";
import type {
  ApiResponse,
  Feedback,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
} from "@/types/feedback";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      // Use relative URL for Next.js API routes, absolute for backend
      const url = endpoint.startsWith('/api/') 
        ? endpoint 
        : `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  // Public endpoints
  async getApprovedFeedback(): Promise<ApiResponse<Feedback[]>> {
    return this.request<Feedback[]>(API_ENDPOINTS.feedback, {
      cache: "no-store",
    });
  }

  async submitFeedback(
    data: SubmitFeedbackRequest
  ): Promise<ApiResponse<SubmitFeedbackResponse>> {
    return this.request<SubmitFeedbackResponse>(API_ENDPOINTS.feedback, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints (using Next.js API routes for server-side API key)
  async getPendingFeedback(): Promise<ApiResponse<Feedback[]>> {
    return this.request<Feedback[]>("/api/admin/feedback/pending", {
      cache: "no-store",
    });
  }

  async approveFeedback(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/admin/feedback/${id}/approve`, {
      method: "PATCH",
    });
  }

  async rejectFeedback(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/admin/feedback/${id}/reject`, {
      method: "PATCH",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
