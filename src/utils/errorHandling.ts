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
  let result: ApiError;

  // If it's our custom error from interceptor
  if (error.status && error.data) {
    result = {
      status: error.status,
      message: error.data.message || error.message || "",
      fails: error.data.fails, // This will be undefined for non-422 errors
    };
  }
  // If it's a standard Error object
  else if (error instanceof Error) {
    result = {
      status: 500,
      message: error.message,
    };
  }
  // Fallback
  else {
    result = {
      status: 500,
      message: "An unexpected error occurred",
    };
  }

  return result;
};

export const extractValidationErrors = (
  error: ApiErrorResponse
): FormErrors => {
  const apiError = parseApiError(error);
  const formErrors: FormErrors = {};

  // Only 422 errors have the 'fails' object
  if (apiError.status === 422 && apiError.fails) {
    // Map backend field errors to form errors
    Object.entries(apiError.fails).forEach(([field, messages]) => {
      if (messages && messages.length > 0) {
        // Take the first error message for each field
        formErrors[field as keyof FormErrors] = messages[0];
      }
    });
  }

  return formErrors;
};

export const getErrorMessage = (error: ApiErrorResponse): string => {
  const apiError = parseApiError(error);

  let message: string;

  switch (apiError.status) {
    case 401:
      message = "The token expired. Please try again.";
      break;
    case 409:
      // Use the actual message from the backend
      message =
        apiError.message || "User with this phone or email already exists.";
      break;
    case 422:
      message = "Please fix the validation errors below.";
      break;
    default:
      // For all other errors, use the backend message
      message = apiError.message || "Registration failed. Please try again.";
  }

  return message;
};

export const isValidationError = (error: ApiErrorResponse): boolean => {
  const apiError = parseApiError(error);
  const result = apiError.status === 422 && !!apiError.fails;

  return result;
};

export const isConflictError = (error: ApiErrorResponse): boolean => {
  const apiError = parseApiError(error);
  const result = apiError.status === 409;

  return result;
};
