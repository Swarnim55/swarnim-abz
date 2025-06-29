import type React from "react"
import Button from "../Button/Button"
import "./Hero.css"

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Test assignment for front-end developer</h1>
            <p className="hero-description">
              What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast
              understanding of User design thinking as they'll be building web interfaces with accessibility in mind.
              They should also be excited to learn, as the world of Front-End Development keeps evolving.
            </p>
            <Button variant="primary" className="hero-button">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
