import { Suspense } from "react";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackListWithPagination } from "@/components/feedback/FeedbackListWithPagination";
import { API_BASE_URL } from "@/config/api";

async function ApprovedFeedback() {
  const response = await fetch(`${API_BASE_URL}/feedback?page=1&limit=10`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!data.success) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load feedback. Please try again later.
      </div>
    );
  }

  return (
    <FeedbackListWithPagination
      initialFeedback={data.results || []}
      initialPagination={data.pagination}
    />
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <Container>
        <PageHeader
          title="What you think about Serverless Architecture?"
          description="We value your feedback. Share your thoughts and see what others are saying."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Feedback Form */}
          <div>
            <FeedbackForm />
          </div>

          {/* Right Column: Approved Feedback */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Recent Feedback
            </h2>
            <Suspense fallback={<LoadingState message="Loading feedback..." />}>
              <ApprovedFeedback />
            </Suspense>
          </div>
        </div>
      </Container>
    </main>
  );
}
