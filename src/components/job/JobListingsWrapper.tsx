'use client'

import { useSearchParams } from "next/navigation"
import { JobListings } from "./JobListings"

export function JobListingsWrapper() {
  const searchParams = useSearchParams()
  
  const currentPage = parseInt(searchParams.get('page') || '1')
  const jobTypes = searchParams.get('jobTypes')?.split(',').filter(Boolean) || []
  const location = searchParams.get('location') || ''

  return (
    <JobListings
      currentPage={currentPage}
      jobTypes={jobTypes}
      location={location}
    />
  )
}