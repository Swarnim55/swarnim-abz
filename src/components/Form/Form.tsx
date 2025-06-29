"use client"

import React from "react"
import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import {Button} from "../ui"
import { useRegistrationMutation, usePositionsQuery } from "../../hooks"
import { validateRegistrationForm, createInitialFormData } from "../../utils/formValidation"
import { extractValidationErrors,
  getErrorMessage,
  isValidationError,
  isConflictError,
  } from "../../utils/errorHandling"
import type { RegistrationData } from "../../types/user"
import type { FormErrors, FormData } from "../../utils/formValidation"
import "./Form.css"
import { extractConflictErrors } from "../../utils/formErrorHandling"

const RegistrationForm: React.FC = () => {
  const { data: positions = [], isLoading: positionsLoading, error: positionsError } = usePositionsQuery()
  const registrationMutation = useRegistrationMutation()

  const [formData, setFormData] = useState<FormData>(createInitialFormData())
  const [errors, setErrors] = useState<FormErrors>({})
  const [uploadText, setUploadText] = useState<string>("Upload your photo")

  // Set default position when positions load
  useEffect(() => {
    if (positions.length > 0 && !formData.position_id) {
      setFormData((prev) => ({ ...prev, position_id: positions[0].id }))
    }
  }, [positions, formData.position_id])

  const resetForm = () => {
    const initialData = createInitialFormData(positions.length > 0 ? positions[0].id : null)
    setFormData(initialData)
    setUploadText("Upload your photo")
    setErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handlePositionChange = (positionId: number) => {
    setFormData((prev) => ({ ...prev, position_id: positionId }))
    if (errors.position_id) {
      setErrors((prev) => ({ ...prev, position_id: undefined }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
      setUploadText(file.name)
      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: undefined }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setErrors({})

    // Frontend validation first
    const frontendValidationErrors = validateRegistrationForm(formData)
    if (Object.keys(frontendValidationErrors).length > 0) {
      setErrors(frontendValidationErrors)
      return
    }

    const registrationData: RegistrationData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      position_id: formData.position_id!,
      photo: formData.photo!,
    }

    registrationMutation.mutate(registrationData, {
      onSuccess: () => {
        // Show success toast
        toast.success("User successfully registered!", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "var(--color-secondary)",
            color: "white",
          },
        })

        // Reset form on success
        resetForm()
      },
      onError: (error) => {
        console.error("Registration error:", error)

        // Check if it's a validation error (422)
        if (isValidationError(error)) {
          // Extract and show field-specific validation errors
          const backendValidationErrors = extractValidationErrors(error)
          setErrors(backendValidationErrors)

          toast.error("Please fix the validation errors below.", {
            duration: 4000,
            position: "top-right",
            style: {
              background: "var(--color-error)",
              color: "white",
            },
          })
        }
        else if (isConflictError(error)) {
          const conflictErrors = extractConflictErrors(error)
          setErrors(conflictErrors)

          // Use the actual backend message
          const errorMessage = getErrorMessage(error)
          toast.error(errorMessage, {
            duration: 4000,
            position: "top-right",
            style: {
              background: "var(--color-error)",
              color: "white",
            },
          })
        } 
        else {
          const errorMessage = getErrorMessage(error)
          toast.error(errorMessage, {
            duration: 4000,
            position: "top-right",
            style: {
              background: "var(--color-error)",
              color: "white",
            },
          })
        }
      },
    })
  }

  if (positionsLoading) {
    return (
      <section className="registration-form">
        <div className="registration-form-container">
          <div className="registration-form-content">
            <div className="loading-message">Loading form...</div>
          </div>
        </div>
      </section>
    )
  }

  if (positionsError) {
    return (
      <section className="registration-form">
        <div className="registration-form-container">
          <div className="registration-form-content">
            <div className="error-message">Failed to load positions. Please refresh the page.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="registration-form">
      <div className="registration-form-container">
        <div className="registration-form-content">
          <h2 className="registration-form-title">Working with POST request</h2>

          <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className={`form-input ${errors.name ? "error" : ""}`}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+38 (XXX) XXX - XX - XX"
                  className={`form-input ${errors.phone ? "error" : ""}`}
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>

              {/* Position Selection */}
              <div className="position-group">
                <label className="position-label">Select your position</label>
                <div className="radio-group">
                  {positions.map((position) => (
                    <div key={position.id} className="radio-item">
                      <input
                        type="radio"
                        id={`position-${position.id}`}
                        name="position"
                        value={position.id}
                        checked={formData.position_id === position.id}
                        onChange={() => handlePositionChange(position.id)}
                        className="radio-input"
                      />
                      <label htmlFor={`position-${position.id}`} className="radio-label">
                        {position.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.position_id && <div className="error-message">{errors.position_id}</div>}
              </div>

              {/* Photo Upload */}
              <div className="upload-group">
                <div className="upload-container">
                  <label htmlFor="photo-upload" className="upload-button">
                    Upload
                  </label>
                  <span className="upload-text">{uploadText}</span>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="upload-input"
                  />
                </div>
                {errors.photo && <div className="error-message">{errors.photo}</div>}
              </div>

              {/* Submit Button */}
              <div className="submit-container">
                <Button
                  type="submit"
                  variant="primary"
                  className="submit-button"
                  disabled={registrationMutation.isPending}
                >
                  {registrationMutation.isPending ? "Signing up..." : "Sign up"}
                </Button>
              </div>
            </form>
          </div>

          {/* Toast Container */}
          <Toaster />
        </div>
      </div>
    </section>
  )
}

export default RegistrationForm
