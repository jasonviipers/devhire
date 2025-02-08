import { Company } from '@/types/job-types';
import { create } from 'zustand';

interface CompanyState {
    company: Company | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCompany: (company: Company | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Fetch Actions
    fetchCompany: (id: string) => Promise<void>;
    updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
    createCompany: (data: Partial<Company>) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()((set) => ({
    company: null,
    isLoading: false,
    error: null,

    setCompany: (company) => set({ company }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    fetchCompany: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch(`/api/companies/${id}`);
            const company = await response.json();
            set({ company });
        } catch (error) {
            set({ error: 'Failed to fetch company' });
        } finally {
            set({ isLoading: false });
        }
    },

    updateCompany: async (id, data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch(`/api/companies/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const updatedCompany = await response.json();
            set({ company: updatedCompany });
        } catch (error) {
            set({ error: 'Failed to update company' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createCompany: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const newCompany = await response.json();
            set({ company: newCompany });
        } catch (error) {
            set({ error: 'Failed to create company' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));