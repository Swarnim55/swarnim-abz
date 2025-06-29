"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { userService } from "../../services/userService"
import type { User } from "../../types/user"
import "./UserListing.css"
import { Button, Card } from "../ui"

const UserListing: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false)

  const fetchUsers = async (page: number, append = false) => {
    try {
      if (append) {
        setShowMoreLoading(true)
      } else {
        setLoading(true)
        setError(null)
      }

      const data = await userService.getUsers(page, 6)

      // Sort users by registration timestamp (newest first)
      const sortedUsers = data.users.sort((a, b) => b.registration_timestamp - a.registration_timestamp)

      if (append) {
        setUsers((prevUsers) => [...prevUsers, ...sortedUsers])
      } else {
        setUsers(sortedUsers)
      }
      setTotalPages(data.total_pages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching users"
      setError(errorMessage)
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
      setShowMoreLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(1)
  }, [])

  const handleShowMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchUsers(nextPage, true)
  }

  const handleRetry = () => {
    setError(null)
    setCurrentPage(1)
    setUsers([])
    fetchUsers(1)
  }

  const hasMorePages = currentPage < totalPages

  if (loading && users.length === 0) {
    return (
      <section className="user-listing">
        <div className="user-listing-container">
          <div className="user-listing-content">
            <div className="loading-message">Loading users...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error && users.length === 0) {
    return (
      <section className="user-listing">
        <div className="user-listing-container">
          <div className="user-listing-content">
            <div className="error-message">
              {error}
              <br />
              <Button variant="primary" onClick={handleRetry} style={{ marginTop: "1rem" }}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="user-listing">
      <div className="user-listing-container">
        <div className="user-listing-content">
          <h2 className="user-listing-title">Working with GET request</h2>

          <div className="user-grid">
            {users.map((user) => (
              <Card key={user.id} user={user} />
            ))}
          </div>

          {hasMorePages && (
            <div className="show-more-container">
              <Button
                variant="primary"
                className="show-more-button"
                onClick={handleShowMore}
                disabled={showMoreLoading}
              >
                {showMoreLoading ? "Loading..." : "Show more"}
              </Button>
            </div>
          )}

          {error && users.length > 0 && (
            <div className="error-message" style={{ marginTop: "1rem" }}>
              Failed to load more users. Please try again.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserListing
