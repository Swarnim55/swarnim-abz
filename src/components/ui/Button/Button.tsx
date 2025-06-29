import type React from "react"
import "./Button.css"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error"
  size?: "small" | "medium" | "large"
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  const getButtonClasses = () => {
    const baseClass = "button"
    const variantClass = `button-${variant}`
    const sizeClass = size !== "medium" ? `button-${size}` : ""

    return [baseClass, variantClass, sizeClass, className].filter(Boolean).join(" ")
  }

  return (
    <button className={getButtonClasses()} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
