import { JobFilters } from '@/components/job/JobFilters'
import JobListings from '@/components/job/JobListings'
import JobListingsLoading from '@/components/job/JobListingsLoading';
import { SearchSection } from '@/components/search/search-section'
import React, { Suspense } from 'react'

type SearchParamsProps = {
    searchParams: Promise<{
      page?: string;
      jobTypes?: string;
      location?: string;
      query?: string;
    }>;
  };
  
export default async function page({ searchParams }: SearchParamsProps) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const jobTypes = params.jobTypes?.split(",") || [];
    const location = params.location || "";
    const query = params.query || "";
  
    // Create a composite key from all filter parameters
    const filterKey = `page=${currentPage};types=${jobTypes.join(",")};location=${location};query=${query}`;
  
  return (
    <section className="py-8 lg:py-12">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <JobFilters />
            </aside>
            <main className="lg:col-span-3">
              <SearchSection />
              <Suspense key={filterKey} fallback={<JobListingsLoading />}>
                <JobListings
                  currentPage={currentPage}
                  jobTypes={jobTypes}
                  location={location}
                />
              </Suspense>
            </main>
          </div>
        </div>
      </section>
  )
}
