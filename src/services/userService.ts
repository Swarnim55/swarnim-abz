import type { ApiResponse } from "../types/user";
import api from "./apiClient";

// User API endpoints
const USER_ENDPOINTS = {
  USERS: "/users",
  USER_BY_ID: (id: number) => `/users/${id}`,
} as const;

export const userService = {
  getUsers: async (page = 1, count = 6): Promise<ApiResponse> => {
    try {
      console.log(`Fetching users: page ${page}, count ${count}`);

      const response = await api.get<ApiResponse>(USER_ENDPOINTS.USERS, {
        params: {
          page,
          count,
        },
      });

      if (!response.success) {
        throw new Error("API returned unsuccessful response");
      }

      console.log(`Successfully fetched ${response.users.length} users`);
      return response;
    } catch (error) {
      console.error("Error in userService.getUsers:", error);
      throw error;
    }
  },
};

export default userService;
