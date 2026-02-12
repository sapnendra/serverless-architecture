import { FeedbackCard } from "./FeedbackCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { Feedback } from "@/types/feedback";

interface FeedbackListProps {
  feedback: Feedback[];
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  if (feedback.length === 0) {
    return (
      <EmptyState
        title="No feedback yet"
        description="Be the first to share your thoughts!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <FeedbackCard key={item.id} feedback={item} />
      ))}
    </div>
  );
}
