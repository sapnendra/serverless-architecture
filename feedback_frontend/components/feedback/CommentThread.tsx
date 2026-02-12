"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Comment } from "@/types/comment";
import { formatDateTime } from "@/lib/utils";
import { MessageSquare, Reply } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, authorName: string, content: string) => Promise<void>;
  depth?: number;
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);
    await onReply(comment.id, authorName, content);
    setIsSubmitting(false);
    setAuthorName("");
    setContent("");
    setIsReplying(false);
  };

  const maxDepth = 3;
  const marginLeft = depth > 0 ? `${Math.min(depth, maxDepth) * 2}rem` : "0";

  return (
    <div style={{ marginLeft }} className="mb-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{comment.author_name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-foreground">{comment.content}</p>
            </div>
          </div>

          {depth < maxDepth && (
            <div className="mt-3">
              {!isReplying ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(true)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              ) : (
                <div className="space-y-2 mt-2 border-l-2 border-muted pl-4">
                  <Input
                    placeholder="Your name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Textarea
                    placeholder="Write a reply..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitting}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={isSubmitting}
                    >
                      Post Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsReplying(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentThreadProps {
  feedbackId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export function CommentThread({
  feedbackId,
  comments,
  onCommentAdded,
}: CommentThreadProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId,
          authorName,
          content,
        }),
      });

      if (response.ok) {
        setAuthorName("");
        setContent("");
        setIsAdding(false);
        onCommentAdded();
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
    setIsSubmitting(false);
  };

  const handleReply = async (
    parentCommentId: string,
    authorName: string,
    content: string
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId,
          parentCommentId,
          authorName,
          content,
        }),
      });

      if (response.ok) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} variant="outline" className="mb-4">
          Add Comment
        </Button>
      ) : (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <Input
                placeholder="Your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isSubmitting}
              />
              <Textarea
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddComment} disabled={isSubmitting}>
                  Post Comment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
