'use client'
import { Job, JobFilters } from '@/types/job-types';
import { create } from 'zustand';


interface JobState {
    jobs: Job[];
    totalPages: number;
    currentPage: number;
    filters: JobFilters;
    isLoading: boolean;
    error: string | null;
    savedJobs: string[];

    // Actions
    setJobs: (jobs: Job[]) => void;
    setFilters: (filters: Partial<JobFilters>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPagination: (currentPage: number, totalPages: number) => void;
    toggleSavedJob: (jobId: string) => void;


    // Fetch Actions
    fetchJobs: () => Promise<void>;
    fetchJobById: (id: string) => Promise<Job | null>;
    createJob: (jobData: Partial<Job>) => Promise<Job>;
    updateJob: (id: string, jobData: Partial<Job>) => Promise<Job>;
    deleteJob: (id: string) => Promise<void>;
}

export const useJobStore = create<JobState>()((set, get) => ({
    jobs: [],
    totalPages: 0,
    currentPage: 1,
    filters: {
        page: 1,
        jobTypes: [],
        location: '',
        query: '',
    },
    isLoading: false,
    error: null,
    savedJobs: [],

    toggleSavedJob: (jobId) => set((state) => ({
        savedJobs: state.savedJobs.includes(jobId)
            ? state.savedJobs.filter((id) => id !== jobId)
            : [...state.savedJobs, jobId]
    })),

    setJobs: (jobs) => set({ jobs }),
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),


    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setPagination: (currentPage, totalPages) => set({ currentPage, totalPages }),

    fetchJobs: async () => {
        const { filters } = get();
        try {
            set({ isLoading: true, error: null });
            const response = await fetch(`/api/jobs?${new URLSearchParams({
                page: filters.page.toString(),
                jobTypes: filters.jobTypes.join(','),
                location: filters.location,
                query: filters.query,
                ...(filters.minSalary && { minSalary: filters.minSalary.toString() }),
                ...(filters.maxSalary && { maxSalary: filters.maxSalary.toString() }),
            })}`);

            const data = await response.json();
            set({
                jobs: data.jobs,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            });
        } catch (error) {
            set({ error: 'Failed to fetch jobs' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchJobById: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch(`/api/jobs/${id}`);
            const job = await response.json();
            return job;
        } catch (error) {
            set({ error: 'Failed to fetch job' });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    createJob: async (jobData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData),
            });
            const job = await response.json();
            console.log("Job posted successfully from store:", job);
            set((state) => ({ jobs: [...state.jobs, job] }));
            return job;
        } catch (error) {
            set({ error: 'Failed to create job' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateJob: async (id, jobData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch(`/api/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData),
            });
            const updatedJob = await response.json();
            set((state) => ({
                jobs: state.jobs.map((job) =>
                    job.id === id ? updatedJob : job
                ),
            }));
            return updatedJob;
        } catch (error) {
            set({ error: 'Failed to update job' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteJob: async (id) => {
        try {
            set({ isLoading: true, error: null });
            await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            set((state) => ({
                jobs: state.jobs.filter((job) => job.id !== id),
            }));
        } catch (error) {
            set({ error: 'Failed to delete job' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));