import { JobFilters } from '@/components/job/JobFilters'
import JobListingsLoading from '@/components/job/JobListingsLoading';
import { JobListingsWrapper } from '@/components/job/JobListingsWrapper';
import { SearchSection } from '@/components/search/search-section';
import React, { Suspense } from 'react'


export default async function HomePage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <JobFilters />
        </aside>
        <div className="lg:col-span-3">
        <SearchSection />
          <Suspense fallback={<JobListingsLoading />}>
            <JobListingsWrapper />
          </Suspense>
        </div>
      </div>
    </div>
  )
}