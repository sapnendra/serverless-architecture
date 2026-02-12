"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Feedback } from "@/types/feedback";
import { formatDateTime } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { Check, X, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

interface AdminTableProps {
  initialFeedback: Feedback[];
}

export function AdminTable({ initialFeedback }: AdminTableProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleApprove = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    const response = await apiClient.approveFeedback(id);

    if (response.success) {
      setFeedback((prev) => prev.filter((item) => item.id !== id));
    }

    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleReject = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    const response = await apiClient.rejectFeedback(id);

    if (response.success) {
      setFeedback((prev) => prev.filter((item) => item.id !== id));
    }

    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (feedback.length === 0) {
    return (
      <EmptyState
        title="No pending feedback"
        description="All feedback has been reviewed."
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback.map((item) => {
            const isProcessing = processingIds.has(item.id);

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2">{item.message}</p>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status || "pending"} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(item.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(item.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(item.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
