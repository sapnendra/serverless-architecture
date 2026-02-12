"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommentThread } from "@/components/feedback/CommentThread";
import { ArrowLeft } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { Feedback } from "@/types/feedback";
import type { Comment } from "@/types/comment";
import Link from "next/link";

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const feedbackId = params.id as string;

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch feedback details
      const feedbackRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/feedback`
      );
      const feedbackData = await feedbackRes.json();
      
      if (feedbackData.success) {
        const found = feedbackData.results?.find((f: Feedback) => f.id === feedbackId);
        setFeedback(found || null);
      }

      // Fetch comments
      const commentsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${feedbackId}`
      );
      const commentsData = await commentsRes.json();
      
      if (commentsData.success) {
        setComments(commentsData.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [feedbackId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <Container>
          <LoadingState message="Loading feedback..." />
        </Container>
      </main>
    );
  }

  if (!feedback) {
    return (
      <main className="min-h-screen bg-background py-12">
        <Container>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Feedback not found</h2>
            <Link href="/">
              <Button>Go Back Home</Button>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <Container>
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feedback
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{feedback.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(feedback.created_at)}
                </p>
              </div>
              <p className="text-base leading-relaxed">{feedback.message}</p>
            </div>
          </CardContent>
        </Card>

        <CommentThread
          feedbackId={feedbackId}
          comments={comments}
          onCommentAdded={fetchData}
        />
      </Container>
    </main>
  );
}
