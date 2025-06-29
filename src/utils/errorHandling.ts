import type { FormErrors } from "./formValidation";

export interface ApiError {
  status: number;
  message: string;
  fails?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  status?: number;
  data?: {
    message?: string;
    fails?: Record<string, string[]>;
  };
  message?: string;
}

export const parseApiError = (error: ApiErrorResponse): ApiError => {
  if (error.status && error.data) {
    return {
      status: error.status,
      message: error.data.message || error.message || "Unknown error",
      fails: error.data.fails,
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: "An unexpected error occurred",
  };
};

export const extractValidationErrors = (
  error: ApiErrorResponse
): FormErrors => {
  const apiError = parseApiError(error);
  const formErrors: FormErrors = {};

  if (apiError.status === 422 && apiError.fails) {
    Object.entries(apiError.fails).forEach(([field, messages]) => {
      if (messages && messages.length > 0) {
        formErrors[field as keyof FormErrors] = messages[0];
      }
    });
  }

  return formErrors;
};

export const getErrorMessage = (error: ApiErrorResponse): string => {
  const apiError = parseApiError(error);

  switch (apiError.status) {
    case 401:
      return "The token expired. Please try again.";
    case 409:
      return "User with this phone or email already exists.";
    case 422:
      return "Please fix the validation errors below.";
    default:
      return apiError.message || "Registration failed. Please try again.";
  }
};

export const isValidationError = (error: ApiErrorResponse): boolean => {
  const apiError = parseApiError(error);
  return apiError.status === 422 && !!apiError.fails;
};

export const isConflictError = (error: ApiErrorResponse): boolean => {
  const apiError = parseApiError(error);
  return apiError.status === 409;
};

export const shouldHighlightFields = (error: ApiErrorResponse): boolean => {
  return isValidationError(error) || isConflictError(error);
};
