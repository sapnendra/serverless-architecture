import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Feedback } from "@/types/feedback";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-foreground">{feedback.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(feedback.created_at)}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {feedback.message}
          </p>
          <div className="pt-2">
            <Link href={`/feedback/${feedback.id}`}>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-3 w-3 mr-1" />
                View & Comment
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
