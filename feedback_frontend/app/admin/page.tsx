import { Suspense } from "react";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { AdminTable } from "@/components/admin/AdminTable";
import { API_BASE_URL, ADMIN_API_KEY } from "@/config/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

async function PendingFeedback() {
  // Fetch directly from backend on server-side (more efficient)
  const response = await fetch(`${API_BASE_URL}/admin/feedback/pending`, {
    headers: {
      "X-API-Key": ADMIN_API_KEY,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load pending feedback. Please check your API configuration.
      </div>
    );
  }

  const data = await response.json();

  if (!data.success || !data.data) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load pending feedback. Please check your API configuration.
      </div>
    );
  }

  return <AdminTable initialFeedback={data.data} />;
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <Container>
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <PageHeader
          title="Admin Dashboard"
          description="Review and moderate pending feedback submissions."
        />

        <Suspense fallback={<LoadingState message="Loading pending feedback..." />}>
          <PendingFeedback />
        </Suspense>
      </Container>
    </main>
  );
}
