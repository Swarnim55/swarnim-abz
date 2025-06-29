"use client"

import React from "react"
import { useState } from "react"
import {Card, Button} from "../ui"
import { useUsersInfinite } from "../../hooks/useUsersQuery"
import type { User } from "../../types/user"
import "./UserListing.css"

const UserListing: React.FC = () => {
  const { firstPageData, isFirstPageLoading, firstPageError, refetchFirstPage, loadMoreUsers } =
    useUsersInfinite()

  const [allUsers, setAllUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)

  // Update state when first page data changes
  React.useEffect(() => {
    if (firstPageData) {
      setAllUsers(firstPageData.users)
      setCurrentPage(1)
      setTotalPages(firstPageData.totalPages)
    }
  }, [firstPageData])

  const handleLoadMore = async () => {
    if (isLoadingMore || currentPage >= totalPages) return

    setIsLoadingMore(true)
    setLoadMoreError(null)

    try {
      const result = await loadMoreUsers(allUsers, currentPage)
      setAllUsers(result.users)
      setCurrentPage(result.page)
      setTotalPages(result.totalPages)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load more users"
      setLoadMoreError(errorMessage)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleRetry = () => {
    setLoadMoreError(null)
    refetchFirstPage()
  }

  if (isFirstPageLoading) {
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

  if (firstPageError && allUsers.length === 0) {
    return (
      <section className="user-listing">
        <div className="user-listing-container">
          <div className="user-listing-content">
            <div className="error-message">
              {firstPageError instanceof Error ? firstPageError.message : "Failed to load users"}
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

  const hasMorePages = currentPage < totalPages

  return (
    <section className="user-listing">
      <div className="user-listing-container">
        <div className="user-listing-content">
          <h2 className="user-listing-title">Working with GET request</h2>

          <div className="user-grid">
            {allUsers.map((user) => (
              <Card key={user.id} user={user} />
            ))}
          </div>

          {hasMorePages && (
            <div className="show-more-container">
              <Button variant="primary" className="show-more-button" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? "Loading..." : "Show more"}
              </Button>
            </div>
          )}

          {loadMoreError && (
            <div className="error-message" style={{ marginTop: "1rem" }}>
              {loadMoreError}
              <br />
              <Button variant="primary" onClick={handleLoadMore} style={{ marginTop: "0.5rem" }}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserListing
