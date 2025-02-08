'use client'
import { JobCard } from "./job-card"
import { EmptyState } from "../global/EmptyState"
import { PaginationComponent } from "../global/PaginationComponent"
import { useJobStore } from "@/lib/store/useJobStore"
import { useEffect } from "react"

interface JobListingsProps {
  currentPage: number
  jobTypes: string[]
  location: string
}

export function JobListings({ currentPage, jobTypes, location }: JobListingsProps) {
  const { jobs, totalPages, isLoading, error, setFilters, fetchJobs } = useJobStore()

  useEffect(() => {
    setFilters({ page: currentPage, jobTypes, location })
    fetchJobs()
  }, [currentPage, jobTypes, location, setFilters, fetchJobs])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading jobs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Error loading jobs"
          description={error}
          buttonText="Try again"
          href="#"
        />
      </div>
    )
  }

  return (
    <>
      {jobs.length > 0 ? (
         <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location."
          buttonText="Clear all filters"
          href="/"
        />
      )}
      
      {jobs.length > 0 && (
        <div className="flex justify-center mt-6">
          <PaginationComponent 
            totalPages={totalPages} 
            currentPage={currentPage} 
          />
        </div>
      )}
    </>
  )
}