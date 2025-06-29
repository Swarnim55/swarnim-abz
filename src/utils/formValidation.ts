export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  position_id?: string;
  photo?: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  position_id: number | null;
  photo: File | null;
}

export const validateRegistrationForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation (2-60 characters)
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.length < 2 || formData.name.length > 60) {
    errors.name = "Name should be 2-60 characters";
  }

  // Email validation (RFC2822)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Phone validation (Ukraine +380)
  const phoneRegex = /^\+380\d{9}$/;
  if (!formData.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = "Phone should start with +380 and contain 12 digits";
  }

  // Position validation
  if (!formData.position_id) {
    errors.position_id = "Please select a position";
  }

  // Photo validation
  if (!formData.photo) {
    errors.photo = "Photo is required";
  } else {
    const file = formData.photo;
    const validTypes = ["image/jpeg", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      errors.photo = "Photo must be a JPG/JPEG image";
    } else if (file.size > maxSize) {
      errors.photo = "Photo size must not exceed 5MB";
    }
  }

  return errors;
};

export const createInitialFormData = (
  defaultPositionId: number | null = null
): FormData => ({
  name: "",
  email: "",
  phone: "",
  position_id: defaultPositionId,
  photo: null,
});
