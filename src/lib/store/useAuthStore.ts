import { toast } from '@/hooks/use-toast';
import { signIn } from '@/server/auth/auth-client';
import { User } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;  
    openAuthModal: () => void; 
    closeAuthModal: () => void; 
    logout: () => void;
    socialLogin: (provider: "github" | "google") => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAuthModalOpen: false, 
            openAuthModal: () => set({ isAuthModalOpen: true }), 
            closeAuthModal: () => set({ isAuthModalOpen: false }), 
            logout: () => set({ user: null, isAuthenticated: false }),
            
            socialLogin: async (provider: "github" | "google") => {
                try {
                    await signIn.social({
                        provider,
                        callbackURL: "/onboarding",
                        fetchOptions: {
                            onError: (error) => {
                                console.error("Error signing in:", error);
                                toast({
                                    title: "Error signing in",
                                    description: "Please try again",
                                    variant: "destructive",
                                })

                            },
                            onSuccess: async () => {
                                toast({
                                    title: "Signed in successfully",
                                    description: "You have been signed in successfully",
                                    variant: "default",
                                })
                                set({ isAuthModalOpen: false });
                            },

                        },
                    });
                } catch (error) {
                    console.error("Error in socialLogin:", error);
                    toast({
                        title: "Sign in failed",
                        description: "Please try again",
                        variant: "destructive",
                    })
                }
            },
        }),

        { name: 'auth-store' }
    )
);