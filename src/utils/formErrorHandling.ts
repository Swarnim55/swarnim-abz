import type { FormErrors } from "./formValidation";
import { parseApiError, type ApiErrorResponse } from "./errorHandling";

export const extractConflictErrors = (error: ApiErrorResponse): FormErrors => {
  const apiError = parseApiError(error);
  const formErrors: FormErrors = {};

  // For 409 errors, we only have the message, no 'fails' object
  if (apiError.status === 409) {
    const message = apiError.message.toLowerCase();

    // Check the message content to determine which fields are conflicting
    if (message.includes("email") && message.includes("phone")) {
      // Both email and phone conflict
      formErrors.email = "User with this email already exists";
      formErrors.phone = "User with this phone already exists";
    } else if (message.includes("email")) {
      // Only email conflicts
      formErrors.email = "User with this email already exists";
    } else if (message.includes("phone")) {
      // Only phone conflicts
      formErrors.phone = "User with this phone already exists";
    } else {
      // Generic conflict - highlight both fields as we can't determine which one
      formErrors.email = "User with this email already exists";
      formErrors.phone = "User with this phone already exists";
    }
  }

  return formErrors;
};

export const shouldHighlightFields = (error: ApiErrorResponse): boolean => {
  const apiError = parseApiError(error);
  return apiError.status === 422 || apiError.status === 409;
};
