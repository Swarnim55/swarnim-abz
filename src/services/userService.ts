import { api } from "./apiClient";
import type {
  ApiResponse,
  PositionsResponse,
  RegistrationData,
  TokenResponse,
  RegistrationResponse,
} from "../types/user";

const USER_ENDPOINTS = {
  USERS: "/users",
  USER_BY_ID: (id: number) => `/users/${id}`,
  POSITIONS: "/positions",
  TOKEN: "/token",
  REGISTER: "/users",
} as const;

export const userService = {
  getUsers: async (page = 1, count = 6): Promise<ApiResponse> => {
    const response = await api.get<ApiResponse>(USER_ENDPOINTS.USERS, {
      params: {
        page,
        count,
      },
    });

    if (!response.success) {
      throw new Error("API returned unsuccessful response");
    }

    return response;
  },

  getPositions: async (): Promise<PositionsResponse> => {
    const response = await api.get<PositionsResponse>(USER_ENDPOINTS.POSITIONS);

    if (!response.success) {
      throw new Error("Failed to fetch positions");
    }

    return response;
  },

  getToken: async (): Promise<TokenResponse> => {
    const response = await api.get<TokenResponse>(USER_ENDPOINTS.TOKEN);

    if (!response.success) {
      throw new Error("Failed to get registration token");
    }

    return response;
  },

  registerUser: async (
    data: RegistrationData,
    token: string
  ): Promise<RegistrationResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("position_id", data.position_id.toString());
    formData.append("photo", data.photo);

    const response = await api.post<RegistrationResponse>(
      USER_ENDPOINTS.REGISTER,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Token: token,
        },
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Registration failed");
    }

    return response;
  },
};

export default userService;
