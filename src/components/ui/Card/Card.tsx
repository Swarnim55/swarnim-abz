import type React from "react"
import "./Card.css"
import type { User } from "../../../types/user"

interface CardProps {
  user: User
}

const Card: React.FC<CardProps> = ({ user }) => {
  return (
    <div className="card">
      <img src={user.photo || "/placeholder.svg"} alt={user.name} className="card-image" />
      <h3 className="card-name">{user.name}</h3>
      <div className="card-details">
        <div className="card-position">{user.position}</div>
        <div className="card-email">{user.email}</div>
        <div className="card-phone">{user.phone}</div>
      </div>
    </div>
  )
}

export default Card
