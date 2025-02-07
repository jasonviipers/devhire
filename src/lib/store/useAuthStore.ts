import { signIn } from '@/server/auth/auth-client';
import { User } from '@prisma/client';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;  // Add this
    openAuthModal: () => void; // Add this
    closeAuthModal: () => void; // Add this
    logout: () => void;
    savedJobs: string[];
    toggleSavedJob: (jobId: string) => void;
    socialLogin: (provider: "github" | "google") => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAuthModalOpen: false, // Add this
            openAuthModal: () => set({ isAuthModalOpen: true }), // Add this
            closeAuthModal: () => set({ isAuthModalOpen: false }), // Add this
            logout: () => set({ user: null, isAuthenticated: false }),
            savedJobs: [],
            toggleSavedJob: (jobId: string) => set((state) => ({
                savedJobs: state.savedJobs.includes(jobId)
                    ? state.savedJobs.filter((id) => id !== jobId)
                    : [...state.savedJobs, jobId]
            })),
            socialLogin: async (provider: "github" | "google") => {
                try {
                    await signIn.social({
                        provider,
                        callbackURL: "/onboarding",
                        fetchOptions: {
                            onError: (error: any) => {
                                console.error("Error signing in:", error);
                                toast.error("Failed to sign in");
                            },
                            onSuccess: async () => {
                                toast.success("Signed in successfully");
                                set({ isAuthModalOpen: false }); // Close modal after successful login
                            },
                        },
                    });
                } catch (error) {
                    console.error("Error in socialLogin:", error);
                    toast.error("Sign in failed");
                }
            },
        }),
        { name: 'auth-store' }
    )
);