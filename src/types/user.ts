export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  position_id: number;
  registration_timestamp: number;
  photo: string;
}

export interface ApiResponse {
  success: boolean;
  total_pages: number;
  total_users: number;
  count: number;
  page: number;
  links: {
    next_url: string | null;
    prev_url: string | null;
  };
  users: User[];
}

export interface Position {
  id: number;
  name: string;
}

export interface PositionsResponse {
  success: boolean;
  positions: Position[];
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  position_id: number;
  photo: File;
}

export interface TokenResponse {
  success: boolean;
  token: string;
}

export interface RegistrationResponse {
  success: boolean;
  user_id?: number;
  message?: string;
}
