"use client";

import { useState, useEffect } from "react";
import { FeedbackCard } from "./FeedbackCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { Pagination } from "@/components/common/Pagination";
import { SearchBar } from "@/components/common/SearchBar";
import type { Feedback } from "@/types/feedback";

interface FeedbackListWithPaginationProps {
  initialFeedback: Feedback[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function FeedbackListWithPagination({
  initialFeedback,
  initialPagination,
}: FeedbackListWithPaginationProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeedback = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/feedback?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setFeedback(data.results || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentPage !== 1 || searchQuery !== "") {
      fetchFeedback(currentPage, searchQuery);
    }
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search feedback by name or message..."
          isSearching={isLoading}
        />
      </div>

      {isLoading ? (
        <LoadingState message="Loading feedback..." />
      ) : feedback.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No results found" : "No feedback yet"}
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Be the first to share your thoughts!"
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {feedback.map((item) => (
              <FeedbackCard key={item.id} feedback={item} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
