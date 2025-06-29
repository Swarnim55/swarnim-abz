import type React from "react"
import Button from "../Button/Button"
import "./Header.css"

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo and Title Section */}
          <div className="logo-section">
            <img src="/logo.png" alt="Logo" className="logo" />
            <img src="/header-logo.png" alt="Title Logo" className="title-logo" />
          </div>

          {/* Buttons Section */}
          <div className="buttons-section">
            <Button variant="primary">
              Login
            </Button>
            <Button variant="primary">
              Signup
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
