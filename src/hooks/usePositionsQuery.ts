"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

export const usePositionsQuery = () => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => userService.getPositions(),
    staleTime: 10 * 60 * 1000, // 10 minutes - positions don't change often
    select: (data) => data.positions,
  });
};
