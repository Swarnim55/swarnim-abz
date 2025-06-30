"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import type { RegistrationData } from "../types/user";

export const useRegistrationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegistrationData) => {
      // Get registration token
      const tokenResponse = await userService.getToken();

      // Register user
      const result = await userService.registerUser(data, tokenResponse.token);

      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};
