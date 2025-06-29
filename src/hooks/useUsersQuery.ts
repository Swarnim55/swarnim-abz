"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import type { User } from "../types/user";

interface UseUsersQueryOptions {
  page?: number;
  count?: number;
}

export const useUsersQuery = ({
  page = 1,
  count = 6,
}: UseUsersQueryOptions = {}) => {
  return useQuery({
    queryKey: ["users", page, count],
    queryFn: () => userService.getUsers(page, count),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for infinite loading pattern
export const useUsersInfinite = () => {
  const queryClient = useQueryClient();
  const pageSize = 6;

  const fetchUsers = async (
    page: number
  ): Promise<{ users: User[]; hasMore: boolean; totalPages: number }> => {
    const response = await userService.getUsers(page, pageSize);
    // Sort users by registration timestamp (newest first)
    const sortedUsers = response.users.sort(
      (a, b) => b.registration_timestamp - a.registration_timestamp
    );

    return {
      users: sortedUsers,
      hasMore: page < response.total_pages,
      totalPages: response.total_pages,
    };
  };

  const {
    data: firstPageData,
    isLoading: isFirstPageLoading,
    error: firstPageError,
    refetch: refetchFirstPage,
  } = useQuery({
    queryKey: ["users", 1, pageSize],
    queryFn: () => fetchUsers(1),
    staleTime: 5 * 60 * 1000,
  });

  const loadMoreUsers = async (currentUsers: User[], currentPage: number) => {
    const nextPage = currentPage + 1;
    const response = await fetchUsers(nextPage);
    return {
      users: [...currentUsers, ...response.users],
      page: nextPage,
      hasMore: response.hasMore,
      totalPages: response.totalPages,
    };
  };

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return {
    firstPageData,
    isFirstPageLoading,
    firstPageError,
    refetchFirstPage,
    loadMoreUsers,
    invalidateUsers,
  };
};
