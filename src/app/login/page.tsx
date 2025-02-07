"use client";

import { useEffect } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated, openAuthModal, isAuthModalOpen, closeAuthModal } = useAuthStore();

  useEffect(() => {
    // Open the auth modal when the page loads
    openAuthModal();
  }, [openAuthModal]);

  useEffect(() => {
    // Redirect to home page if user is authenticated
    if (isAuthenticated) {
      redirect("/");
    }
  }, [isAuthenticated]);

  // Redirect to home page when modal is closed
  const handleModalClose = () => {
    closeAuthModal();
    redirect("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleModalClose}
        title="Welcome Back"
        description="Sign in to access your account and continue your job search journey."
      />
    </main>
  );
}