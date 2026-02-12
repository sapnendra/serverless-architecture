export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export const API_ENDPOINTS = {
  health: "/health",
  feedback: "/feedback",
  admin: {
    pending: "/admin/feedback/pending",
    approve: (id: string) => `/admin/feedback/${id}/approve`,
    reject: (id: string) => `/admin/feedback/${id}/reject`,
  },
} as const;

export const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";
